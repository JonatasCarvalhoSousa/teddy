import React, { useState } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onClear?: () => void
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Pesquisar clientes por nome...',
  onClear
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = () => {
    onChange('')
    if (onClear) {
      onClear()
    }
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '400px'
    }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          position: 'absolute',
          left: '12px',
          zIndex: 1,
          color: '#9ca3af',
          display: 'flex',
          alignItems: 'center'
        }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '12px 16px 12px 44px',
            border: isFocused ? '2px solid #ff6b35' : '1px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '0.95rem',
            backgroundColor: 'white',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxShadow: isFocused ? '0 0 0 3px rgba(255, 107, 53, 0.1)' : 'none',
            paddingRight: value ? '44px' : '16px'
          }}
        />

        {value && (
          <button
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9ca3af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
              e.currentTarget.style.color = '#6b7280'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#9ca3af'
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {value && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          right: '0',
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          padding: '8px 16px',
          fontSize: '0.85rem',
          color: '#6b7280',
          zIndex: 10,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          Pesquisando por: "<strong>{value}</strong>"
        </div>
      )}
    </div>
  )
}

export default SearchInput
