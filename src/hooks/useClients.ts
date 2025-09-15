import { useState, useEffect, useMemo } from 'react';
import { Client, ClientFormData, ClientSortField, ClientSortDirection, ClientFilterOptions } from '../types/client';
import { supabase } from '../lib/supabase';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<ClientSortField>('name');
  const [sortDirection, setSortDirection] = useState<ClientSortDirection>('asc');
  const [filters, setFilters] = useState<ClientFilterOptions>({
    status: []
  });

  // Load clients from Supabase
  const loadClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading clients:', error);
        setError('Nepavyko įkelti klientų');
        return;
      }

      // Transform Supabase data to match our Client type
      const transformedClients: Client[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        code: item.code,
        email: item.email || '',
        phone: item.phone || '',
        address: item.address || '',
        contactPerson: item.contact_person || '',
        notes: item.notes || '',
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        status: item.status || 'active'
      }));

      setClients(transformedClients);
      setError(null);
    } catch (err) {
      console.error('Error loading clients:', err);
      setError('Nepavyko įkelti klientų');
    } finally {
      setLoading(false);
    }
  };

  // Load clients on component mount
  useEffect(() => {
    loadClients();
  }, []);

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

  // Add new client
  const addClient = async (clientData: ClientFormData): Promise<string> => {
    try {
      const newClient = {
        name: clientData.name,
        code: clientData.code,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        contact_person: clientData.contactPerson,
        notes: clientData.notes,
        status: 'active'
      };

      const { data, error } = await supabase
        .from('clients')
        .insert([newClient])
        .select()
        .single();

      if (error) {
        console.error('Error adding client:', error);
        setError('Nepavyko pridėti kliento');
        throw new Error(error.message);
      }

      // Reload clients to get updated list
      await loadClients();
      return data.id;
    } catch (err) {
      console.error('Error adding client:', err);
      setError('Nepavyko pridėti kliento');
      throw err;
    }
  };

  // Update client
  const updateClient = async (id: string, clientData: Partial<ClientFormData>): Promise<void> => {
    try {
      const updateData: any = {};
      
      if (clientData.name !== undefined) updateData.name = clientData.name;
      if (clientData.code !== undefined) updateData.code = clientData.code;
      if (clientData.email !== undefined) updateData.email = clientData.email;
      if (clientData.phone !== undefined) updateData.phone = clientData.phone;
      if (clientData.address !== undefined) updateData.address = clientData.address;
      if (clientData.contactPerson !== undefined) updateData.contact_person = clientData.contactPerson;
      if (clientData.notes !== undefined) updateData.notes = clientData.notes;

      const { error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating client:', error);
        setError('Nepavyko atnaujinti kliento');
        throw new Error(error.message);
      }

      // Reload clients to get updated list
      await loadClients();
    } catch (err) {
      console.error('Error updating client:', err);
      setError('Nepavyko atnaujinti kliento');
      throw err;
    }
  };

  // Delete client
  const deleteClient = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting client:', error);
        setError('Nepavyko ištrinti kliento');
        throw new Error(error.message);
      }

      // Reload clients to get updated list
      await loadClients();
    } catch (err) {
      console.error('Error deleting client:', err);
      setError('Nepavyko ištrinti kliento');
      throw err;
    }
  };

  const updateSort = (field: ClientSortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Clear error
  const clearError = () => setError(null);

  return {
    clients: filteredAndSortedClients,
    allClients: clients,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    updateSort,
    filters,
    setFilters,
    addClient,
    updateClient,
    deleteClient,
    clearError,
    refreshClients: loadClients
  };
};