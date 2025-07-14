import React, { ReactNode, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state, dispatch } = useAppContext()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      
      if (width < 768) {
        setIsSidebarOpen(false)
        setIsCollapsed(false)
      } else if (width < 1024) {
        setIsCollapsed(true)
        setIsSidebarOpen(true)
      } else {
        setIsCollapsed(false)
        setIsSidebarOpen(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleLinkClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userName')
    dispatch({ type: 'SET_USER_NAME', payload: '' })
    dispatch({ type: 'SET_CLIENTS', payload: [] })
    dispatch({ type: 'CLEAR_SELECTED_CLIENTS' })
    navigate('/')
  }

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen)
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  const sidebarWidth = isCollapsed ? '64px' : '250px'

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      position: 'relative'
    }}>
      {isMobile && isSidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Menu Lateral */}
      <div style={{
        width: isMobile ? '280px' : sidebarWidth,
        backgroundColor: '#2d3748',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        position: isMobile ? 'fixed' : 'relative',
        left: isMobile && !isSidebarOpen ? '-280px' : '0',
        top: 0,
        height: '100vh',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: isCollapsed ? '1rem 0.5rem' : '1.5rem',
          borderBottom: '1px solid #4a5568',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: '0.75rem',
          minHeight: '76px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#ff6b35',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            flexShrink: 0
          }}>
            T
          </div>
          {!isCollapsed && (
            <span style={{ 
              fontWeight: '600', 
              fontSize: '1.1rem',
              whiteSpace: 'nowrap'
            }}>
              Teddy
            </span>
          )}
        </div>

        <nav style={{ 
          flex: 1, 
          padding: '1rem 0',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          {!isCollapsed && (
            <div style={{ padding: '0 1rem', marginBottom: '0.5rem' }}>
              <span style={{ 
                fontSize: '0.75rem', 
                color: '#a0aec0',
                textTransform: 'uppercase',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}>
                MENU
              </span>
            </div>
          )}

          <Link
            to="/clients"
            onClick={handleLinkClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: isCollapsed ? '0.75rem 0.5rem' : '0.75rem 1rem',
              color: location.pathname === '/clients' ? '#ff6b35' : '#e2e8f0',
              textDecoration: 'none',
              backgroundColor: location.pathname === '/clients' ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
              borderRight: location.pathname === '/clients' ? '3px solid #ff6b35' : 'none',
              transition: 'all 0.2s',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              position: 'relative'
            }}
            title={isCollapsed ? 'Clientes' : ''}
          >
            <div style={{
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
            </div>
            {!isCollapsed && <span>Clientes</span>}
          </Link>

          <Link
            to="/selected"
            onClick={handleLinkClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: isCollapsed ? '0.75rem 0.5rem' : '0.75rem 1rem',
              color: location.pathname === '/selected' ? '#ff6b35' : '#e2e8f0',
              textDecoration: 'none',
              backgroundColor: location.pathname === '/selected' ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
              borderRight: location.pathname === '/selected' ? '3px solid #ff6b35' : 'none',
              transition: 'all 0.2s',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              position: 'relative'
            }}
            title={isCollapsed ? 'Clientes selecionados' : ''}
          >
            <div style={{
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              position: 'relative'
            }}>
              ✓
              {state.selectedClients.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '0.125rem 0.375rem',
                  fontSize: '0.625rem',
                  fontWeight: '600',
                  minWidth: '16px',
                  textAlign: 'center'
                }}>
                  {state.selectedClients.length}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Clientes selecionados</span>
                {state.selectedClients.length > 0 && (
                  <span style={{
                    backgroundColor: '#ff6b35',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '0.125rem 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {state.selectedClients.length}
                  </span>
                )}
              </div>
            )}
          </Link>
        </nav>

        {/* User Info & Logout */}
        <div style={{
          padding: isCollapsed ? '1rem 0.5rem' : '1rem',
          borderTop: '1px solid #4a5568'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.75rem',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#4a5568',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              flexShrink: 0
            }}>
              U
            </div>
            {!isCollapsed && (
              <div style={{ minWidth: 0 }}>
                <div style={{ 
                  fontWeight: '500', 
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {state.userName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>
                  Usuário
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: 'transparent',
              color: '#e2e8f0',
              border: '1px solid #4a5568',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: isCollapsed ? '0.8rem' : '0.9rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#4a5568'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
            title={isCollapsed ? 'Sair' : ''}
          >
            {isCollapsed ? 'X' : 'Sair'}
          </button>
        </div>
      </div>

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        marginLeft: isMobile ? '0' : '0',
        transition: 'margin-left 0.3s ease',
        minWidth: 0
      }}>
        <header style={{
          backgroundColor: 'white',
          padding: isMobile ? '1rem' : '1rem 2rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={toggleSidebar}
              style={{
                padding: '0.5rem',
                backgroundColor: 'transparent',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f7fafc'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              ☰
            </button>
            
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: isMobile ? '1.25rem' : '1.5rem', 
                fontWeight: '600',
                color: '#2d3748'
              }}>
                Olá, {state.userName}!
              </h1>
            </div>
          </div>
          
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#718096' }}>
                {location.pathname === '/clients' ? 'Clientes' : 'Clientes selecionados'}
              </span>
              <span style={{ fontSize: '0.9rem', color: '#718096' }}>
                {state.clients.length} clientes encontrados
              </span>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: isMobile ? '1rem' : '2rem',
          overflow: 'auto'
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
