import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../test/test-utils'
import SearchInput from './SearchInput'

describe('SearchInput Component', () => {
  it('renders with placeholder text', () => {
    render(
      <SearchInput 
        value="" 
        onChange={() => {}} 
        placeholder="Search clients..." 
      />
    )
    expect(screen.getByPlaceholderText('Search clients...')).toBeInTheDocument()
  })

  it('displays the value correctly', () => {
    render(
      <SearchInput 
        value="João" 
        onChange={() => {}} 
        placeholder="Search clients..." 
      />
    )
    expect(screen.getByDisplayValue('João')).toBeInTheDocument()
  })

  it('calls onChange when typing', () => {
    const handleChange = vi.fn()
    render(
      <SearchInput 
        value="" 
        onChange={handleChange} 
        placeholder="Search clients..." 
      />
    )
    
    const input = screen.getByPlaceholderText('Search clients...')
    fireEvent.change(input, { target: { value: 'João' } })
    
    expect(handleChange).toHaveBeenCalledWith('João')
  })

  it('shows clear button when value is not empty', () => {
    render(
      <SearchInput 
        value="João" 
        onChange={() => {}} 
        placeholder="Search clients..." 
      />
    )
    
    const clearButton = screen.getByRole('button')
    expect(clearButton).toBeInTheDocument()
  })

  it('calls onClear when clear button is clicked', () => {
    const handleClear = vi.fn()
    render(
      <SearchInput 
        value="João" 
        onChange={() => {}} 
        onClear={handleClear}
        placeholder="Search clients..." 
      />
    )
    
    const clearButton = screen.getByRole('button')
    fireEvent.click(clearButton)
    
    expect(handleClear).toHaveBeenCalled()
  })

  it('shows search indicator when value exists', () => {
    render(
      <SearchInput 
        value="João" 
        onChange={() => {}} 
        placeholder="Search clients..." 
      />
    )
    
    expect(screen.getByText(/Pesquisando por:/)).toBeInTheDocument()
    expect(screen.getByText('João')).toBeInTheDocument()
  })
})
