import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiService } from './apiService'
import { mockApiResponse, mockClient } from '../test/test-utils'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('ApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getClients', () => {
    it('fetches clients successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve(mockApiResponse)
      })

      const result = await apiService.getClients(1, 10)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://boasorte.teddybackoffice.com.br/users?page=1&limit=10',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' }
        })
      )
      expect(result).toEqual(mockApiResponse)
    })

    it('throws error when request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await expect(apiService.getClients()).rejects.toThrow('HTTP error! status: 500')
    })
  })

  describe('createClient', () => {
    it('creates client successfully', async () => {
      const newClientData = {
        name: 'Novo Cliente',
        salary: 7000,
        companyValuation: 70000
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ ...mockClient, ...newClientData })
      })

      const result = await apiService.createClient(newClientData)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://boasorte.teddybackoffice.com.br/users',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newClientData)
        })
      )
      expect(result.name).toBe(newClientData.name)
    })
  })

  describe('updateClient', () => {
    it('updates client successfully', async () => {
      const updateData = { name: 'Nome Atualizado' }
      const updatedClient = { ...mockClient, ...updateData }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve(updatedClient)
      })

      const result = await apiService.updateClient(1, updateData)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://boasorte.teddybackoffice.com.br/users/1',
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        })
      )
      expect(result.name).toBe(updateData.name)
    })
  })

  describe('deleteClient', () => {
    it('deletes client successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-length': '0' })
      })

      await expect(apiService.deleteClient(1)).resolves.toBeUndefined()

      expect(mockFetch).toHaveBeenCalledWith(
        'https://boasorte.teddybackoffice.com.br/users/1',
        expect.objectContaining({
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
      )
    })
  })

  describe('searchClients', () => {
    it('searches clients by name', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve(mockApiResponse)
      })

      const result = await apiService.searchClients('João', 1, 10)

      expect(result.clients).toHaveLength(1)
      expect(result.clients[0].name).toContain('João')
      expect(result.totalClients).toBe(1)
    })

    it('returns empty results for non-matching search', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve(mockApiResponse)
      })

      const result = await apiService.searchClients('NaoExiste', 1, 10)

      expect(result.clients).toHaveLength(0)
      expect(result.totalClients).toBe(0)
    })
  })
})
