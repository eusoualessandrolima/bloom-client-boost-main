import { Client } from '@/types/client';
import { StatusBadge } from './StatusBadge';
import { MessageSquare, Edit2, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClientCardProps {
  client: Client;
  onClick: () => void;
  isDragging?: boolean;
}

export function ClientCard({ client, onClick, isDragging }: ClientCardProps) {
  const statusBorderColors = {
    active: 'hover:border-status-active',
    overdue: 'hover:border-status-overdue',
    inactive: 'hover:border-status-inactive',
    cancelled: 'hover:border-status-cancelled',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card rounded-xl p-4 cursor-pointer transition-all duration-200 border border-transparent',
        'hover:shadow-lg hover:-translate-y-0.5',
        statusBorderColors[client.status],
        isDragging && 'shadow-2xl scale-105 rotate-2'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-card-foreground text-sm truncate flex-1 mr-2">
          {client.companyName}
        </h4>
        <StatusBadge status={client.status} size="sm" />
      </div>

      <p className="text-xl font-bold text-card-foreground mb-3">
        R$ {client.monthlyValue.toLocaleString('pt-BR')}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Wifi className="w-3.5 h-3.5" />
            <span className="text-xs">{client.connections}</span>
          </div>
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
            {client.product}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 hover:bg-muted rounded-md transition-colors">
            <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted rounded-md transition-colors">
            <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
