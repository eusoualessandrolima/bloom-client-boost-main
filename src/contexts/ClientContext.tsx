import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Client, ClientStatus } from '@/types/client';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ClientContextType {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  updateClientStatus: (clientId: string, newStatus: ClientStatus) => Promise<void>;
  getClientById: (id: string) => Client | undefined;
  searchClients: (query: string) => Client[];
  filterByStatus: (status: ClientStatus | 'all') => Client[];
  getTotalRevenue: () => number;
  getStatusCounts: () => Record<ClientStatus, number>;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<void>;
  updateClient: (id: string, data: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  isLoading: boolean;
  refreshClients: () => Promise<void>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

// Convert database row to Client type
function dbRowToClient(row: any): Client {
  return {
    id: row.id,
    companyName: row.company_name,
    responsibleName: row.responsible_name,
    responsiblePhone: row.responsible_phone,
    responsibleEmail: row.responsible_email,
    responsibleRole: row.responsible_role,
    email: row.email,
    document: row.document,
    niche: row.niche,
    connections: row.connections,
    product: row.product,
    monthlyValue: row.monthly_value,
    paymentMethod: row.payment_method,
    dueDate: row.due_date,
    notes: row.notes || '',
    status: row.status,
    createdAt: new Date(row.created_at),
    tags: row.tags || undefined,
    companyPhone: row.company_phone,
  };
}

// Convert Client to database row format
function clientToDbRow(client: Partial<Client>, userId?: string): any {
  const row: any = {};

  if (client.companyName !== undefined) row.company_name = client.companyName;
  if (client.responsibleName !== undefined) row.responsible_name = client.responsibleName;
  if (client.responsiblePhone !== undefined) row.responsible_phone = client.responsiblePhone;
  if (client.responsibleEmail !== undefined) row.responsible_email = client.responsibleEmail;
  if (client.responsibleRole !== undefined) row.responsible_role = client.responsibleRole;
  if (client.email !== undefined) row.email = client.email;
  if (client.document !== undefined) row.document = client.document;
  if (client.niche !== undefined) row.niche = client.niche;
  if (client.connections !== undefined) row.connections = client.connections;
  if (client.product !== undefined) row.product = client.product;
  if (client.monthlyValue !== undefined) row.monthly_value = client.monthlyValue;
  if (client.paymentMethod !== undefined) row.payment_method = client.paymentMethod;
  if (client.dueDate !== undefined) row.due_date = client.dueDate;
  if (client.notes !== undefined) row.notes = client.notes;
  if (client.status !== undefined) row.status = client.status;
  if (client.tags !== undefined) row.tags = client.tags;
  if (client.companyPhone !== undefined) row.company_phone = client.companyPhone;
  if (userId) row.user_id = userId;

  return row;
}

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session, isAuthenticated } = useAuth();

  // Fetch clients from Supabase
  const refreshClients = useCallback(async () => {
    if (!session?.user?.id) {
      setClients([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        toast.error('Erro ao carregar clientes');
        return;
      }

      setClients(data ? data.map(dbRowToClient) : []);
    } catch (error) {
      console.error('Unexpected error fetching clients:', error);
      toast.error('Erro inesperado ao carregar clientes');
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  // Load clients when authenticated
  useEffect(() => {
    if (isAuthenticated && session?.user?.id) {
      refreshClients();
    } else {
      setClients([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, session?.user?.id, refreshClients]);

  const updateClientStatus = async (clientId: string, newStatus: ClientStatus) => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('clients')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', clientId)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error updating client status:', error);
        toast.error('Erro ao atualizar status do cliente');
        return;
      }

      setClients(prev =>
        prev.map(client =>
          client.id === clientId ? { ...client, status: newStatus } : client
        )
      );
      toast.success('Status atualizado com sucesso!');
    } catch (error) {
      console.error('Unexpected error updating status:', error);
      toast.error('Erro inesperado ao atualizar status');
    }
  };

  const getClientById = (id: string) => clients.find(c => c.id === id);

  const searchClients = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return clients.filter(
      c =>
        c.companyName.toLowerCase().includes(lowerQuery) ||
        c.responsibleName.toLowerCase().includes(lowerQuery) ||
        c.email.toLowerCase().includes(lowerQuery) ||
        c.niche.toLowerCase().includes(lowerQuery)
    );
  };

  const filterByStatus = (status: ClientStatus | 'all') => {
    if (status === 'all') return clients;
    return clients.filter(c => c.status === status);
  };

  const getTotalRevenue = () =>
    clients
      .filter(c => c.status === 'active')
      .reduce((sum, c) => sum + c.monthlyValue, 0);

  const getStatusCounts = () => ({
    active: clients.filter(c => c.status === 'active').length,
    overdue: clients.filter(c => c.status === 'overdue').length,
    inactive: clients.filter(c => c.status === 'inactive').length,
    cancelled: clients.filter(c => c.status === 'cancelled').length,
  });

  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    if (!session?.user?.id) {
      toast.error('Você precisa estar logado para adicionar clientes');
      return;
    }

    try {
      const dbRow = clientToDbRow(clientData, session.user.id);
      dbRow.id = crypto.randomUUID();
      dbRow.created_at = new Date().toISOString();
      dbRow.updated_at = new Date().toISOString();

      if (!dbRow.status) dbRow.status = 'active';
      if (!dbRow.notes) dbRow.notes = '';

      const { data, error } = await supabase
        .from('clients')
        .insert(dbRow)
        .select()
        .single();

      if (error) {
        console.error('Error adding client:', error);
        toast.error('Erro ao adicionar cliente: ' + error.message);
        return;
      }

      if (data) {
        setClients(prev => [dbRowToClient(data), ...prev]);
        toast.success('Cliente adicionado com sucesso!');
      }
    } catch (error) {
      console.error('Unexpected error adding client:', error);
      toast.error('Erro inesperado ao adicionar cliente');
    }
  };

  const updateClient = async (id: string, data: Partial<Client>) => {
    if (!session?.user?.id) return;

    try {
      const dbRow = clientToDbRow(data);
      dbRow.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('clients')
        .update(dbRow)
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error updating client:', error);
        toast.error('Erro ao atualizar cliente');
        return;
      }

      setClients(prev =>
        prev.map(client =>
          client.id === id ? { ...client, ...data } : client
        )
      );
      toast.success('Cliente atualizado com sucesso!');
    } catch (error) {
      console.error('Unexpected error updating client:', error);
      toast.error('Erro inesperado ao atualizar cliente');
    }
  };

  const deleteClient = async (id: string) => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error deleting client:', error);
        toast.error('Erro ao deletar cliente');
        return;
      }

      setClients(prev => prev.filter(c => c.id !== id));
      toast.success('Cliente removido com sucesso!');
    } catch (error) {
      console.error('Unexpected error deleting client:', error);
      toast.error('Erro inesperado ao deletar cliente');
    }
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        setClients,
        updateClientStatus,
        getClientById,
        searchClients,
        filterByStatus,
        getTotalRevenue,
        getStatusCounts,
        addClient,
        updateClient,
        deleteClient,
        isLoading,
        refreshClients,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
}
