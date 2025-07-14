import React, { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'success'
type ButtonSize = 'small' | 'medium' | 'large'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  style?: React.CSSProperties
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  style = {}
}) => {
  const getVariantStyles = (variant: ButtonVariant) => {
    const variants = {
      primary: {
        backgroundColor: '#ff6b35',
        color: 'white',
        border: 'none'
      },
      secondary: {
        backgroundColor: '#e2e8f0',
        color: '#4a5568',
        border: '1px solid #cbd5e0'
      },
      danger: {
        backgroundColor: '#e53e3e',
        color: 'white',
        border: 'none'
      },
      warning: {
        backgroundColor: '#d69e2e',
        color: 'white',
        border: 'none'
      },
      success: {
        backgroundColor: '#38a169',
        color: 'white',
        border: 'none'
      }
    }
    return variants[variant]
  }

  const getSizeStyles = (size: ButtonSize) => {
    const sizes = {
      small: {
        padding: '0.5rem 0.75rem',
        fontSize: '0.875rem'
      },
      medium: {
        padding: '0.75rem 1rem',
        fontSize: '0.9rem'
      },
      large: {
        padding: '1rem 1.5rem',
        fontSize: '1rem'
      }
    }
    return sizes[size]
  }

  const variantStyles = getVariantStyles(variant)
  const sizeStyles = getSizeStyles(size)

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...variantStyles,
        ...sizeStyles,
        borderRadius: '8px',
        fontWeight: '500',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        ...style
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      {loading && (
        <div style={{
          width: '16px',
          height: '16px',
          border: '2px solid transparent',
          borderTop: '2px solid currentColor',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      )}
      {children}
    </button>
  )
}

export default Button
