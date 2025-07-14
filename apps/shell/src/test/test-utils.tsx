import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from '../context/AppContext'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AppProvider>
        {children}
      </AppProvider>
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

export const mockClient = {
  id: 1,
  name: 'João Silva',
  salary: 5000,
  companyValuation: 50000,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
}

export const mockClients = [
  mockClient,
  {
    id: 2,
    name: 'Maria Santos',
    salary: 6000,
    companyValuation: 60000,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'Pedro Costa',
    salary: 4500,
    companyValuation: 45000,
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z'
  }
]

export const mockApiResponse = {
  clients: mockClients,
  totalPages: 1,
  currentPage: 1,
  totalItems: 3
}
