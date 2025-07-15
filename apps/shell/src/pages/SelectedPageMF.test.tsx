import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../test/test-utils'
import { AppProvider } from '../context/AppContext'
import SelectedPageMF from './SelectedPageMF'
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

const MockSelectedApp = () => <div data-testid="selected-microfrontend">Selected Microfrontend</div>

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MemoryRouter initialEntries={['/selected']}>
      <AppProvider>
        {component}
      </AppProvider>
    </MemoryRouter>
  )
}

describe('SelectedPageMF Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('userName', 'João Silva')
  })

  it('should render loading state initially', () => {
    const React = require('react')
    React.lazy.mockReturnValue(() => Promise.resolve({ default: MockSelectedApp }))

    renderWithProviders(<SelectedPageMF />)
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('should render microfrontend when loaded successfully', async () => {
    const React = require('react')
    React.lazy.mockReturnValue(() => Promise.resolve({ default: MockSelectedApp }))

    renderWithProviders(<SelectedPageMF />)
    
    await waitFor(() => {
      expect(screen.getByTestId('selected-microfrontend')).toBeInTheDocument()
    })
  })

  it('should render error state when microfrontend fails to load', async () => {
    const React = require('react')
    React.lazy.mockReturnValue(() => Promise.reject(new Error('Module not found')))

    renderWithProviders(<SelectedPageMF />)
    
    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar o módulo Selected')).toBeInTheDocument()
      expect(screen.getByText('Verifique se o serviço está rodando na porta 3002')).toBeInTheDocument()
    })
  })

  it('should have retry button when error occurs', async () => {
    const React = require('react')
    React.lazy.mockReturnValue(() => Promise.reject(new Error('Module not found')))

    const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {})

    renderWithProviders(<SelectedPageMF />)
    
    await waitFor(() => {
      const retryButton = screen.getByText('Tentar Novamente')
      expect(retryButton).toBeInTheDocument()
      
      retryButton.click()
      expect(reloadSpy).toHaveBeenCalled()
    })

    reloadSpy.mockRestore()
  })

  it('should pass correct props to microfrontend', async () => {
    const React = require('react')
    const mockComponent = vi.fn(() => <div>Selected App</div>)
    React.lazy.mockReturnValue(() => Promise.resolve({ default: mockComponent }))

    renderWithProviders(<SelectedPageMF />)
    
    await waitFor(() => {
      expect(mockComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          userName: 'João Silva',
          selectedClients: expect.any(Array)
        }),
        expect.any(Object)
      )
    })
  })
})
