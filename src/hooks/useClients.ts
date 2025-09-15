import { useState, useEffect, useMemo } from 'react';
import { Client, ClientFormData, ClientSortField, ClientSortDirection, ClientFilterOptions } from '../types/client';

// Mock data for demonstration
const mockClients: Client[] = [
  {
    id: '1',
    name: 'UAB "Grožio namai"',
    code: 'GN001',
    email: 'info@grozionamai.lt',
    phone: '+370 600 12345',
    address: 'Vilniaus g. 123, Vilnius',
    contactPerson: 'Rasa Petraitienė',
    notes: 'Specializuojasi natūralios kosmetikos gamyboje',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-12-01T10:30:00Z',
    status: 'active'
  },
  {
    id: '2',
    name: 'SPA centras "Harmonija"',
    code: 'HAR002',
    email: 'uzsakymai@harmonija.lt',
    phone: '+370 650 98765',
    address: 'Gedimino pr. 45, Kaunas',
    contactPerson: 'Mindaugas Kazlauskas',
    notes: 'Prabangūs SPA produktai ir procedūros',
    createdAt: '2024-02-15T14:20:00Z',
    updatedAt: '2024-11-28T16:45:00Z',
    status: 'active'
  },
  {
    id: '3',
    name: 'Kosmetikos studija "Bella"',
    code: 'BEL003',
    email: 'bella@kosmetika.lt',
    phone: '+370 620 55555',
    address: 'Laisvės al. 78, Kaunas',
    contactPerson: 'Elena Jonaitienė',
    notes: 'Individualūs kosmetikos sprendimai',
    createdAt: '2024-03-20T11:15:00Z',
    updatedAt: '2024-12-01T09:20:00Z',
    status: 'active'
  }
];

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<ClientSortField>('name');
  const [sortDirection, setSortDirection] = useState<ClientSortDirection>('asc');
  const [filters, setFilters] = useState<ClientFilterOptions>({
    status: []
  });

  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter(client => {
      const matchesSearch = searchTerm === '' || 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filters.status.length === 0 || filters.status.includes(client.status);

      return matchesSearch && matchesStatus;
    });

    // Sort clients
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'createdAt') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [clients, searchTerm, sortField, sortDirection, filters]);

  const addClient = (clientData: ClientFormData) => {
    const newClient: Client = {
      id: Date.now().toString(),
      ...clientData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setClients(prev => [...prev, newClient]);
    return newClient.id;
  };

  const updateClient = (id: string, clientData: Partial<ClientFormData>) => {
    setClients(prev => prev.map(client => 
      client.id === id 
        ? { ...client, ...clientData, updatedAt: new Date().toISOString() }
        : client
    ));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  const updateSort = (field: ClientSortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    clients: filteredAndSortedClients,
    allClients: clients,
    loading,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    updateSort,
    filters,
    setFilters,
    addClient,
    updateClient,
    deleteClient
  };
};