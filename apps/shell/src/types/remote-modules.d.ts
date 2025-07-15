declare module 'clients/ClientsApp' {
  import React from 'react';
  
  interface ClientsAppProps {
    onClientSelect?: (clientId: number) => void;
    selectedClients?: number[];
  }
  
  const ClientsApp: React.ComponentType<ClientsAppProps>;
  export default ClientsApp;
}

declare module 'selected/SelectedApp' {
  import React from 'react';
  import { Client } from '../types/client';
  
  interface SelectedAppProps {
    clients?: Client[];
    selectedIds?: number[];
    onClientUpdate?: (client: Client) => void;
    onClientDelete?: (clientId: number) => void;
  }
  
  const SelectedApp: React.ComponentType<SelectedAppProps>;
  export default SelectedApp;
}
