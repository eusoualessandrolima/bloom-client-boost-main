import { cn } from '@/lib/utils';
import { ClientStatus } from '@/types/client';
import { Filter, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MetricCardProps {
  label: string;
  value: number;
  status: ClientStatus;
  percentage: number;
  onClick?: () => void;
}

const statusStyles: Record<ClientStatus, { bg: string; text: string; accent: string }> = {
  active: {
    bg: 'bg-status-active/10',
    text: 'text-status-active',
    accent: 'border-status-active',
  },
  overdue: {
    bg: 'bg-status-overdue/10',
    text: 'text-status-overdue',
    accent: 'border-status-overdue',
  },
  inactive: {
    bg: 'bg-status-inactive/10',
    text: 'text-status-inactive',
    accent: 'border-status-inactive',
  },
  cancelled: {
    bg: 'bg-status-cancelled/10',
    text: 'text-status-cancelled',
    accent: 'border-status-cancelled',
  },
};

export function MetricCard({ label, value, status, percentage, onClick }: MetricCardProps) {
  const styles = statusStyles[status];

  return (
    <div
      onClick={onClick}
      className={cn(
        'card-metric cursor-pointer group border-l-4',
        styles.accent
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('px-3 py-1 rounded-full text-xs font-semibold', styles.bg, styles.text)}>
          {label}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Filter className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <span className="text-4xl font-bold text-card-foreground">{value}</span>
        <span className={cn('text-sm font-medium', styles.text)}>{percentage}%</span>
      </div>
    </div>
  );
}
