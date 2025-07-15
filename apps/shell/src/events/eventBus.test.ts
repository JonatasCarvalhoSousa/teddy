import { describe, it, expect, beforeEach, vi } from 'vitest'
import { eventBus, listenToExternalEvents } from './eventBus'

describe('EventBus', () => {
  beforeEach(() => {
    // Limpar todos os listeners
    eventBus.removeAllListeners()
  })

  it('should emit and listen to events', () => {
    const mockCallback = vi.fn()
    const testData = { id: 1, name: 'Test Client' }

    eventBus.on('test-event', mockCallback)
    eventBus.emit('test-event', testData)

    expect(mockCallback).toHaveBeenCalledWith(testData)
  })

  it('should remove specific listeners', () => {
    const mockCallback = vi.fn()

    eventBus.on('test-event', mockCallback)
    eventBus.off('test-event', mockCallback)
    eventBus.emit('test-event', { data: 'test' })

    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should handle multiple listeners for same event', () => {
    const mockCallback1 = vi.fn()
    const mockCallback2 = vi.fn()
    const testData = { message: 'hello' }

    eventBus.on('multi-event', mockCallback1)
    eventBus.on('multi-event', mockCallback2)
    eventBus.emit('multi-event', testData)

    expect(mockCallback1).toHaveBeenCalledWith(testData)
    expect(mockCallback2).toHaveBeenCalledWith(testData)
  })

  it('should handle client selection events', () => {
    const mockCallback = vi.fn()
    const clientData = { id: 1, name: 'João Silva', selected: true }

    eventBus.on('client-selected', mockCallback)
    eventBus.emit('client-selected', clientData)

    expect(mockCallback).toHaveBeenCalledWith(clientData)
  })

  it('should handle client creation events', () => {
    const mockCallback = vi.fn()
    const newClient = { name: 'Novo Cliente', salary: 5000, companyValuation: 50000 }

    eventBus.on('client-created', mockCallback)
    eventBus.emit('client-created', newClient)

    expect(mockCallback).toHaveBeenCalledWith(newClient)
  })

  it('should handle navigation events', () => {
    const mockCallback = vi.fn()
    const navigation = { path: '/selected', state: {} }

    eventBus.on('navigate', mockCallback)
    eventBus.emit('navigate', navigation)

    expect(mockCallback).toHaveBeenCalledWith(navigation)
  })

  describe('listenToExternalEvents', () => {
    it('should register external event listeners', () => {
      const mockDispatch = vi.fn()
      
      // Mock window events
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      
      listenToExternalEvents(mockDispatch)
      
      expect(addEventListenerSpy).toHaveBeenCalled()
    })

    it('should clean up event listeners on unmount', () => {
      const mockDispatch = vi.fn()
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
      
      const cleanup = listenToExternalEvents(mockDispatch)
      cleanup()
      
      expect(removeEventListenerSpy).toHaveBeenCalled()
    })
  })
})
