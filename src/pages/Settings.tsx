import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductsTab } from '@/components/settings/ProductsTab';
import { NichesTab } from '@/components/settings/NichesTab';
import { PaymentMethodsTab } from '@/components/settings/PaymentMethodsTab';
import { CompanyProfileTab } from '@/components/settings/CompanyProfileTab';
import { IntegrationsTab } from '@/components/settings/IntegrationsTab';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <Layout>
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <SettingsIcon className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border p-1 flex flex-wrap h-auto gap-1">
            <TabsTrigger 
              value="products" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Produtos e Serviços
            </TabsTrigger>
            <TabsTrigger 
              value="niches"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Nichos e Segmentos
            </TabsTrigger>
            <TabsTrigger 
              value="payment"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Formas de Pagamento
            </TabsTrigger>
            <TabsTrigger 
              value="company"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Perfil da Empresa
            </TabsTrigger>
            <TabsTrigger 
              value="integrations"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Integrações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>

          <TabsContent value="niches">
            <NichesTab />
          </TabsContent>

          <TabsContent value="payment">
            <PaymentMethodsTab />
          </TabsContent>

          <TabsContent value="company">
            <CompanyProfileTab />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationsTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
