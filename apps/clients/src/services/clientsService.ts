import { Client, CreateClientRequest, UpdateClientRequest, ApiResponse } from '../types/client';
import { broadcastEvent } from '../events/eventBus';

const BASE_URL = 'https://boasorte.teddybackoffice.com.br';

class ClientsService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      const hasContent = response.headers.get('content-length') !== '0';
      
      if (options.method === 'DELETE' || !hasContent) {
        return {} as T;
      }
      
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // Response não é JSON, retornar objeto vazio
        await response.text(); // Consumir o response mesmo que não seja usado
        return {} as T;
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getClients(page: number = 1, limit: number = 100): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>(`/users?page=${page}&limit=${limit}`);
  }

  async searchClients(searchTerm: string, page: number = 1, limit: number = 100): Promise<ApiResponse> {
    const allClients = await this.getClients(1, 1000);
    
    const filteredClients = allClients.clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedClients = filteredClients.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredClients.length / limit);

    return {
      clients: paginatedClients,
      currentPage: page,
      totalPages: totalPages,
      totalClients: filteredClients.length
    };
  }

  async getClientById(id: number): Promise<Client> {
    return this.makeRequest<Client>(`/users/${id}`);
  }

  async createClient(clientData: CreateClientRequest): Promise<Client> {
    const newClient = await this.makeRequest<Client>('/users', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
    
    // Broadcast evento de criação para outros micro-frontends
    broadcastEvent('client:created', newClient);
    
    return newClient;
  }

  async updateClient(id: number, clientData: UpdateClientRequest): Promise<Client> {
    const updatedClient = await this.makeRequest<Client>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(clientData),
    });
    
    // Broadcast evento de atualização para outros micro-frontends
    broadcastEvent('client:updated', updatedClient);
    
    return updatedClient;
  }

  async deleteClient(id: number): Promise<void> {
    const url = `${BASE_URL}/users/${id}`;
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Broadcast evento de exclusão para outros micro-frontends
      broadcastEvent('client:deleted', id);
      
      return;
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      throw error;
    }
  }
}

export const clientsService = new ClientsService();
