import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../test/test-utils'
import { AppProvider } from '../context/AppContext'
import ClientsPageMF from './ClientsPageMF'
import { MemoryRouter } from 'react-router-dom'

// Mock do React.lazy para simular carregamento de microfrontend
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    lazy: vi.fn()
  }
})

// Mock do eventBus
vi.mock('../events/eventBus', () => ({
  eventBus: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn()
  },
  listenToExternalEvents: vi.fn()
}))

const MockClientsApp = () => <div data-testid="clients-microfrontend">Clients Microfrontend</div>

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MemoryRouter initialEntries={['/clients']}>
      <AppProvider>
        {component}
      </AppProvider>
    </MemoryRouter>
  )
}

describe('ClientsPageMF Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('userName', 'João Silva')
  })

  it('should render loading state initially', () => {
    const React = require('react')
    React.lazy.mockReturnValue(() => Promise.resolve({ default: MockClientsApp }))

    renderWithProviders(<ClientsPageMF />)
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('should render microfrontend when loaded successfully', async () => {
    const React = require('react')
    React.lazy.mockReturnValue(() => Promise.resolve({ default: MockClientsApp }))

    renderWithProviders(<ClientsPageMF />)
    
    await waitFor(() => {
      expect(screen.getByTestId('clients-microfrontend')).toBeInTheDocument()
    })
  })

  it('should render error state when microfrontend fails to load', async () => {
    const React = require('react')
    React.lazy.mockReturnValue(() => Promise.reject(new Error('Module not found')))

    renderWithProviders(<ClientsPageMF />)
    
    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar o módulo Clients')).toBeInTheDocument()
      expect(screen.getByText('Verifique se o serviço está rodando na porta 3001')).toBeInTheDocument()
    })
  })

  it('should have retry button when error occurs', async () => {
    const React = require('react')
    React.lazy.mockReturnValue(() => Promise.reject(new Error('Module not found')))

    const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {})

    renderWithProviders(<ClientsPageMF />)
    
    await waitFor(() => {
      const retryButton = screen.getByText('Tentar Novamente')
      expect(retryButton).toBeInTheDocument()
      
      retryButton.click()
      expect(reloadSpy).toHaveBeenCalled()
    })

    reloadSpy.mockRestore()
  })

  it('should redirect to login when user is not authenticated', () => {
    localStorage.removeItem('userName')
    
    const React = require('react')
    React.lazy.mockReturnValue(() => Promise.resolve({ default: MockClientsApp }))

    renderWithProviders(<ClientsPageMF />)
    
    // Should redirect to login page
    expect(window.location.pathname).toBe('/clients')
  })
})
