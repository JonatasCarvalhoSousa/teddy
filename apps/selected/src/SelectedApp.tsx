import React, { useState, useEffect, useMemo } from 'react';
import { Client } from './types/client';
import { listenToExternalEvents, eventBus } from './events/eventBus';
import { selectedService } from './services/selectedService';

interface SelectedAppProps {}

const SelectedApp: React.FC<SelectedAppProps> = () => {
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      await loadSelectedClients();
      listenToExternalEvents();
    };
    
    initializeApp();

    // Listener para mudanças no localStorage
    const handleStorageChange = async () => {
      await loadSelectedClients();
    };

    // Listener para evento customizado de mudança de seleção
    const handleSelectionChanged = async (event: any) => {
      await loadSelectedClients();
    };

    // Listener para quando a janela fica visível (mudança de aba)
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        await loadSelectedClients();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('teddy-selection-changed', handleSelectionChanged);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Escutar eventos de outros micro-frontends
    const unsubscribers = [
      eventBus.on('client:selected', async (clientId) => {
        selectedService.selectClientDirectly(clientId);
        await loadSelectedClients();
      }),

      eventBus.on('client:unselected', async (clientId) => {
        selectedService.unselectClientDirectly(clientId);
        await loadSelectedClients();
      }),

      eventBus.on('client:created', async (client) => {
        selectedService.addClient(client);
        await loadSelectedClients();
      }),

      eventBus.on('client:updated', async (client) => {
        selectedService.updateClient(client);
        await loadSelectedClients();
      }),

      eventBus.on('client:deleted', async (clientId) => {
        selectedService.removeClient(clientId);
        await loadSelectedClients();
      }),

      eventBus.on('clients:cleared', async () => {
        // Limpar seleções localmente sem emitir eventos
        selectedService.clearAllSelectedDirectly();
        await loadSelectedClients();
      }),

      eventBus.on('state:sync', async ({ clients, selectedIds }) => {
        selectedService.updateAllClients(clients);
        
        // Limpar seleções atuais e adicionar as novas sem emitir eventos
        const currentSelectedIds = selectedService.getSelectedIds();
        
        currentSelectedIds.forEach(id => {
          if (!selectedIds.includes(id)) {
            selectedService.unselectClientDirectly(id);
          }
        });
        
        // Adicionar novos IDs selecionados
        selectedIds.forEach(id => {
          if (!currentSelectedIds.includes(id)) {
            selectedService.selectClientDirectly(id);
          }
        });
        
        await loadSelectedClients();
      })
    ];

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('teddy-selection-changed', handleSelectionChanged);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadSelectedClients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Forçar reload do storage para garantir sincronização
      selectedService.forceReloadFromStorage();
      
      // Usar método assíncrono que busca da API se necessário
      const clients = await selectedService.getSelectedClientsAsync();
      setSelectedClients(clients);
      
    } catch (err) {
      setError('Erro ao carregar clientes selecionados');
      console.error('Error loading selected clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromSelection = (clientId: number) => {
    try {
      selectedService.unselectClient(clientId);
      setSelectedClients(selectedService.getSelectedClients());
    } catch (err) {
      setError('Erro ao remover da seleção');
      console.error('Error removing from selection:', err);
    }
  };

  const handleClearAllSelection = () => {
    try {
      selectedService.clearAllSelected();
      setSelectedClients([]);
    } catch (err) {
      setError('Erro ao limpar seleção');
      console.error('Error clearing selection:', err);
    }
  };

  // Filtros e paginação
  const filteredClients = useMemo(() => {
    return selectedClients.filter(client =>
      client.name.toLowerCase().includes(localSearchTerm.toLowerCase())
    );
  }, [selectedClients, localSearchTerm]);

  const totalItems = filteredClients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  // Reset page quando filtrar
  useEffect(() => {
    setCurrentPage(1);
  }, [localSearchTerm, itemsPerPage]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px' }}>
        Carregando clientes selecionados...
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

  if (selectedClients.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ padding: '60px 20px', color: '#6c757d' }}>
          <h2 style={{ marginBottom: '12px', color: '#495057' }}>Nenhum cliente selecionado</h2>
          <p>Selecione clientes na página de gerenciamento para vê-los aqui.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <h2>Clientes Selecionados ({totalItems})</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Buscar nos selecionados..."
            value={localSearchTerm}
            onChange={(e) => {
              setLocalSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value={8}>8 por página</option>
            <option value={16}>16 por página</option>
            <option value={32}>32 por página</option>
          </select>
          <button
            onClick={handleClearAllSelection}
            disabled={totalItems === 0}
            style={{
              background: totalItems === 0 ? '#6c757d' : '#dc3545',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: totalItems === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Limpar Todos
          </button>
        </div>
      </div>

      {paginatedClients.length === 0 && localSearchTerm !== '' ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
          <p>Nenhum cliente encontrado com o termo "{localSearchTerm}"</p>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {paginatedClients.map((client) => (
              <div
                key={client.id}
                style={{
                  border: '1px solid #007bff',
                  borderRadius: '8px',
                  padding: '16px',
                  background: '#f0f8ff'
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{client.name}</h3>
                  <p style={{ margin: '4px 0', color: '#666' }}>
                    Salário: R$ {client.salary.toLocaleString()}
                  </p>
                  <p style={{ margin: '4px 0', color: '#666' }}>
                    Empresa: R$ {client.companyValuation.toLocaleString()}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    onClick={() => handleRemoveFromSelection(client.id)}
                    style={{
                      padding: '4px 8px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      background: '#dc3545',
                      color: 'white'
                    }}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px'
            }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  background: 'white',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  borderRadius: '4px',
                  opacity: currentPage === 1 ? 0.5 : 1
                }}
              >
                Anterior
              </button>
              <span>Página {currentPage} de {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  background: 'white',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  borderRadius: '4px',
                  opacity: currentPage === totalPages ? 0.5 : 1
                }}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SelectedApp;
