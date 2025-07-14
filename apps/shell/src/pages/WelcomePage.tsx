import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const WelcomePage = () => {
  const [userName, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { dispatch } = useAppContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (userName.trim()) {
      setIsLoading(true)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      dispatch({ type: 'SET_USER_NAME', payload: userName.trim() })
      localStorage.setItem('userName', userName.trim())
      
      setIsLoading(false)
      navigate('/clients')
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: '0',
      margin: '0',
      position: 'fixed',
      top: '0',
      left: '0'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px 30px',
        borderRadius: '8px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        width: '360px',
        maxWidth: '90%'
      }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: '400',
          color: '#333',
          margin: '0 0 32px 0',
          lineHeight: '1.4'
        }}>
          Olá, seja bem-vindo!
        </h1>

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Digite o seu nome:"
            style={{
              padding: '14px 16px',
              fontSize: '14px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              outline: 'none',
              backgroundColor: '#f8f8f8',
              color: '#333',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor = '#ccc'
              ;(e.target as HTMLInputElement).style.backgroundColor = 'white'
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor = '#e0e0e0'
              ;(e.target as HTMLInputElement).style.backgroundColor = '#f8f8f8'
            }}
            required
            disabled={isLoading}
          />
          
          <button 
            type="submit"
            disabled={isLoading || !userName.trim()}
            style={{
              padding: '14px 24px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: isLoading || !userName.trim() ? '#cccccc' : '#ff6b35',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading || !userName.trim() ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              if (!isLoading && userName.trim()) {
                (e.target as HTMLButtonElement).style.backgroundColor = '#e55a2b'
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && userName.trim()) {
                (e.target as HTMLButtonElement).style.backgroundColor = '#ff6b35'
              }
            }}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default WelcomePage
