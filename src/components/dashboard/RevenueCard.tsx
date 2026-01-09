import { useClients } from '@/contexts/ClientContext';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

// Mock trend data
const trendData = [
  { month: 'Jul', value: 3200 },
  { month: 'Ago', value: 3500 },
  { month: 'Set', value: 3800 },
  { month: 'Out', value: 4100 },
  { month: 'Nov', value: 4200 },
  { month: 'Dez', value: 4352 },
];

export function RevenueCard() {
  const { getTotalRevenue, clients } = useClients();
  const totalRevenue = getTotalRevenue();

  // Calculate product breakdown
  const productBreakdown = clients
    .filter(c => c.status === 'active')
    .reduce((acc, client) => {
      acc[client.product] = (acc[client.product] || 0) + client.monthlyValue;
      return acc;
    }, {} as Record<string, number>);

  const sortedProducts = Object.entries(productBreakdown).sort(([, a], [, b]) => b - a);

  return (
    <div className="card-metric h-full">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Receita Mensal</h3>
        <div className="flex items-center gap-1 text-status-active text-sm font-medium">
          <TrendingUp className="w-4 h-4" />
          <span>+12%</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-card-foreground">
            R$ {totalRevenue.toLocaleString('pt-BR')}
          </span>
          <span className="text-sm text-muted-foreground">/mês</span>
        </div>
      </div>

      {/* Mini chart */}
      <div className="h-20 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FF94" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00FF94" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1f2e',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00FF94"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Product breakdown */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Por Produto
        </p>
        {sortedProducts.map(([product, value]) => (
          <div key={product} className="flex items-center justify-between">
            <span className="text-sm text-card-foreground">{product}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-card-foreground">
                R$ {value.toLocaleString('pt-BR')}
              </span>
              <ArrowUpRight className="w-3 h-3 text-status-active" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
