import { cn } from '@/lib/utils';
import { ClientStatus } from '@/types/client';

interface StatusBadgeProps {
  status: ClientStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<ClientStatus, { label: string; className: string }> = {
  active: { label: 'Ativo', className: 'badge-active' },
  overdue: { label: 'Inadimplente', className: 'badge-overdue' },
  inactive: { label: 'Inativo', className: 'badge-inactive' },
  cancelled: { label: 'Cancelado', className: 'badge-cancelled' },
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={cn('rounded-full inline-flex items-center', config.className, sizeStyles[size])}>
      {config.label}
    </span>
  );
}
