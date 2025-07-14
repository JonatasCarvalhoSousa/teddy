import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../test/test-utils'
import Modal from './Modal'

describe('Modal Component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument()
  })

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )
    
    const closeButton = screen.getByText('×')
    fireEvent.click(closeButton)
    
    expect(handleClose).toHaveBeenCalled()
  })

  it('calls onClose when overlay is clicked', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )
    
    const overlay = screen.getByTestId('modal-overlay')
    fireEvent.click(overlay)
    
    expect(handleClose).toHaveBeenCalled()
  })

  it('does not close when modal content is clicked', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )
    
    const modalContent = screen.getByText('Modal content')
    fireEvent.click(modalContent)
    
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('applies correct size classes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={() => {}} title="Small Modal" size="small">
        <p>Content</p>
      </Modal>
    )
    expect(screen.getByText('Small Modal')).toBeInTheDocument()

    rerender(
      <Modal isOpen={true} onClose={() => {}} title="Large Modal" size="large">
        <p>Content</p>
      </Modal>
    )
    expect(screen.getByText('Large Modal')).toBeInTheDocument()
  })
})
