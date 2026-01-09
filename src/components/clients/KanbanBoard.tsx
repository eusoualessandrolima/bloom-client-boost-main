import { useState } from 'react';
import { useClients } from '@/contexts/ClientContext';
import { ClientStatus, Client } from '@/types/client';
import { ClientCard } from './ClientCard';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

const columns: { status: ClientStatus; label: string; headerClass: string }[] = [
  { status: 'active', label: 'Ativos', headerClass: 'kanban-header-active' },
  { status: 'overdue', label: 'Inadimplentes', headerClass: 'kanban-header-overdue' },
  { status: 'inactive', label: 'Inativos', headerClass: 'kanban-header-inactive' },
  { status: 'cancelled', label: 'Cancelados', headerClass: 'kanban-header-cancelled' },
];

interface KanbanBoardProps {
  onClientClick: (client: Client) => void;
  searchQuery: string;
}

export function KanbanBoard({ onClientClick, searchQuery }: KanbanBoardProps) {
  const { clients, updateClientStatus, searchClients } = useClients();
  const [draggedClient, setDraggedClient] = useState<Client | null>(null);

  const filteredClients = searchQuery ? searchClients(searchQuery) : clients;

  const handleDragStart = (e: React.DragEvent, client: Client) => {
    setDraggedClient(client);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: ClientStatus) => {
    e.preventDefault();
    if (draggedClient && draggedClient.status !== status) {
      updateClientStatus(draggedClient.id, status);
    }
    setDraggedClient(null);
  };

  const handleDragEnd = () => {
    setDraggedClient(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
      {columns.map(column => {
        const columnClients = filteredClients.filter(c => c.status === column.status);

        return (
          <div
            key={column.status}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, column.status)}
            className="flex-shrink-0 w-80"
          >
            {/* Column header */}
            <div
              className={cn(
                'bg-muted rounded-t-xl px-4 py-3 flex items-center justify-between',
                column.headerClass
              )}
            >
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{column.label}</h3>
                <span className="px-2 py-0.5 bg-background rounded-full text-xs font-medium text-muted-foreground">
                  {columnClients.length}
                </span>
              </div>
              <button className="p-1 hover:bg-background rounded-md transition-colors">
                <Plus className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Column content */}
            <div className="bg-muted/50 rounded-b-xl p-3 min-h-[500px] space-y-3">
              {columnClients.map(client => (
                <div
                  key={client.id}
                  draggable
                  onDragStart={e => handleDragStart(e, client)}
                  onDragEnd={handleDragEnd}
                  className="group"
                >
                  <ClientCard
                    client={client}
                    onClick={() => onClientClick(client)}
                    isDragging={draggedClient?.id === client.id}
                  />
                </div>
              ))}

              {columnClients.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <p className="text-sm">Nenhum cliente</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
