import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { apiService } from '../services/apiService'
import { Client, CreateClientRequest } from '../types/client'
import Layout from '../components/Layout'
import Card from '../components/Card'
import Button from '../components/Button'
import ClientModal from '../components/ClientModal'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import Pagination from '../components/Pagination'
import SearchInput from '../components/SearchInput'

const ClientsPage = () => {
  const { state, dispatch } = useAppContext()
  const navigate = useNavigate()
  const [showClientModal, setShowClientModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [totalClients, setTotalClients] = useState<number>(0)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)

  useEffect(() => {
    const storedName = localStorage.getItem('userName')
    if (!state.userName && !storedName) {
      navigate('/')
      return
    }
    
    if (!state.userName && storedName) {
      dispatch({ type: 'SET_USER_NAME', payload: storedName })
    }
  }, [state.userName, dispatch, navigate])

  useEffect(() => {
    loadClients()
  }, [state.currentPage, state.itemsPerPage, state.searchTerm])

  const loadClients = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      dispatch({ type: 'SET_SUCCESS', payload: null })
      
      let response;
      
      if (state.searchTerm.trim()) {
        // Se há termo de pesquisa, usar busca
        dispatch({ type: 'SET_IS_SEARCHING', payload: true })
        response = await apiService.searchClients(state.searchTerm, state.currentPage, state.itemsPerPage)
      } else {
        // Caso contrário, buscar todos
        dispatch({ type: 'SET_IS_SEARCHING', payload: false })
        response = await apiService.getClients(state.currentPage, state.itemsPerPage)
      }
      
      dispatch({ type: 'SET_CLIENTS', payload: response.clients })
      dispatch({ 
        type: 'SET_PAGINATION', 
        payload: {
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          itemsPerPage: state.itemsPerPage
        }
      })
      
      // Calcular total de clientes baseado na resposta da API
      const estimatedTotal = response.totalClients || response.totalItems || (response.totalPages * state.itemsPerPage)
      setTotalClients(estimatedTotal)
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar clientes' })
      console.error('Erro ao carregar clientes:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const handleSubmit = async (formData: CreateClientRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      dispatch({ type: 'SET_SUCCESS', payload: null })
      
      if (editingClient) {
        // Atualizar cliente existente
        const updatedClient = await apiService.updateClient(editingClient.id, formData)
        dispatch({ type: 'UPDATE_CLIENT', payload: updatedClient })
        dispatch({ type: 'SET_SUCCESS', payload: 'Cliente atualizado com sucesso!' })
      } else {
        // Criar novo cliente
        const newClient = await apiService.createClient(formData)
        dispatch({ type: 'ADD_CLIENT', payload: newClient })
        dispatch({ type: 'SET_SUCCESS', payload: 'Cliente criado com sucesso!' })
      }
      
      // Fechar modal e resetar estado
      setShowClientModal(false)
      setEditingClient(null)
      
      // Remove mensagem de sucesso após 3 segundos
      setTimeout(() => {
        dispatch({ type: 'SET_SUCCESS', payload: null })
      }, 3000)
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao salvar cliente' })
      console.error('Erro ao salvar cliente:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setShowClientModal(true)
  }

  const handleDelete = (client: Client) => {
    setClientToDelete(client)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!clientToDelete) return
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      dispatch({ type: 'SET_SUCCESS', payload: null })
      
      // Chama API para excluir
      await apiService.deleteClient(clientToDelete.id)
      
      // Remove da lista local
      dispatch({ type: 'REMOVE_CLIENT', payload: clientToDelete.id })
      
      // Mostra mensagem de sucesso
      dispatch({ type: 'SET_SUCCESS', payload: `Cliente "${clientToDelete.name}" foi excluído com sucesso!` })
      
      // Fecha modal e reseta estado
      setShowDeleteModal(false)
      setClientToDelete(null)
      
      // Remove mensagem de sucesso após 3 segundos
      setTimeout(() => {
        dispatch({ type: 'SET_SUCCESS', payload: null })
      }, 3000)
      
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao excluir cliente. Tente novamente.' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const handleToggleSelect = (clientId: number) => {
    dispatch({ type: 'TOGGLE_SELECT_CLIENT', payload: clientId })
  }

  const handlePageChange = (page: number) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page })
  }

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    dispatch({ type: 'SET_ITEMS_PER_PAGE', payload: itemsPerPage })
  }

  const handleSearch = (searchTerm: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: searchTerm })
  }

  const handleClearSearch = () => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: '' })
    dispatch({ type: 'SET_IS_SEARCHING', payload: false })
  }

  if (!state.userName) {
    return null // Evita renderização enquanto redireciona
  }

  return (
    <Layout>
      <div>
        {/* Actions Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: window.innerWidth < 768 ? 'flex-start' : 'center',
          marginBottom: '2rem',
          flexDirection: window.innerWidth < 768 ? 'column' : 'row',
          gap: window.innerWidth < 768 ? '1rem' : '0'
        }}>
          <div>
            <h2 style={{ 
              margin: 0, 
              fontSize: window.innerWidth < 768 ? '1.1rem' : '1.25rem', 
              fontWeight: '600',
              color: '#2d3748'
            }}>
              {state.searchTerm 
                ? `${state.clients.length} cliente${state.clients.length !== 1 ? 's' : ''} encontrado${state.clients.length !== 1 ? 's' : ''} para "${state.searchTerm}"`
                : `${state.clients.length} cliente${state.clients.length !== 1 ? 's' : ''} encontrado${state.clients.length !== 1 ? 's' : ''}:`
              }
            </h2>
          </div>
          
          <div>
            <Button
              onClick={() => {
                setEditingClient(null)
                setShowClientModal(true)
              }}
              variant="primary"
              style={{
                width: window.innerWidth < 768 ? '100%' : 'auto'
              }}
            >
              Criar cliente
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ 
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: window.innerWidth < 768 ? 'column' : 'row',
          gap: '1rem',
          alignItems: window.innerWidth < 768 ? 'stretch' : 'center'
        }}>
          <SearchInput
            value={state.searchTerm}
            onChange={handleSearch}
            onClear={handleClearSearch}
            placeholder="Pesquisar clientes por nome..."
          />
          
          {state.isSearching && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#6b7280',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid #ff6b35',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Pesquisando...
            </div>
          )}
        </div>

        {/* Success Message */}
        {state.success && (
          <Card style={{
            backgroundColor: '#c6f6d5',
            borderColor: '#68d391',
            marginBottom: '1rem'
          }}>
            <div style={{ color: '#2f855a' }}>
              {state.success}
            </div>
          </Card>
        )}

        {/* Error Message */}
        {state.error && (
          <Card style={{
            backgroundColor: '#fed7d7',
            borderColor: '#fc8181',
            marginBottom: '1rem'
          }}>
            <div style={{ color: '#c53030' }}>
              {state.error}
            </div>
          </Card>
        )}

        {/* Loading */}
        {state.loading && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #ff6b35',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ marginTop: '1rem', color: '#718096' }}>Carregando...</p>
          </div>
        )}

        {/* Lista de clientes */}
        {!state.loading && (
          <div>
            {state.clients.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: '3rem' }}>
                <h3 style={{ color: '#718096', marginBottom: '0.5rem' }}>
                  Nenhum cliente cadastrado
                </h3>
                <p style={{ color: '#a0aec0', margin: 0 }}>
                  Clique em "Criar cliente" para começar!
                </p>
              </Card>
            ) : (
              <div style={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))'
              }}>
                {state.clients.map((client) => (
                  <Card
                    key={client.id}
                    isSelected={state.selectedClients.includes(client.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ 
                          margin: '0 0 0.75rem 0', 
                          color: '#2d3748',
                          fontSize: '1.1rem',
                          fontWeight: '600'
                        }}>
                          {client.name}
                        </h4>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span style={{ 
                            fontSize: '0.85rem', 
                            color: '#718096',
                            display: 'block'
                          }}>
                            Salário: <strong style={{ color: '#2d3748' }}>
                              R$ {client.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </strong>
                          </span>
                        </div>
                        <div>
                          <span style={{ 
                            fontSize: '0.85rem', 
                            color: '#718096',
                            display: 'block'
                          }}>
                            Empresa: <strong style={{ color: '#2d3748' }}>
                              R$ {client.companyValuation.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </strong>
                          </span>
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={state.selectedClients.includes(client.id)}
                        onChange={() => handleToggleSelect(client.id)}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                          accentColor: '#ff6b35'
                        }}
                      />
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      gap: '0.5rem', 
                      justifyContent: 'flex-end',
                      flexWrap: 'wrap'
                    }}>
                      <Button
                        size="small"
                        variant="warning"
                        onClick={() => handleEdit(client)}
                      >
                        Editar
                      </Button>
                      
                      <Button
                        size="small"
                        variant="danger"
                        onClick={() => handleDelete(client)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={state.currentPage}
              totalPages={state.totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={state.itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              totalItems={totalClients}
              isLoading={state.loading}
            />

            {/* Clear Selection Button */}
            {state.selectedClients.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Button
                  variant="secondary"
                  onClick={() => dispatch({ type: 'CLEAR_SELECTED_CLIENTS' })}
                  style={{ 
                    borderColor: '#ff6b35', 
                    color: '#ff6b35',
                    backgroundColor: 'transparent'
                  }}
                >
                  Criar cliente
                </Button>
              </div>
            )}
          </div>
        )}

        {/* CSS para animação de loading */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>

        {/* Modals */}
        <ClientModal
          isOpen={showClientModal}
          onClose={() => {
            setShowClientModal(false)
            setEditingClient(null)
          }}
          onSubmit={handleSubmit}
          client={editingClient}
          isLoading={state.loading}
        />

        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setClientToDelete(null)
          }}
          onConfirm={confirmDelete}
          clientName={clientToDelete?.name || ''}
          isLoading={state.loading}
        />
      </div>
    </Layout>
  )
}

export default ClientsPage
