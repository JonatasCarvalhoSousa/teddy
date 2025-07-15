import { Client } from '../types/client';

interface EventData {
  type: string;
  payload: any;
}

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

    // Retorna função para remover o listener
    return () => {
      this.eventTarget.removeEventListener(event, handler);
    };
  }

  // Método para sincronizar estado entre micro-frontends
  syncState(clients: Client[], selectedIds: number[]): void {
    this.emit('state:sync', { clients, selectedIds });
  }
}

// Instância singleton do event bus
export const eventBus = new MicroFrontendEventBus();

// Helper para broadcast de eventos para window (comunicação cross-origin)
export const broadcastEvent = <K extends keyof MicroFrontendEvents>(
  event: K,
  data: MicroFrontendEvents[K]
): void => {
  eventBus.emit(event, data);
  
  // Broadcast para outros micro-frontends via postMessage
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
};
