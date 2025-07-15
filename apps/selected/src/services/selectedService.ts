import { Client } from '../types/client';
import { broadcastEvent } from '../events/eventBus';

const API_BASE_URL = 'https://boasorte.teddybackoffice.com.br';

class SelectedService {
  private selectedClientsIds: Set<number> = new Set();
  private allClients: Client[] = [];
  private storageKey = 'teddy-selected-clients';
  private clientsStorageKey = 'teddy-all-clients';

  constructor() {
    this.loadFromStorage();
  }

  // Método para buscar clientes da API se necessário
  private async fetchClientsFromAPI(): Promise<Client[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users?page=1&limit=1000`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const clients = data.clients || [];
      
      // Salvar no storage para próximas consultas
      this.allClients = clients;
      this.saveToStorage();
      
      return clients;
    } catch (error) {
      console.error('[SelectedService] Erro ao buscar clientes da API:', error);
      return [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.selectedClientsIds)));
      localStorage.setItem(this.clientsStorageKey, JSON.stringify(this.allClients));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const savedSelectedIds = localStorage.getItem(this.storageKey);
      const savedClients = localStorage.getItem(this.clientsStorageKey);
      
      if (savedSelectedIds) {
        const ids = JSON.parse(savedSelectedIds) as number[];
        this.selectedClientsIds = new Set(ids);
      }

      if (savedClients) {
        this.allClients = JSON.parse(savedClients) as Client[];
      }
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
      this.selectedClientsIds = new Set();
      this.allClients = [];
    }
  }

  selectClient(clientId: number): void {
    this.selectedClientsIds.add(clientId);
    this.saveToStorage();
    broadcastEvent('client:selected', clientId);
  }

  selectClientDirectly(clientId: number): void {
    this.selectedClientsIds.add(clientId);
    this.saveToStorage();
  }

  unselectClientDirectly(clientId: number): void {
    this.selectedClientsIds.delete(clientId);
    this.saveToStorage();
  }

  unselectClient(clientId: number): void {
    this.selectedClientsIds.delete(clientId);
    this.saveToStorage();
    broadcastEvent('client:unselected', clientId);
  }

  toggleClient(clientId: number): boolean {
    if (this.selectedClientsIds.has(clientId)) {
      this.unselectClient(clientId);
      return false;
    } else {
      this.selectClient(clientId);
      return true;
    }
  }

  clearAllSelected(): void {
    this.selectedClientsIds.clear();
    this.saveToStorage();
    broadcastEvent('clients:cleared', undefined);
  }

  clearAllSelectedDirectly(): void {
    this.selectedClientsIds.clear();
    this.saveToStorage();
  }

  isSelected(clientId: number): boolean {
    return this.selectedClientsIds.has(clientId);
  }

  getSelectedIds(): number[] {
    return Array.from(this.selectedClientsIds);
  }

  getSelectedCount(): number {
    return this.selectedClientsIds.size;
  }

  updateAllClients(clients: Client[]): void {
    this.allClients = clients;
    this.saveToStorage();
  }

  addClient(client: Client): void {
    const existingIndex = this.allClients.findIndex(c => c.id === client.id);
    if (existingIndex >= 0) {
      this.allClients[existingIndex] = client;
    } else {
      this.allClients.push(client);
    }
    this.saveToStorage();
  }

  updateClient(client: Client): void {
    const index = this.allClients.findIndex(c => c.id === client.id);
    if (index >= 0) {
      this.allClients[index] = client;
      this.saveToStorage();
    }
  }

  removeClient(clientId: number): void {
    this.allClients = this.allClients.filter(c => c.id !== clientId);
    this.selectedClientsIds.delete(clientId);
    this.saveToStorage();
  }

  getSelectedClients(): Client[] {
    return this.allClients.filter(client => 
      this.selectedClientsIds.has(client.id)
    );
  }

  async initializeFromStorage(): Promise<void> {
    
    if (this.selectedClientsIds.size > 0 && this.allClients.length === 0) {
      await this.fetchClientsFromAPI();
    }
    
    if (this.allClients.length === 0) {
      try {
        const savedClients = localStorage.getItem(this.clientsStorageKey);
        if (savedClients) {
          this.allClients = JSON.parse(savedClients) as Client[];
        }
      } catch (error) {
        console.error('[SelectedService] Erro ao carregar clientes do localStorage:', error);
      }
    }
  }

  async getSelectedClientsAsync(): Promise<Client[]> {
    await this.initializeFromStorage();
    
    return this.getSelectedClients();
  }

  getFilteredSelectedClients(searchTerm: string = ''): Client[] {
    const selectedClients = this.getSelectedClients();
    
    if (!searchTerm.trim()) {
      return selectedClients;
    }

    return selectedClients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  getPaginatedSelectedClients(
    page: number = 1, 
    itemsPerPage: number = 16, 
    searchTerm: string = ''
  ): {
    clients: Client[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
  } {
    const filteredClients = this.getFilteredSelectedClients(searchTerm);
    const totalItems = filteredClients.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const clients = filteredClients.slice(startIndex, endIndex);

    return {
      clients,
      totalPages,
      currentPage: page,
      totalItems
    };
  }

  forceReloadFromStorage(): void {
    this.loadFromStorage();
  }
}

export const selectedService = new SelectedService();
