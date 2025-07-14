// Versão alternativa com fundo escuro (como na primeira imagem)

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const WelcomePageDark = () => {
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
      backgroundColor: '#2c2c2c',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '60px 40px',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
        width: '280px',
        maxWidth: '90%',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '40px',
          backgroundColor: 'white',
          borderRadius: '8px 8px 0 0'
        }} />

        <h1 style={{
          fontSize: '18px',
          fontWeight: '400',
          color: '#333',
          margin: '0 0 30px 0',
          lineHeight: '1.4'
        }}>
          Olá, seja bem-vindo!
        </h1>

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Digite o seu nome:"
            style={{
              padding: '12px 16px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              outline: 'none',
              backgroundColor: '#f8f8f8',
              color: '#333',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box'
            }}
            required
            disabled={isLoading}
          />
          
          <button 
            type="submit"
            disabled={isLoading || !userName.trim()}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '400',
              backgroundColor: isLoading || !userName.trim() ? '#e0e0e0' : '#c0c0c0',
              color: '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: isLoading || !userName.trim() ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease',
              outline: 'none'
            }}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default WelcomePageDark
