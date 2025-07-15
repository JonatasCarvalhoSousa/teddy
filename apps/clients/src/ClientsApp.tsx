import React, { useState, useEffect } from 'react';
import { Client, CreateClientRequest } from './types/client';
import { broadcastEvent, listenToExternalEvents } from './events/eventBus';
import { clientsService } from './services/clientsService';

interface ClientsAppProps {
  selectedClients?: number[];
}

const ClientsApp: React.FC<ClientsAppProps> = ({ selectedClients = [] }) => {
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.9) translateY(-10px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      
      .clients-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-bottom: 20px;
      }
      
      @media (max-width: 1200px) {
        .clients-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      
      @media (max-width: 900px) {
        .clients-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      
      @media (max-width: 600px) {
        .clients-grid {
          grid-template-columns: 1fr;
        }
      }
      
      .items-per-page-selector {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-top: 24px;
        font-size: 14px;
        color: #666;
      }
      
      @media (max-width: 768px) {
        .items-per-page-selector {
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }
        .items-per-page-selector span {
          font-size: 13px;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [allClients, setAllClients] = useState<Client[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [localSelectedIds, setLocalSelectedIds] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [itemsPerPageSelected, setItemsPerPageSelected] = useState<number>(16);

  useEffect(() => {
    loadClients();
    listenToExternalEvents();
    loadSelectedFromStorage();

    // Event listener para sincronização via storage apenas
    const handleStorageChange = () => {
      loadClients();
      loadSelectedFromStorage();
    };

    // Event listener para redimensionamento da tela
    const handleResize = () => {
      filterAndPaginateClients();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentPage]); 

  useEffect(() => {
    filterAndPaginateClients();
  }, [searchTerm, allClients, currentPage, itemsPerPageSelected]);

  useEffect(() => {
    if (searchTerm) {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPageSelected]);

  useEffect(() => {
    if (selectedClients && selectedClients.length > 0) {
      const areEqual = selectedClients.length === localSelectedIds.length && 
                      selectedClients.every(id => localSelectedIds.includes(id));
      
      if (!areEqual) {
        setLocalSelectedIds(selectedClients);
        saveSelectedToStorage(selectedClients);
      }
    }
  }, [selectedClients]);

  const saveSelectedToStorage = (selectedIds: number[]) => {
    try {
      localStorage.setItem('teddy-selected-clients', JSON.stringify(selectedIds));
      
      // Disparar evento customizado para notificar outros micro-frontends na mesma página
      window.dispatchEvent(new CustomEvent('teddy-selection-changed', {
        detail: { selectedIds }
      }));
    } catch (error) {
      console.error('Erro ao salvar seleções:', error);
    }
  };

  const loadSelectedFromStorage = () => {
    try {
      const saved = localStorage.getItem('teddy-selected-clients');
      if (saved) {
        const selectedIds = JSON.parse(saved) as number[];
        setLocalSelectedIds(selectedIds);
      }
    } catch (error) {
      console.error('Erro ao carregar seleções:', error);
    }
  };

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      // Buscar todos os clientes de uma vez só
      const response = await clientsService.getClients(1, 1000);
      setAllClients(response.clients);
      
      // Salvar clientes no localStorage para outros micro-frontends
      try {
        localStorage.setItem('teddy-all-clients', JSON.stringify(response.clients));
        
        // Emitir evento de sincronização para notificar outros micro-frontends
        broadcastEvent('state:sync', {
          clients: response.clients,
          selectedIds: localSelectedIds
        });
      } catch (error) {
        console.error('Erro ao salvar clientes no storage:', error);
      }
    } catch (err) {
      setError('Erro ao carregar clientes');
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const getItemsPerPage = () => {
    if (itemsPerPageSelected) {
      return itemsPerPageSelected;
    }
    
    const width = window.innerWidth;
    let autoValue;
    if (width <= 600) autoValue = 8; 
    else if (width <= 900) autoValue = 12; 
    else if (width <= 1200) autoValue = 15; 
    else autoValue = 16;
    
    return autoValue;
  };

  const filterAndPaginateClients = () => {
    
    let filteredClients = allClients;

    // Filtrar por termo de busca se existe
    if (searchTerm.trim()) {
      filteredClients = allClients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Calcular paginação dinamicamente
    const itemsPerPage = getItemsPerPage();
    const totalItems = filteredClients.length;
    const totalPagesCount = Math.ceil(totalItems / itemsPerPage);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedClients = filteredClients.slice(startIndex, endIndex);


    setClients(paginatedClients);
    setTotalPages(totalPagesCount);
  };

  const handleClientSelect = (client: Client) => {
    
    const isCurrentlySelected = localSelectedIds.includes(client.id);
    let newSelectedIds: number[];

    if (isCurrentlySelected) {
      newSelectedIds = localSelectedIds.filter(id => id !== client.id);
      broadcastEvent('client:unselected', client.id);
    } else {
      newSelectedIds = [...localSelectedIds, client.id];
      broadcastEvent('client:selected', client.id);
    }

    setLocalSelectedIds(newSelectedIds);
    saveSelectedToStorage(newSelectedIds);

  };

  const handleCreateClient = async (data: CreateClientRequest) => {
    try {
      const newClient = await clientsService.createClient(data);
      setShowModal(false);
      
      // Atualizar allClients localmente
      setAllClients(prev => [...prev, newClient]);
      
      // Emitir evento para outros micro-frontends
      broadcastEvent('client:created', newClient);
    } catch (err) {
      setError('Erro ao criar cliente');
      console.error('Error creating client:', err);
    }
  };

  const handleEditClient = async (data: CreateClientRequest) => {
    if (!editingClient) return;
    
    try {
      const updatedClient = await clientsService.updateClient(editingClient.id, data);
      setEditingClient(null);
      setShowModal(false);
      
      // Atualizar allClients localmente
      setAllClients(prev => prev.map(client => 
        client.id === updatedClient.id ? updatedClient : client
      ));
      
      // Emitir evento para outros micro-frontends
      broadcastEvent('client:updated', updatedClient);
    } catch (err) {
      setError('Erro ao atualizar cliente');
      console.error('Error updating client:', err);
    }
  };

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;

    try {
      await clientsService.deleteClient(clientToDelete.id);
      
      // Atualizar allClients localmente
      setAllClients(prev => prev.filter(client => client.id !== clientToDelete.id));
      
      // Remover da seleção se estava selecionado
      if (localSelectedIds.includes(clientToDelete.id)) {
        const newSelectedIds = localSelectedIds.filter(id => id !== clientToDelete.id);
        setLocalSelectedIds(newSelectedIds);
        saveSelectedToStorage(newSelectedIds);
      }
      
      // Emitir evento para outros micro-frontends
      broadcastEvent('client:deleted', clientToDelete.id);
      
      setShowDeleteModal(false);
      setClientToDelete(null);
    } catch (err) {
      setError('Erro ao excluir cliente');
      console.error('Error deleting client:', err);
    }
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClient(null);
  };

  const openDeleteModal = (client: Client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setClientToDelete(null);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px' }}>
        Carregando clientes...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px', color: '#dc3545' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e9ecef'
      }}>
        <div>
          <h1 style={{ 
            margin: '0 0 4px 0', 
            fontSize: '24px', 
            fontWeight: '600', 
            color: '#333' 
          }}>
            Clients Management
          </h1>
          <p style={{ 
            margin: '0', 
            color: '#666', 
            fontSize: '14px' 
          }}>
            {allClients.length} clientes encontrados
            {searchTerm && (
              <span style={{ color: '#007bff' }}>
                {' '}• Mostrando {clients.length} de {allClients.filter(client => 
                  client.name.toLowerCase().includes(searchTerm.toLowerCase())
                ).length} resultados
              </span>
            )}
            {localSelectedIds.length > 0 && (
              <span style={{
                marginLeft: '8px',
                padding: '2px 8px',
                background: '#007bff',
                color: 'white',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {localSelectedIds.length} selecionado{localSelectedIds.length !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #e9ecef',
              borderRadius: '6px',
              fontSize: '14px',
              width: '240px',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#007bff';
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e9ecef';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0056b3';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#007bff';
            }}
          >
            Novo Cliente
          </button>
        </div>
      </div>

      {clients.length === 0 && searchTerm ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
          <p>Nenhum cliente encontrado com o termo "{searchTerm}"</p>
          <p>Tente um termo diferente ou limpe a busca para ver todos os clientes.</p>
        </div>
      ) : (
        <>
          <div className="clients-grid">
            {clients.map((client) => {
          const isSelected = localSelectedIds.includes(client.id);
          return (
            <div
              key={client.id}
              style={{
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '16px',
                background: 'white',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  color: '#333',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  {client.name}
                </h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  marginBottom: '12px'
                }}>
                  <p style={{ 
                    margin: '0', 
                    color: '#666',
                    fontSize: '13px'
                  }}>
                    <strong>Salário:</strong> R$ {client.salary.toLocaleString()}
                  </p>
                  <p style={{ 
                    margin: '0', 
                    color: '#666',
                    fontSize: '13px'
                  }}>
                    <strong>Empresa:</strong> R$ {client.companyValuation.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '6px',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                {/* Botão de seleção estilo toggle */}
                <button
                  onClick={() => handleClientSelect(client)}
                  style={{
                    width: '32px',
                    height: '32px',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    background: isSelected ? '#28a745' : '#e9ecef',
                    color: isSelected ? 'white' : '#6c757d',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = '#28a745';
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = '#e9ecef';
                      e.currentTarget.style.color = '#6c757d';
                    }
                  }}
                  title={isSelected ? 'Remover seleção' : 'Selecionar cliente'}
                >
                  {isSelected ? '✓' : '+'}
                </button>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {/* Botão Editar */}
                  <button
                    onClick={() => openEditModal(client)}
                    style={{
                      width: '28px',
                      height: '28px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      background: 'white',
                      color: '#6c757d',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8f9fa';
                      e.currentTarget.style.borderColor = '#007bff';
                      e.currentTarget.style.color = '#007bff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#e9ecef';
                      e.currentTarget.style.color = '#6c757d';
                    }}
                    title="Editar cliente"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>

                  {/* Botão Excluir */}
                  <button
                    onClick={() => openDeleteModal(client)}
                    style={{
                      width: '28px',
                      height: '28px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      background: 'white',
                      color: '#6c757d',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fff5f5';
                      e.currentTarget.style.borderColor = '#dc3545';
                      e.currentTarget.style.color = '#dc3545';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#e9ecef';
                      e.currentTarget.style.color = '#6c757d';
                    }}
                    title="Excluir cliente"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
          </div>

          {/* Seletor de itens por página */}
          <div className="items-per-page-selector">
            <span>Itens por página:</span>
            <select
              value={itemsPerPageSelected}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                setItemsPerPageSelected(newValue);
              }}
              style={{
                padding: '8px 12px',
                border: '1px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s ease',
                minWidth: '70px'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#007bff';
                e.target.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
              <option value={20}>20</option>
              <option value={24}>24</option>
            </select>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid #e9ecef'
            }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e9ecef',
                  background: 'white',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  borderRadius: '6px',
                  opacity: currentPage === 1 ? 0.5 : 1,
                  fontSize: '14px',
                  color: '#495057',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.background = '#f8f9fa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                ← Anterior
              </button>
              
              <span style={{
                padding: '0 16px',
                fontSize: '14px',
                color: '#666'
              }}>
                Página {currentPage} de {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e9ecef',
                  background: 'white',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  borderRadius: '6px',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  fontSize: '14px',
                  color: '#495057',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.background = '#f8f9fa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <ClientModal
          client={editingClient}
          onSubmit={editingClient ? handleEditClient : handleCreateClient}
          onClose={closeModal}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && clientToDelete && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(2px)'
          }}
          onClick={closeDeleteModal}
        >
          <div 
            style={{
              background: 'white',
              padding: '32px',
              borderRadius: '12px',
              width: '420px',
              maxWidth: '90vw',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(220, 53, 69, 0.2)',
              animation: 'fadeInScale 0.2s ease-out'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Ícone de aviso */}
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(220, 53, 69, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <svg 
                width="28" 
                height="28" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#dc3545" 
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            
            <h3 style={{ 
              marginTop: 0, 
              marginBottom: '16px', 
              textAlign: 'center',
              color: '#333',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              Confirmar Exclusão
            </h3>
            
            <p style={{ 
              marginBottom: '28px', 
              color: '#666',
              textAlign: 'center',
              lineHeight: '1.5',
              fontSize: '15px'
            }}>
              Tem certeza que deseja excluir o cliente{' '}
              <strong style={{ color: '#333' }}>{clientToDelete.name}</strong>?
              <br />
              <span style={{ fontSize: '14px', color: '#999' }}>
                Esta ação não pode ser desfeita.
              </span>
            </p>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button 
                type="button" 
                onClick={closeDeleteModal}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: 'white',
                  color: '#666',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  minWidth: '100px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8f9fa';
                  e.currentTarget.style.borderColor = '#adb5bd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#ddd';
                }}
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={confirmDeleteClient}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: '#dc3545',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  minWidth: '120px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#c82333';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#dc3545';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Excluir Cliente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal simples para criar/editar cliente
const ClientModal: React.FC<{
  client?: Client | null;
  onSubmit: (data: CreateClientRequest) => void;
  onClose: () => void;
}> = ({ client, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<CreateClientRequest>({
    name: client?.name || '',
    salary: client?.salary || 0,
    companyValuation: client?.companyValuation || 0,
  });

  // Estados separados para controlar os inputs como strings
  const [salaryInput, setSalaryInput] = useState<string>(client?.salary?.toString() || '');
  const [companyValueInput, setCompanyValueInput] = useState<string>(client?.companyValuation?.toString() || '');

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        salary: client.salary,
        companyValuation: client.companyValuation,
      });
      setSalaryInput(client.salary.toString());
      setCompanyValueInput(client.companyValuation.toString());
    } else {
      setFormData({
        name: '',
        salary: 0,
        companyValuation: 0,
      });
      setSalaryInput('');
      setCompanyValueInput('');
    }
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalData = {
      ...formData,
      salary: Number(salaryInput) || 0,
      companyValuation: Number(companyValueInput) || 0
    };
    
    onSubmit(finalData);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'white',
          padding: '24px',
          borderRadius: '8px',
          width: '400px',
          maxWidth: '90vw'
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3>{client ? 'Editar Cliente' : 'Novo Cliente'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px', 
              fontWeight: 'bold' 
            }}>
              Nome:
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px', 
              fontWeight: 'bold' 
            }}>
              Salário:
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
              onFocus={(e) => {
                e.target.select();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && salaryInput === '0') {
                  setSalaryInput('');
                }
              }}
              placeholder="Digite o salário"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px', 
              fontWeight: 'bold' 
            }}>
              Valor da Empresa:
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={companyValueInput}
              onChange={(e) => setCompanyValueInput(e.target.value)}
              onFocus={(e) => {
                e.target.select();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && companyValueInput === '0') {
                  setCompanyValueInput('');
                }
              }}
              placeholder="Digite o valor da empresa"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: '#6c757d',
                color: 'white'
              }}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: '#007bff',
                color: 'white'
              }}
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientsApp;
