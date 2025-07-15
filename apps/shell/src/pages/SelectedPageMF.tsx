import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { eventBus, listenToExternalEvents } from '../events/eventBus';

// @ts-ignore
const SelectedApp = React.lazy(() => import('selected/SelectedApp'));

const SelectedPageMF: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (!state.userName && !storedName) {
      navigate('/');
      return;
    }
    
    if (!state.userName && storedName) {
      dispatch({ type: 'SET_USER_NAME', payload: storedName });
    }

    // Configurar comunicação entre micro-frontends
    listenToExternalEvents();

    // Listeners para eventos do micro-frontend selected
    const unsubscribers = [
      eventBus.on('client:unselected', (clientId) => {
        dispatch({ type: 'TOGGLE_SELECT_CLIENT', payload: clientId });
      }),

      eventBus.on('clients:cleared', () => {
        dispatch({ type: 'CLEAR_SELECTED_CLIENTS' });
      }),

      eventBus.on('client:updated', (client) => {
        dispatch({ type: 'UPDATE_CLIENT', payload: client });
        dispatch({ type: 'SET_SUCCESS', payload: 'Cliente atualizado com sucesso!' });
        setTimeout(() => dispatch({ type: 'SET_SUCCESS', payload: null }), 3000);
      }),

      eventBus.on('client:deleted', (clientId) => {
        dispatch({ type: 'REMOVE_CLIENT', payload: clientId });
        dispatch({ type: 'SET_SUCCESS', payload: 'Cliente excluído com sucesso!' });
        setTimeout(() => dispatch({ type: 'SET_SUCCESS', payload: null }), 3000);
      }),
    ];

    setIsReady(true);

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [state.userName, dispatch, navigate]);

  // Sincronizar estado com o micro-frontend
  useEffect(() => {
    if (isReady) {
      eventBus.syncState(state.clients, state.selectedClients);
    }
  }, [state.clients, state.selectedClients, isReady]);

  const handleClientUpdate = (client: any) => {
    dispatch({ type: 'UPDATE_CLIENT', payload: client });
  };

  const handleClientDelete = (clientId: number) => {
    dispatch({ type: 'REMOVE_CLIENT', payload: clientId });
  };

  if (!isReady) {
    return <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px', color: '#6c757d' }}>Carregando micro-frontend...</div>;
  }

  return (
    <div style={{ width: '100%' }}>
      {state.error && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '16px',
          borderRadius: '4px',
          fontWeight: '500',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb'
        }}>
          {state.error}
        </div>
      )}
      {state.success && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '16px',
          borderRadius: '4px',
          fontWeight: '500',
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb'
        }}>
          {state.success}
        </div>
      )}
      
      <React.Suspense fallback={<div style={{ textAlign: 'center', padding: '40px', fontSize: '16px', color: '#6c757d' }}>Carregando Selecionados...</div>}>
        <SelectedApp 
          clients={state.clients}
          selectedIds={state.selectedClients}
          onClientUpdate={handleClientUpdate}
          onClientDelete={handleClientDelete}
        />
      </React.Suspense>
    </div>
  );
};

export default SelectedPageMF;
