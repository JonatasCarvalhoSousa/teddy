export interface Client {
  id: number;
  name: string;
  salary: number;
  companyValuation: number;
}

export interface CreateClientRequest {
  name: string;
  salary: number;
  companyValuation: number;
}

export interface UpdateClientRequest {
  name?: string;
  salary?: number;
  companyValuation?: number;
}

export interface ApiResponse {
  clients: Client[];
  currentPage: number;
  totalPages: number;
  totalClients: number;
  totalItems?: number;
}
