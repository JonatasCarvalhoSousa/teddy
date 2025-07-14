import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AppProvider, useAppContext } from './AppContext'
import { mockClient } from '../test/test-utils'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>{children}</AppProvider>
)

describe('AppContext', () => {
  it('provides initial state', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper })

    expect(result.current.state).toEqual({
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
    })
  })

  it('sets user name', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper })

    act(() => {
      result.current.dispatch({ type: 'SET_USER_NAME', payload: 'João Silva' })
    })

    expect(result.current.state.userName).toBe('João Silva')
  })

  it('sets clients', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper })

    act(() => {
      result.current.dispatch({ type: 'SET_CLIENTS', payload: [mockClient] })
    })

    expect(result.current.state.clients).toHaveLength(1)
    expect(result.current.state.clients[0]).toEqual(mockClient)
  })

  it('toggles client selection', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper })

    act(() => {
      result.current.dispatch({ type: 'SET_CLIENTS', payload: [mockClient] })
    })

    act(() => {
      result.current.dispatch({ type: 'TOGGLE_SELECT_CLIENT', payload: mockClient.id })
    })

    expect(result.current.state.selectedClients).toContain(mockClient.id)

    act(() => {
      result.current.dispatch({ type: 'TOGGLE_SELECT_CLIENT', payload: mockClient.id })
    })

    expect(result.current.state.selectedClients).not.toContain(mockClient.id)
  })

  it('clears selected clients', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper })

    act(() => {
      result.current.dispatch({ type: 'TOGGLE_SELECT_CLIENT', payload: 1 })
    })

    expect(result.current.state.selectedClients).toContain(1)

    act(() => {
      result.current.dispatch({ type: 'CLEAR_SELECTED_CLIENTS' })
    })

    expect(result.current.state.selectedClients).toHaveLength(0)
  })

  it('sets loading state', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper })

    act(() => {
      result.current.dispatch({ type: 'SET_LOADING', payload: true })
    })

    expect(result.current.state.loading).toBe(true)
  })

  it('sets error message', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper })

    act(() => {
      result.current.dispatch({ type: 'SET_ERROR', payload: 'Erro de teste' })
    })

    expect(result.current.state.error).toBe('Erro de teste')
  })

  it('sets success message', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper })

    act(() => {
      result.current.dispatch({ type: 'SET_SUCCESS', payload: 'Sucesso!' })
    })

    expect(result.current.state.success).toBe('Sucesso!')
  })

  it('sets search term and resets page', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper })

    act(() => {
      result.current.dispatch({ type: 'SET_CURRENT_PAGE', payload: 2 })
    })

    expect(result.current.state.currentPage).toBe(2)

    act(() => {
      result.current.dispatch({ type: 'SET_SEARCH_TERM', payload: 'João' })
    })

    expect(result.current.state.searchTerm).toBe('João')
    expect(result.current.state.currentPage).toBe(1)
  })

  it('sets pagination', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper })

    const paginationData = {
      currentPage: 2,
      totalPages: 5,
      itemsPerPage: 10
    }

    act(() => {
      result.current.dispatch({ type: 'SET_PAGINATION', payload: paginationData })
    })

    expect(result.current.state.currentPage).toBe(2)
    expect(result.current.state.totalPages).toBe(5)
    expect(result.current.state.itemsPerPage).toBe(10)
  })

  it('adds new client', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper })

    act(() => {
      result.current.dispatch({ type: 'ADD_CLIENT', payload: mockClient })
    })

    expect(result.current.state.clients).toHaveLength(1)
    expect(result.current.state.clients[0]).toEqual(mockClient)
  })

  it('updates existing client', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper })

    act(() => {
      result.current.dispatch({ type: 'SET_CLIENTS', payload: [mockClient] })
    })

    const updatedClient = { ...mockClient, name: 'Nome Atualizado' }

    act(() => {
      result.current.dispatch({ type: 'UPDATE_CLIENT', payload: updatedClient })
    })

    expect(result.current.state.clients[0].name).toBe('Nome Atualizado')
  })

  it('removes client', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper })

    act(() => {
      result.current.dispatch({ type: 'SET_CLIENTS', payload: [mockClient] })
      result.current.dispatch({ type: 'TOGGLE_SELECT_CLIENT', payload: mockClient.id })
    })

    expect(result.current.state.clients).toHaveLength(1)
    expect(result.current.state.selectedClients).toContain(mockClient.id)

    act(() => {
      result.current.dispatch({ type: 'REMOVE_CLIENT', payload: mockClient.id })
    })

    expect(result.current.state.clients).toHaveLength(0)
    expect(result.current.state.selectedClients).not.toContain(mockClient.id)
  })
})
