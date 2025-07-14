import React from 'react'
import Modal from './Modal'
import Button from './Button'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  clientName: string
  isLoading?: boolean
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  clientName,
  isLoading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Excluir cliente"
      size="small"
    >
      <div style={{ textAlign: 'center' }}>
        
        <h4 style={{
          marginBottom: '1rem',
          fontSize: '1.1rem',
          fontWeight: '600',
          color: '#2d3748'
        }}>
          Você está prestes a excluir o cliente:
        </h4>
        
        <div style={{
          padding: '1rem',
          backgroundColor: '#fed7d7',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '1px solid #fc8181'
        }}>
          <strong style={{ color: '#c53030' }}>{clientName}</strong>
        </div>
        
        <p style={{
          color: '#718096',
          marginBottom: '2rem',
          lineHeight: 1.5
        }}>
          Esta ação não pode ser desfeita. Todos os dados do cliente serão removidos permanentemente.
        </p>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          
          <Button
            variant="danger"
            onClick={onConfirm}
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Excluindo...' : 'Sim, excluir'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDeleteModal
