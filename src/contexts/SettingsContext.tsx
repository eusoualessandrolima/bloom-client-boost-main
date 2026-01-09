import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  defaultValue: number;
  description: string;
  active: boolean;
  clientsUsing: number;
  createdAt: Date;
}

export interface Niche {
  id: string;
  name: string;
  emoji: string;
  color: string;
  active: boolean;
  clientsUsing: number;
}

export interface PaymentMethodSetting {
  id: string;
  name: string;
  icon: string;
  observation: string;
  active: boolean;
  clientsUsing: number;
}

export interface CompanyInfo {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
}

export interface Integration {
  connected: boolean;
  apiUrl?: string;
  apiKey?: string;
  webhookUrl?: string;
  instance?: string;
}

export interface Integrations {
  n8n: Integration;
  make: Integration;
  zapier: Integration;
  evolutionApi: Integration;
}

interface SettingsContextType {
  products: Product[];
  niches: Niche[];
  paymentMethods: PaymentMethodSetting[];
  companyInfo: CompanyInfo;
  integrations: Integrations;
  addProduct: (product: Omit<Product, 'id' | 'clientsUsing' | 'createdAt'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => boolean;
  addNiche: (niche: Omit<Niche, 'id' | 'clientsUsing'>) => void;
  updateNiche: (id: string, data: Partial<Niche>) => void;
  deleteNiche: (id: string) => boolean;
  addPaymentMethod: (method: Omit<PaymentMethodSetting, 'id' | 'clientsUsing'>) => void;
  updatePaymentMethod: (id: string, data: Partial<PaymentMethodSetting>) => void;
  deletePaymentMethod: (id: string) => boolean;
  updateCompanyInfo: (data: Partial<CompanyInfo>) => void;
  updateIntegration: (key: keyof Integrations, data: Partial<Integration>) => void;
  updateClientCounts: (clients: { product: string; niche: string; paymentMethod: string }[]) => void;
  getActiveProducts: () => Product[];
  getActiveNiches: () => Niche[];
  getActivePaymentMethods: () => PaymentMethodSetting[];
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'crm_settings';

const defaultProducts: Product[] = [
  { id: '1', name: 'Plano Starter', defaultValue: 197, description: 'Plano básico ideal para pequenos negócios começando com automação', active: true, clientsUsing: 0, createdAt: new Date() },
  { id: '2', name: 'Plano PRO', defaultValue: 397, description: 'Plano completo com recursos avançados de IA e automação', active: true, clientsUsing: 0, createdAt: new Date() },
  { id: '3', name: 'CompanyChat', defaultValue: 297, description: 'Solução de chat inteligente com IA para atendimento ao cliente', active: true, clientsUsing: 0, createdAt: new Date() },
  { id: '4', name: 'Personalizado', defaultValue: 0, description: 'Plano customizado de acordo com as necessidades específicas do cliente', active: true, clientsUsing: 0, createdAt: new Date() },
];

const defaultNiches: Niche[] = [
  { id: '1', name: 'Advocacia', emoji: '⚖️', color: '#00FF94', active: true, clientsUsing: 0 },
  { id: '2', name: 'Academia', emoji: '💪', color: '#00FF94', active: true, clientsUsing: 0 },
  { id: '3', name: 'Escola', emoji: '📚', color: '#00FF94', active: true, clientsUsing: 0 },
  { id: '4', name: 'Marketing', emoji: '📱', color: '#00FF94', active: true, clientsUsing: 0 },
  { id: '5', name: 'Saúde', emoji: '❤️', color: '#00FF94', active: true, clientsUsing: 0 },
  { id: '6', name: 'Varejo', emoji: '🛒', color: '#00FF94', active: true, clientsUsing: 0 },
  { id: '7', name: 'Serviços', emoji: '🔧', color: '#00FF94', active: true, clientsUsing: 0 },
  { id: '8', name: 'Tecnologia', emoji: '💻', color: '#00FF94', active: true, clientsUsing: 0 },
  { id: '9', name: 'Alimentação', emoji: '🍔', color: '#00FF94', active: true, clientsUsing: 0 },
  { id: '10', name: 'Outro', emoji: '📋', color: '#00FF94', active: true, clientsUsing: 0 },
];

const defaultPaymentMethods: PaymentMethodSetting[] = [
  { id: '1', name: 'PIX', icon: '💚', observation: '', active: true, clientsUsing: 0 },
  { id: '2', name: 'Cartão de Crédito', icon: '💳', observation: '', active: true, clientsUsing: 0 },
  { id: '3', name: 'Boleto', icon: '📄', observation: '', active: true, clientsUsing: 0 },
  { id: '4', name: 'Transferência', icon: '🏦', observation: '', active: true, clientsUsing: 0 },
  { id: '5', name: 'Dinheiro', icon: '💵', observation: '', active: false, clientsUsing: 0 },
];

const defaultCompanyInfo: CompanyInfo = {
  name: 'CompanyChat IA',
  cnpj: '',
  email: 'contato@companychat.com.br',
  phone: '',
  address: '',
  logo: '',
};

const defaultIntegrations: Integrations = {
  n8n: { connected: false },
  make: { connected: false },
  zapier: { connected: false },
  evolutionApi: { connected: false },
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.products?.map((p: Product) => ({
          ...p,
          createdAt: new Date(p.createdAt),
        })) || defaultProducts;
      } catch {
        return defaultProducts;
      }
    }
    return defaultProducts;
  });

  const [niches, setNiches] = useState<Niche[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.niches || defaultNiches;
      } catch {
        return defaultNiches;
      }
    }
    return defaultNiches;
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodSetting[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.paymentMethods || defaultPaymentMethods;
      } catch {
        return defaultPaymentMethods;
      }
    }
    return defaultPaymentMethods;
  });

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.companyInfo || defaultCompanyInfo;
      } catch {
        return defaultCompanyInfo;
      }
    }
    return defaultCompanyInfo;
  });

  const [integrations, setIntegrations] = useState<Integrations>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.integrations || defaultIntegrations;
      } catch {
        return defaultIntegrations;
      }
    }
    return defaultIntegrations;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      products,
      niches,
      paymentMethods,
      companyInfo,
      integrations,
    }));
  }, [products, niches, paymentMethods, companyInfo, integrations]);

  const addProduct = (productData: Omit<Product, 'id' | 'clientsUsing' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: crypto.randomUUID(),
      clientsUsing: 0,
      createdAt: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deleteProduct = (id: string): boolean => {
    const product = products.find(p => p.id === id);
    if (product && product.clientsUsing > 0) return false;
    setProducts(prev => prev.filter(p => p.id !== id));
    return true;
  };

  const addNiche = (nicheData: Omit<Niche, 'id' | 'clientsUsing'>) => {
    const newNiche: Niche = {
      ...nicheData,
      id: crypto.randomUUID(),
      clientsUsing: 0,
    };
    setNiches(prev => [...prev, newNiche]);
  };

  const updateNiche = (id: string, data: Partial<Niche>) => {
    setNiches(prev => prev.map(n => n.id === id ? { ...n, ...data } : n));
  };

  const deleteNiche = (id: string): boolean => {
    const niche = niches.find(n => n.id === id);
    if (niche && niche.clientsUsing > 0) return false;
    setNiches(prev => prev.filter(n => n.id !== id));
    return true;
  };

  const addPaymentMethod = (methodData: Omit<PaymentMethodSetting, 'id' | 'clientsUsing'>) => {
    const newMethod: PaymentMethodSetting = {
      ...methodData,
      id: crypto.randomUUID(),
      clientsUsing: 0,
    };
    setPaymentMethods(prev => [...prev, newMethod]);
  };

  const updatePaymentMethod = (id: string, data: Partial<PaymentMethodSetting>) => {
    setPaymentMethods(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
  };

  const deletePaymentMethod = (id: string): boolean => {
    const method = paymentMethods.find(m => m.id === id);
    if (method && method.clientsUsing > 0) return false;
    setPaymentMethods(prev => prev.filter(m => m.id !== id));
    return true;
  };

  const updateCompanyInfo = (data: Partial<CompanyInfo>) => {
    setCompanyInfo(prev => ({ ...prev, ...data }));
  };

  const updateIntegration = (key: keyof Integrations, data: Partial<Integration>) => {
    setIntegrations(prev => ({
      ...prev,
      [key]: { ...prev[key], ...data },
    }));
  };

  const updateClientCounts = (clients: { product: string; niche: string; paymentMethod: string }[]) => {
    setProducts(prev => prev.map(p => ({
      ...p,
      clientsUsing: clients.filter(c => c.product === p.name).length,
    })));
    setNiches(prev => prev.map(n => ({
      ...n,
      clientsUsing: clients.filter(c => c.niche === n.name).length,
    })));
    setPaymentMethods(prev => prev.map(m => ({
      ...m,
      clientsUsing: clients.filter(c => c.paymentMethod === m.name).length,
    })));
  };

  const getActiveProducts = () => products.filter(p => p.active);
  const getActiveNiches = () => niches.filter(n => n.active);
  const getActivePaymentMethods = () => paymentMethods.filter(m => m.active);

  return (
    <SettingsContext.Provider
      value={{
        products,
        niches,
        paymentMethods,
        companyInfo,
        integrations,
        addProduct,
        updateProduct,
        deleteProduct,
        addNiche,
        updateNiche,
        deleteNiche,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        updateCompanyInfo,
        updateIntegration,
        updateClientCounts,
        getActiveProducts,
        getActiveNiches,
        getActivePaymentMethods,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
