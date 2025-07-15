import { Client } from '../types/client';

export interface MicroFrontendEvents {
  'client:created': Client;
  'client:updated': Client;
  'client:deleted': number;
  'client:selected': number;
  'client:unselected': number;
  'clients:cleared': void;
  'state:sync': {
    clients: Client[];
    selectedIds: number[];
  };
}

class MicroFrontendEventBus {
  private eventTarget = new EventTarget();

  emit<K extends keyof MicroFrontendEvents>(
    event: K,
    data: MicroFrontendEvents[K]
  ): void {
    const customEvent = new CustomEvent(event, { detail: data });
    this.eventTarget.dispatchEvent(customEvent);
    
  }

  on<K extends keyof MicroFrontendEvents>(
    event: K,
    callback: (data: MicroFrontendEvents[K]) => void
  ): () => void {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      callback(customEvent.detail);
    };

    this.eventTarget.addEventListener(event, handler);

    return () => {
      this.eventTarget.removeEventListener(event, handler);
    };
  }

  // Método para sincronizar estado entre micro-frontends
  syncState(clients: Client[], selectedIds: number[]): void {
    this.emit('state:sync', { clients, selectedIds });
  }
}

export const eventBus = new MicroFrontendEventBus();

// Helper para broadcast de eventos para window (comunicação cross-origin)
export const broadcastEvent = <K extends keyof MicroFrontendEvents>(
  event: K,
  data: MicroFrontendEvents[K]
): void => {
  eventBus.emit(event, data);
  
  // Broadcast via localStorage para comunicação entre micro-frontends em portas diferentes
  try {
    const eventData = {
      source: 'micro-frontend-event',
      event,
      data,
      timestamp: Date.now()
    };
    
    localStorage.setItem('mf-event-bus', JSON.stringify(eventData));
    
    setTimeout(() => {
      const current = localStorage.getItem('mf-event-bus');
      if (current) {
        const parsed = JSON.parse(current);
        if (parsed.timestamp === eventData.timestamp) {
          localStorage.removeItem('mf-event-bus');
        }
      }
    }, 1000);
  } catch (error) {
    console.warn('[EventBus] Erro ao enviar evento via localStorage:', error);
  }
  
  window.postMessage({
    source: 'micro-frontend-event',
    event,
    data
  }, '*');
};

// Helper para escutar eventos de outros micro-frontends
export const listenToExternalEvents = (): void => {
  window.addEventListener('message', (event) => {
    if (event.data?.source === 'micro-frontend-event') {
      const { event: eventType, data } = event.data;
      eventBus.emit(eventType, data);
    }
  });
  
  // Escutar via localStorage (diferentes contextos/portas)
  window.addEventListener('storage', (event) => {
    if (event.key === 'mf-event-bus' && event.newValue) {
      try {
        const eventData = JSON.parse(event.newValue);
        if (eventData.source === 'micro-frontend-event') {
          const { event: eventType, data } = eventData;
          eventBus.emit(eventType, data);
        }
      } catch (error) {
        console.warn('[EventBus] Erro ao processar evento do localStorage:', error);
      }
    }
  });
};
