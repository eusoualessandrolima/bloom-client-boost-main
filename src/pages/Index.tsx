import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { RevenueCard } from '@/components/dashboard/RevenueCard';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { KanbanBoard } from '@/components/clients/KanbanBoard';
import { ClientTable } from '@/components/clients/ClientTable';
import { ClientDetailDrawer } from '@/components/clients/ClientDetailDrawer';
import { NewClientModal } from '@/components/clients/NewClientModal';
import { useClients } from '@/contexts/ClientContext';
import { Client, ClientStatus } from '@/types/client';
import { Users, Package, TrendingUp, Percent } from 'lucide-react';

const Index = () => {
  const [activeView, setActiveView] = useState<'board' | 'kanban'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const { getStatusCounts, clients } = useClients();
  const counts = getStatusCounts();
  const total = counts.active + counts.overdue + counts.inactive + counts.cancelled;

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

  const metrics: { label: string; value: number; status: ClientStatus; percentage: number }[] = [
    { label: 'Ativos', value: counts.active, status: 'active', percentage: Math.round((counts.active / total) * 100) || 0 },
    { label: 'Inadimplentes', value: counts.overdue, status: 'overdue', percentage: Math.round((counts.overdue / total) * 100) || 0 },
    { label: 'Inativos', value: counts.inactive, status: 'inactive', percentage: Math.round((counts.inactive / total) * 100) || 0 },
    { label: 'Cancelados', value: counts.cancelled, status: 'cancelled', percentage: Math.round((counts.cancelled / total) * 100) || 0 },
  ];

  // Calculate insights
  const avgConnections = clients.length > 0 
    ? (clients.reduce((sum, c) => sum + c.connections, 0) / clients.length).toFixed(1)
    : '0';
  
  const avgValue = clients.filter(c => c.status === 'active').length > 0
    ? Math.round(
        clients.filter(c => c.status === 'active').reduce((sum, c) => sum + c.monthlyValue, 0) /
        clients.filter(c => c.status === 'active').length
      )
    : 0;

  const productCounts = clients.reduce((acc, c) => {
    acc[c.product] = (acc[c.product] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topProduct = Object.entries(productCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || '-';

  return (
    <Layout>
      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Metrics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map(metric => (
            <MetricCard key={metric.status} {...metric} />
          ))}
        </div>

        {/* Charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StatusChart />
          <RevenueCard />
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InsightCard
            icon={Users}
            label="Total de Clientes"
            value={clients.length}
            trend="up"
            trendValue="3"
          />
          <InsightCard
            icon={Package}
            label="Produto Mais Popular"
            value={topProduct}
            subtext={`${productCounts[topProduct] || 0} clientes`}
          />
          <InsightCard
            icon={TrendingUp}
            label="Ticket Médio"
            value={`R$ ${avgValue.toLocaleString('pt-BR')}`}
            trend="up"
            trendValue="5%"
          />
          <InsightCard
            icon={Percent}
            label="Taxa de Retenção"
            value="96%"
            subtext="Últimos 30 dias"
            trend="up"
            trendValue="2%"
          />
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

export default Index;
