import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function InsightCard({ icon: Icon, label, value, subtext, trend, trendValue }: InsightCardProps) {
  return (
    <div className="card-metric">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
          {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
        </div>

        {trend && trendValue && (
          <span
            className={cn(
              'text-sm font-medium',
              trend === 'up' && 'text-status-active',
              trend === 'down' && 'text-status-cancelled',
              trend === 'neutral' && 'text-muted-foreground'
            )}
          >
            {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}
