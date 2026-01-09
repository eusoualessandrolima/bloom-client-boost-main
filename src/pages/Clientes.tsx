import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { KanbanBoard } from '@/components/clients/KanbanBoard';
import { ClientTable } from '@/components/clients/ClientTable';
import { ClientDetailDrawer } from '@/components/clients/ClientDetailDrawer';
import { NewClientModal } from '@/components/clients/NewClientModal';
import { useClients } from '@/contexts/ClientContext';
import { Client } from '@/types/client';

const Clientes = () => {
  const [activeView, setActiveView] = useState<'board' | 'kanban'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const { clients } = useClients();

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setDrawerOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setClientToEdit(client);
    setEditModalOpen(true);
    setDrawerOpen(false);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setClientToEdit(null);
  };

  return (
    <Layout>
      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Page title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground">
              {clients.length} clientes cadastrados
            </p>
          </div>
        </div>

        {/* Main view */}
        {activeView === 'kanban' ? (
          <KanbanBoard onClientClick={handleClientClick} searchQuery={searchQuery} />
        ) : (
          <ClientTable onClientClick={handleClientClick} searchQuery={searchQuery} />
        )}
      </div>

      <ClientDetailDrawer
        client={selectedClient}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={handleEditClient}
      />

      <NewClientModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        editClient={clientToEdit}
      />
    </Layout>
  );
};

export default Clientes;
