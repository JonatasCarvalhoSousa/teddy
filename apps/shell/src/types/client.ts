export interface Client {
  id: number;
  name: string;
  salary: number;
  companyValuation: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  clients: Client[];
  totalPages: number;
  currentPage: number;
  totalItems?: number;
  totalClients?: number;
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
