import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Client } from '../types/client';

interface AppState {
  userName: string;
  clients: Client[];
  selectedClients: number[];
  loading: boolean;
  error: string | null;
  success: string | null;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  searchTerm: string;
  isSearching: boolean;
}

type AppAction =
  | { type: 'SET_USER_NAME'; payload: string }
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'REMOVE_CLIENT'; payload: number }
  | { type: 'TOGGLE_SELECT_CLIENT'; payload: number }
  | { type: 'SELECT_CLIENT'; payload: number }
  | { type: 'UNSELECT_CLIENT'; payload: number }
  | { type: 'CLEAR_SELECTED_CLIENTS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SUCCESS'; payload: string | null }
  | { type: 'SET_PAGINATION'; payload: { currentPage: number; totalPages: number; itemsPerPage: number } }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_ITEMS_PER_PAGE'; payload: number }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_IS_SEARCHING'; payload: boolean };

const initialState: AppState = {
  userName: '',
  clients: [],
  selectedClients: [],
  loading: false,
  error: null,
  success: null,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 16,
  searchTerm: '',
  isSearching: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER_NAME':
      return { ...state, userName: action.payload };
    
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === action.payload.id ? action.payload : client
        ),
      };
    
    case 'REMOVE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload),
        selectedClients: state.selectedClients.filter(id => id !== action.payload),
      };
    
    case 'TOGGLE_SELECT_CLIENT':
      const clientId = action.payload;
      const isSelected = state.selectedClients.includes(clientId);
      return {
        ...state,
        selectedClients: isSelected
          ? state.selectedClients.filter(id => id !== clientId)
          : [...state.selectedClients, clientId],
      };

    case 'SELECT_CLIENT':
      const selectClientId = action.payload;
      if (!state.selectedClients.includes(selectClientId)) {
        return {
          ...state,
          selectedClients: [...state.selectedClients, selectClientId],
        };
      }
      return state;

    case 'UNSELECT_CLIENT':
      const unselectClientId = action.payload;
      return {
        ...state,
        selectedClients: state.selectedClients.filter(id => id !== unselectClientId),
      };
    
    case 'CLEAR_SELECTED_CLIENTS':
      return { ...state, selectedClients: [] };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_SUCCESS':
      return { ...state, success: action.payload };
    
    case 'SET_PAGINATION':
      return { 
        ...state, 
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        itemsPerPage: action.payload.itemsPerPage
      };
    
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    
    case 'SET_ITEMS_PER_PAGE':
      return { ...state, itemsPerPage: action.payload, currentPage: 1 };
    
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload, currentPage: 1 };
    
    case 'SET_IS_SEARCHING':
      return { ...state, isSearching: action.payload };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
