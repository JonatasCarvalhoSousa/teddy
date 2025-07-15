import React from 'react'
import Button from './Button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  onItemsPerPageChange: (items: number) => void
  totalItems?: number
  isLoading?: boolean
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  isLoading = false
}) => {
  const itemsPerPageOptions = [8, 16, 32, 48]
  
  const getVisiblePages = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    
    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center',
      marginTop: '2rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '0.9rem',
        color: '#718096',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <span>Clientes por página:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          disabled={isLoading}
          style={{
            padding: '0.5rem',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            backgroundColor: 'white',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
            fontSize: '0.9rem'
          }}
        >
          {itemsPerPageOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      
      </div>

      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <Button
            size="small"
            variant="secondary"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            style={{
              minWidth: window.innerWidth < 768 ? '70px' : '80px',
              fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem'
            }}
          >
            {window.innerWidth < 768 ? 'Ant.' : 'Anterior'}
          </Button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {visiblePages.map((page, index) => (
              page === '...' ? (
                <span
                  key={`ellipsis-${index}`}
                  style={{
                    padding: '0.5rem',
                    color: '#718096',
                    fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem'
                  }}
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(Number(page))}
                  disabled={isLoading}
                  style={{
                    padding: window.innerWidth < 768 ? '0.4rem 0.6rem' : '0.5rem 0.75rem',
                    border: currentPage === page ? '2px solid #ff6b35' : '1px solid #e2e8f0',
                    backgroundColor: currentPage === page ? '#ff6b35' : 'white',
                    color: currentPage === page ? 'white' : '#2d3748',
                    borderRadius: '6px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontWeight: currentPage === page ? '600' : '400',
                    minWidth: window.innerWidth < 768 ? '32px' : '40px',
                    opacity: isLoading ? 0.6 : 1,
                    transition: 'all 0.2s ease',
                    fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem'
                  }}
                >
                  {page}
                </button>
              )
            ))}
          </div>

          <Button
            size="small"
            variant="secondary"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            style={{
              minWidth: window.innerWidth < 768 ? '70px' : '80px',
              fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem'
            }}
          >
            {window.innerWidth < 768 ? 'Próx.' : 'Próximo'}
          </Button>
        </div>
      )}

      {totalPages > 1 && (
        <div style={{
          fontSize: window.innerWidth < 768 ? '0.8rem' : '0.85rem',
          color: '#718096',
          textAlign: 'center',
          lineHeight: 1.4
        }}>
          <div>
            Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
          </div>
          {totalItems && (
            <div style={{ marginTop: '0.25rem' }}>
              Exibindo {((currentPage - 1) * itemsPerPage) + 1} até{' '}
              {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} clientes
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Pagination
