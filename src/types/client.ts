export type ClientStatus = 'active' | 'overdue' | 'inactive' | 'cancelled';

export type PaymentMethod = 'pix' | 'credit_card' | 'boleto' | 'transfer';

export interface Client {
  id: string;
  companyName: string;
  responsibleName: string;
  responsiblePhone: string;
  responsibleEmail?: string;
  responsibleRole?: string;
  email: string;
  document: string; // CPF or CNPJ
  niche: string;
  connections: number;
  product: string;
  monthlyValue: number;
  paymentMethod: PaymentMethod;
  dueDate: number; // Day of month
  notes: string;
  status: ClientStatus;
  createdAt: Date;
  tags?: string[];
  companyPhone?: string;
}

export interface MetricCard {
  label: string;
  value: number;
  status: ClientStatus;
  percentage: number;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}
