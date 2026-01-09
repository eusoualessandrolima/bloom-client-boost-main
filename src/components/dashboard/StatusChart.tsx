import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useClients } from '@/contexts/ClientContext';

const COLORS = {
  active: '#00FF94',
  overdue: '#FF8C42',
  inactive: '#6B7280',
  cancelled: '#FF6B9D',
};

const LABELS = {
  active: 'Ativos',
  overdue: 'Inadimplentes',
  inactive: 'Inativos',
  cancelled: 'Cancelados',
};

export function StatusChart() {
  const { getStatusCounts } = useClients();
  const counts = getStatusCounts();

  const data = Object.entries(counts)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: LABELS[key as keyof typeof LABELS],
      value,
      color: COLORS[key as keyof typeof COLORS],
    }));

  return (
    <div className="card-metric h-full">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Distribuição de Status</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1f2e',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-card-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
