import React, { ReactNode, useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'small' | 'medium' | 'large'
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium' 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getSize = () => {
    const isMobile = window.innerWidth < 768
    switch (size) {
      case 'small':
        return { 
          width: isMobile ? '100%' : '400px', 
          maxWidth: isMobile ? 'calc(100% - 2rem)' : '90vw' 
        }
      case 'large':
        return { 
          width: isMobile ? '100%' : '800px', 
          maxWidth: isMobile ? 'calc(100% - 2rem)' : '95vw' 
        }
      default:
        return { 
          width: isMobile ? '100%' : '500px', 
          maxWidth: isMobile ? 'calc(100% - 2rem)' : '90vw' 
        }
    }
  }

  return (
    <div
      data-testid="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          ...getSize(),
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: window.innerWidth < 768 ? '1rem' : '1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: window.innerWidth < 768 ? '1.1rem' : '1.25rem',
            fontWeight: '600',
            color: '#2d3748'
          }}>
            {title}
          </h3>
          
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#718096',
              padding: '0.25rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f7fafc'
              e.currentTarget.style.color = '#2d3748'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#718096'
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: window.innerWidth < 768 ? '1rem' : '1.5rem',
          overflow: 'auto',
          flex: 1
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
