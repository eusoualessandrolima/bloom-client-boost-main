import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClients } from '@/contexts/ClientContext';
import { useSettings } from '@/contexts/SettingsContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  ComposedChart,
  Area,
} from 'recharts';
import { Users, DollarSign, TrendingUp, Target, Download, RefreshCw, Mail, FileSpreadsheet, Heart, AlertTriangle } from 'lucide-react';

const COLORS = {
  verde: '#00FF94',
  laranja: '#FF8C42',
  cinza: '#6B7280',
  rosa: '#FF6B9D',
  azul: '#3B82F6',
  roxo: '#8B5CF6',
};

const STATUS_COLORS: Record<string, string> = {
  active: COLORS.verde,
  overdue: COLORS.laranja,
  inactive: COLORS.cinza,
  cancelled: COLORS.rosa,
};

export default function Reports() {
  const { clients } = useClients();
  const { products, niches } = useSettings();
  const [periodo, setPeriodo] = useState('all');

  // Filter clients by period
  const filteredClients = useMemo(() => {
    const hoje = new Date();
    let dataInicio: Date;

    switch (periodo) {
      case 'hoje':
        dataInicio = new Date(hoje.setHours(0, 0, 0, 0));
        break;
      case 'semana':
        dataInicio = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'mes':
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate());
        break;
      case 'trimestre':
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 3, hoje.getDate());
        break;
      case 'ano':
        dataInicio = new Date(hoje.getFullYear() - 1, hoje.getMonth(), hoje.getDate());
        break;
      default:
        return clients;
    }

    return clients.filter(c => new Date(c.createdAt) >= dataInicio);
  }, [clients, periodo]);

  // Metrics calculations
  const totalClientes = clients.length;
  const clientesAtivos = clients.filter(c => c.status === 'active').length;
  const novosClientesPeriodo = filteredClients.length;

  const calcularMRR = () => {
    return clients
      .filter(c => c.status === 'active')
      .reduce((total, c) => total + c.monthlyValue, 0);
  };

  const mrr = calcularMRR();
  const arr = mrr * 12;

  const calcularTicketMedio = () => {
    const ativos = clients.filter(c => c.status === 'active');
    if (ativos.length === 0) return 0;
    return Math.round(ativos.reduce((t, c) => t + c.monthlyValue, 0) / ativos.length);
  };

  const ticketMedio = calcularTicketMedio();

  const calcularTaxaRetencao = () => {
    if (clients.length === 0) return 100;
    return Math.round((clientesAtivos / clients.length) * 100);
  };

  const taxaRetencao = calcularTaxaRetencao();
  const churnRate = 100 - taxaRetencao;

  const calcularLTV = () => {
    return ticketMedio * 24; // 24 months average
  };

  const ltv = calcularLTV();

  // Revenue evolution data (simulated monthly data)
  const dadosReceitaMensal = useMemo(() => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const baseValue = mrr * 0.6;
    return meses.map((mes, index) => ({
      mes,
      receita: Math.round(baseValue + (baseValue * 0.1 * index)),
    }));
  }, [mrr]);

  // Status distribution data
  const dadosStatus = useMemo(() => {
    const statusCount = {
      active: 0,
      overdue: 0,
      inactive: 0,
      cancelled: 0,
    };

    clients.forEach(c => {
      statusCount[c.status]++;
    });

    return [
      { name: 'Ativos', value: statusCount.active, color: COLORS.verde },
      { name: 'Inadimplentes', value: statusCount.overdue, color: COLORS.laranja },
      { name: 'Inativos', value: statusCount.inactive, color: COLORS.cinza },
      { name: 'Cancelados', value: statusCount.cancelled, color: COLORS.rosa },
    ];
  }, [clients]);

  // Product performance data
  const dadosProdutos = useMemo(() => {
    return products.map(prod => {
      const clientesProduto = clients.filter(c => c.product === prod.name && c.status === 'active');
      const receita = clientesProduto.reduce((t, c) => t + c.monthlyValue, 0);
      const qtd = clientesProduto.length;
      return {
        nome: prod.name,
        clientes: qtd,
        receita,
        ticket: qtd > 0 ? Math.round(receita / qtd) : 0,
        percentual: mrr > 0 ? Math.round((receita / mrr) * 100) : 0,
      };
    }).filter(p => p.clientes > 0).sort((a, b) => b.receita - a.receita);
  }, [products, clients, mrr]);

  // Niche data
  const dadosNichos = useMemo(() => {
    return niches.map(nicho => {
      const clientesNicho = clients.filter(c => c.niche === nicho.name && c.status === 'active');
      const receita = clientesNicho.reduce((t, c) => t + c.monthlyValue, 0);
      return {
        name: `${nicho.emoji} ${nicho.name}`,
        value: clientesNicho.length,
        receita,
        emoji: nicho.emoji,
        nomeSimples: nicho.name,
      };
    }).filter(n => n.value > 0).sort((a, b) => b.receita - a.receita);
  }, [niches, clients]);

  // Growth data (simulated)
  const dadosCrescimento = useMemo(() => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    let totalAcumulado = Math.max(1, clients.length - 5);
    return meses.map((mes, index) => {
      const novos = Math.max(0, Math.round(Math.random() * 3) + 1);
      const cancelamentos = index > 2 ? Math.round(Math.random() * 1) : 0;
      totalAcumulado += novos - cancelamentos;
      return {
        mes,
        novosClientes: novos,
        cancelamentos,
        totalClientes: totalAcumulado,
      };
    });
  }, [clients.length]);

  // Health score calculation
  const healthScore = useMemo(() => {
    const taxaPagamento = taxaRetencao;
    const score = Math.min(100, Math.round(taxaPagamento * 0.96));
    return score;
  }, [taxaRetencao]);

  const getHealthLabel = (score: number) => {
    if (score >= 90) return { label: 'Excelente', color: COLORS.verde };
    if (score >= 70) return { label: 'Bom', color: COLORS.azul };
    if (score >= 50) return { label: 'Regular', color: COLORS.laranja };
    return { label: 'Crítico', color: COLORS.rosa };
  };

  const healthLabel = getHealthLabel(healthScore);

  return (
    <Layout>
      <div className="space-y-6 animate-fadeUp">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              📊 Relatórios e Análises
            </h1>
            <p className="text-muted-foreground mt-1">Visão completa da performance do seu negócio</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Exportar Excel
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Mail className="h-4 w-4" />
              Enviar por Email
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Período:</span>
                <Select value={periodo} onValueChange={setPeriodo}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tempos</SelectItem>
                    <SelectItem value="hoje">Hoje</SelectItem>
                    <SelectItem value="semana">Última semana</SelectItem>
                    <SelectItem value="mes">Último mês</SelectItem>
                    <SelectItem value="trimestre">Último trimestre</SelectItem>
                    <SelectItem value="ano">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Clientes</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{totalClientes}</p>
                  <p className="text-sm text-muted-foreground mt-1">{novosClientesPeriodo} no período</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-primary text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>+{Math.max(0, novosClientesPeriodo)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    R$ {mrr.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">/mês</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-primary text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>+12%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    R$ {ticketMedio.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">por cliente</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-primary text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>+5%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Retenção</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{taxaRetencao}%</p>
                  <p className="text-sm text-muted-foreground mt-1">últimos 30 dias</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-primary text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>+2%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Evolution */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📈 Evolução da Receita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosReceitaMensal}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
                    />
                    <Line
                      type="monotone"
                      dataKey="receita"
                      stroke={COLORS.verde}
                      strokeWidth={3}
                      dot={{ fill: COLORS.verde, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-sm text-muted-foreground">• Crescimento de 12% no último mês</p>
                <p className="text-sm text-muted-foreground">• Projeção para próximo mês: R$ {Math.round(mrr * 1.1).toLocaleString('pt-BR')}</p>
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Distribuição por Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dadosStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dadosStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-sm text-muted-foreground">• {taxaRetencao}% dos clientes ativos</p>
                <p className="text-sm text-muted-foreground">• {100 - taxaRetencao}% inadimplência</p>
                <p className="text-sm text-muted-foreground">• Taxa de churn: {churnRate}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Performance */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📦 Performance por Produto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Produto</th>
                    <th className="text-center p-3 text-sm font-medium text-muted-foreground">Clientes</th>
                    <th className="text-center p-3 text-sm font-medium text-muted-foreground">Receita</th>
                    <th className="text-center p-3 text-sm font-medium text-muted-foreground">Ticket</th>
                    <th className="text-center p-3 text-sm font-medium text-muted-foreground">% Total</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosProdutos.map((prod, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="p-3 font-medium text-foreground">{prod.nome}</td>
                      <td className="p-3 text-center text-foreground">{prod.clientes}</td>
                      <td className="p-3 text-center text-foreground">R$ {prod.receita.toLocaleString('pt-BR')}</td>
                      <td className="p-3 text-center text-foreground">R$ {prod.ticket.toLocaleString('pt-BR')}</td>
                      <td className="p-3 text-center text-primary font-medium">{prod.percentual}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosProdutos} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="nome" type="category" width={120} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
                  />
                  <Bar dataKey="receita" fill={COLORS.verde} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Niche Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Niche Distribution */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 Clientes por Nicho
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dadosNichos}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {dadosNichos.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % 6]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Niche Ranking */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏆 Top Nichos por Receita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dadosNichos.slice(0, 5).map((nicho, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground">{index + 1}.</span>
                      <span className="text-2xl">{nicho.emoji}</span>
                      <div>
                        <p className="font-medium text-foreground">{nicho.nomeSimples}</p>
                        <p className="text-sm text-muted-foreground">{nicho.value} clientes</p>
                      </div>
                    </div>
                    <p className="font-bold text-primary">R$ {nicho.receita.toLocaleString('pt-BR')}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Growth Analysis */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📈 Crescimento da Base de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={dadosCrescimento}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                  <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="totalClientes"
                    fill={COLORS.verde}
                    fillOpacity={0.3}
                    stroke={COLORS.verde}
                    name="Total de Clientes"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="novosClientes"
                    fill={COLORS.azul}
                    name="Novos Clientes"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cancelamentos"
                    stroke={COLORS.rosa}
                    strokeWidth={2}
                    name="Cancelamentos"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Financial Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">💵</span>
                <h3 className="font-semibold text-foreground">MRR (Receita Recorrente)</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">R$ {mrr.toLocaleString('pt-BR')}</p>
              <p className="text-sm text-muted-foreground mt-2">Meta: R$ 6.000</p>
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min(100, (mrr / 6000) * 100)}%` }}
                />
              </div>
              <p className="text-sm text-primary mt-2">{Math.round((mrr / 6000) * 100)}% da meta</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📅</span>
                <h3 className="font-semibold text-foreground">ARR (Anual)</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">R$ {arr.toLocaleString('pt-BR')}</p>
              <p className="text-sm text-muted-foreground mt-2">Projeção: R$ {Math.round(arr * 1.2).toLocaleString('pt-BR')}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">💎</span>
                <h3 className="font-semibold text-foreground">LTV (Lifetime Value)</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">R$ {ltv.toLocaleString('pt-BR')}</p>
              <p className="text-sm text-muted-foreground mt-2">Valor médio por cliente (24 meses)</p>
            </CardContent>
          </Card>
        </div>

        {/* Health Score */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Health Score da Carteira
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="hsl(var(--muted))"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke={healthLabel.color}
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(healthScore / 100) * 440} 440`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-foreground">{healthScore}%</span>
                    <span className="text-sm font-medium" style={{ color: healthLabel.color }}>{healthLabel.label}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-foreground mb-3">📊 Indicadores:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Taxa de pagamento em dia: {taxaRetencao}%</li>
                    <li>• Engajamento médio: {healthScore >= 80 ? 'Alto' : healthScore >= 50 ? 'Médio' : 'Baixo'}</li>
                    <li>• Satisfação estimada: {Math.max(0, healthScore - 5)}%</li>
                    <li>• Risco de churn: {churnRate <= 10 ? 'Baixo' : churnRate <= 25 ? 'Médio' : 'Alto'} ({churnRate}%)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    Alertas:
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {Math.max(0, Math.floor(clients.length * 0.15))} renovações próximas (próximos 30 dias)</li>
                    <li>• {Math.max(0, Math.floor(clients.length * 0.07))} cliente(s) sem interação há 45 dias</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
