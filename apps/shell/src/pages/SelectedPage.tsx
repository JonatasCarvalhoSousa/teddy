import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import Layout from '../components/Layout'
import Card from '../components/Card'
import Button from '../components/Button'
import ClientModal from '../components/ClientModal'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import Pagination from '../components/Pagination'
import SearchInput from '../components/SearchInput'
import { Client, CreateClientRequest } from '../types/client'
import { apiService } from '../services/apiService'

const SelectedPage = () => {
  const { state, dispatch } = useAppContext()
  const navigate = useNavigate()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  
  const [selectedPage, setSelectedPage] = useState(1)
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(16)
  const [localSearchTerm, setLocalSearchTerm] = useState('')

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

  const allSelectedClients = state.clients.filter(client => 
    state.selectedClients.includes(client.id)
  )

  // Filtrar por pesquisa local
  const filteredSelectedClients = localSearchTerm.trim() 
    ? allSelectedClients.filter(client =>
        client.name.toLowerCase().includes(localSearchTerm.toLowerCase())
      )
    : allSelectedClients
  
  const totalSelectedPages = Math.ceil(filteredSelectedClients.length / selectedItemsPerPage)
  const startIndex = (selectedPage - 1) * selectedItemsPerPage
  const endIndex = startIndex + selectedItemsPerPage
  const selectedClients = filteredSelectedClients.slice(startIndex, endIndex)

  const handleRemoveFromSelection = (clientId: number) => {
    dispatch({ type: 'TOGGLE_SELECT_CLIENT', payload: clientId })
  }

  const handleClearAllSelection = () => {
    dispatch({ type: 'CLEAR_SELECTED_CLIENTS' })
    setSelectedPage(1) 
  }

  const handleSelectedPageChange = (page: number) => {
    setSelectedPage(page)
  }

  const handleSelectedItemsPerPageChange = (itemsPerPage: number) => {
    setSelectedItemsPerPage(itemsPerPage)
    setSelectedPage(1)
  }

  const handleEditClient = async (formData: CreateClientRequest) => {
    if (!editingClient) return
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      dispatch({ type: 'SET_SUCCESS', payload: null })
      
      const updatedClient = await apiService.updateClient(editingClient.id, formData)
      dispatch({ type: 'UPDATE_CLIENT', payload: updatedClient })
      dispatch({ type: 'SET_SUCCESS', payload: 'Cliente atualizado com sucesso!' })
      
      setShowEditModal(false)
      setEditingClient(null)
      
      setTimeout(() => {
        dispatch({ type: 'SET_SUCCESS', payload: null })
      }, 3000)
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar cliente' })
      console.error('Erro ao atualizar cliente:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const handleDeleteClient = async () => {
    if (!clientToDelete) return
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      dispatch({ type: 'SET_SUCCESS', payload: null })
      
      await apiService.deleteClient(clientToDelete.id)
      
      dispatch({ type: 'REMOVE_CLIENT', payload: clientToDelete.id })
      
      dispatch({ type: 'SET_SUCCESS', payload: `Cliente "${clientToDelete.name}" foi excluído com sucesso!` })
      
      setShowDeleteModal(false)
      setClientToDelete(null)
      
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

  const handleLocalSearch = (searchTerm: string) => {
    setLocalSearchTerm(searchTerm)
    setSelectedPage(1) // Reset para página 1 ao pesquisar
  }

  const handleClearLocalSearch = () => {
    setLocalSearchTerm('')
    setSelectedPage(1)
  }

  const totalSalary = allSelectedClients.reduce((sum, client) => sum + client.salary, 0)
  const totalCompanyValue = allSelectedClients.reduce((sum, client) => sum + client.companyValuation, 0)

  if (!state.userName) {
    return null 
  }

  return (
    <Layout>
      <div>
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

        {allSelectedClients.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2 style={{ color: '#718096', marginBottom: '1rem' }}>
              Nenhum cliente selecionado
            </h2>
            <p style={{ color: '#a0aec0', marginBottom: '2rem', fontSize: '1.1rem' }}>
              Volte para a página de clientes e selecione os clientes que deseja visualizar aqui.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/clients')}
            >
              Ir para Clientes
            </Button>
          </Card>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 768 
                ? '1fr' 
                : 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '600', color: '#ff6b35' }}>
                    {allSelectedClients.length}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                    Cliente{allSelectedClients.length > 1 ? 's' : ''} selecionado{allSelectedClients.length > 1 ? 's' : ''}
                  </div>
                </div>
              </Card>

              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#38a169' }}>
                    R$ {totalSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                    Total em salários
                  </div>
                </div>
              </Card>

              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#3182ce' }}>
                    R$ {totalCompanyValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                    Total em empresas
                  </div>
                </div>
              </Card>
            </div>

            {/* Search Bar for Selected Clients */}
            <div style={{ 
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: window.innerWidth < 768 ? 'column' : 'row',
              gap: '1rem',
              alignItems: window.innerWidth < 768 ? 'stretch' : 'center'
            }}>
              <SearchInput
                value={localSearchTerm}
                onChange={handleLocalSearch}
                onClear={handleClearLocalSearch}
                placeholder="Pesquisar entre clientes selecionados..."
              />
              
              {localSearchTerm && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#6b7280',
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap'
                }}>
                  📋 {filteredSelectedClients.length} de {allSelectedClients.length} clientes
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: window.innerWidth < 768 ? 'flex-start' : 'center',
              marginBottom: '2rem',
              flexDirection: window.innerWidth < 768 ? 'column' : 'row',
              gap: window.innerWidth < 768 ? '1rem' : '0'
            }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: window.innerWidth < 768 ? '1.1rem' : '1.25rem', 
                fontWeight: '600',
                color: '#2d3748'
              }}>
                {localSearchTerm 
                  ? `${filteredSelectedClients.length} cliente${filteredSelectedClients.length !== 1 ? 's' : ''} encontrado${filteredSelectedClients.length !== 1 ? 's' : ''} para "${localSearchTerm}"`
                  : `${allSelectedClients.length} cliente${allSelectedClients.length !== 1 ? 's' : ''} selecionado${allSelectedClients.length !== 1 ? 's' : ''}:`
                }
              </h2>
              
              <Button
                variant="secondary"
                onClick={handleClearAllSelection}
                style={{ 
                  borderColor: '#ff6b35', 
                  color: '#ff6b35',
                  backgroundColor: 'transparent',
                  width: window.innerWidth < 768 ? '100%' : 'auto'
                }}
              >
                Criar cliente
              </Button>
            </div>

            <div style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))'
            }}>
              {selectedClients.map((client) => (
                <Card key={client.id}>
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

                    <Button
                      size="small"
                      variant="danger"
                      onClick={() => handleRemoveFromSelection(client.id)}
                      style={{ 
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        padding: '0',
                        minWidth: 'auto'
                      }}
                    >
                      ×
                    </Button>
                  </div>                    <div style={{ 
                      display: 'flex', 
                      gap: '0.5rem', 
                      justifyContent: 'flex-end'
                    }}>
                      <Button
                        size="small"
                        variant="warning"
                        onClick={() => {
                          setEditingClient(client)
                          setShowEditModal(true)
                        }}
                      >
                        Editar
                      </Button>
                      
                      <Button
                        size="small"
                        variant="danger"
                        onClick={() => {
                          setClientToDelete(client)
                          setShowDeleteModal(true)
                        }}
                      >
                        Excluir
                      </Button>
                    </div>
                </Card>
              ))}
            </div>

            {allSelectedClients.length > 0 && (
              <Pagination
                currentPage={selectedPage}
                totalPages={totalSelectedPages}
                onPageChange={handleSelectedPageChange}
                itemsPerPage={selectedItemsPerPage}
                onItemsPerPageChange={handleSelectedItemsPerPageChange}
                totalItems={allSelectedClients.length}
                isLoading={false}
              />
            )}
          </>
        )}

        <ClientModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setEditingClient(null)
          }}
          onSubmit={handleEditClient}
          client={editingClient}
          isLoading={state.loading}
        />

        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setClientToDelete(null)
          }}
          onConfirm={handleDeleteClient}
          clientName={clientToDelete?.name || ''}
          isLoading={state.loading}
        />
      </div>
    </Layout>
  )
}

export default SelectedPage
