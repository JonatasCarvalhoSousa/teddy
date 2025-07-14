import React, { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  isSelected?: boolean
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

const Card: React.FC<CardProps> = ({ 
  children, 
  isSelected = false, 
  onClick,
  className = '',
  style = {}
}) => {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        border: isSelected ? '2px solid #ff6b35' : '1px solid #e2e8f0',
        boxShadow: isSelected 
          ? '0 4px 12px rgba(255, 107, 53, 0.15)' 
          : '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        ...style
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = isSelected 
            ? '0 4px 12px rgba(255, 107, 53, 0.15)' 
            : '0 1px 3px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      {children}
    </div>
  )
}

export default Card
