import { useState } from 'react';
import { Plug, Settings, XCircle, Plus, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSettings, Integration } from '@/contexts/SettingsContext';
import { toast } from 'sonner';

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: string;
  integration: Integration;
  onConnect: () => void;
  onConfigure: () => void;
  onDisconnect: () => void;
}

function IntegrationCard({ name, description, icon, integration, onConnect, onConfigure, onDisconnect }: IntegrationCardProps) {
  return (
    <Card className="bg-background border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <h3 className="font-semibold text-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {integration.connected ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Conectado</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Não conectado</span>
              </>
            )}
          </div>
          
          <div className="flex gap-2">
            {integration.connected ? (
              <>
                <Button variant="outline" size="sm" onClick={onConfigure}>
                  <Settings className="w-4 h-4 mr-1" />
                  Configurar
                </Button>
                <Button variant="outline" size="sm" onClick={onDisconnect} className="text-destructive hover:text-destructive">
                  <XCircle className="w-4 h-4 mr-1" />
                  Desconectar
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={onConnect} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-1" />
                Conectar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function IntegrationsTab() {
  const { integrations, updateIntegration } = useSettings();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIntegration, setCurrentIntegration] = useState<keyof typeof integrations | null>(null);
  const [apiUrl, setApiUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [instance, setInstance] = useState('');

  const integrationConfigs = [
    { key: 'n8n' as const, name: 'n8n', description: 'Automação de workflows', icon: '🔌', fields: ['apiUrl', 'apiKey'] },
    { key: 'make' as const, name: 'Make (Integromat)', description: 'Automação avançada', icon: '🔌', fields: ['webhookUrl'] },
    { key: 'zapier' as const, name: 'Zapier', description: 'Conecte milhares de apps', icon: '🔌', fields: ['webhookUrl'] },
    { key: 'evolutionApi' as const, name: 'WhatsApp (Evolution API)', description: 'Envie mensagens automaticamente', icon: '💬', fields: ['apiUrl', 'apiKey', 'instance'] },
  ];

  const handleConnect = (key: keyof typeof integrations) => {
    const config = integrationConfigs.find(c => c.key === key);
    const integration = integrations[key];
    
    setCurrentIntegration(key);
    setApiUrl(integration.apiUrl || '');
    setApiKey(integration.apiKey || '');
    setWebhookUrl(integration.webhookUrl || '');
    setInstance(integration.instance || '');
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!currentIntegration) return;

    const config = integrationConfigs.find(c => c.key === currentIntegration);
    
    if (config?.fields.includes('apiUrl') && !apiUrl.trim()) {
      toast.error('URL da API é obrigatória');
      return;
    }
    if (config?.fields.includes('webhookUrl') && !webhookUrl.trim()) {
      toast.error('URL do Webhook é obrigatória');
      return;
    }

    updateIntegration(currentIntegration, {
      connected: true,
      apiUrl: apiUrl.trim(),
      apiKey: apiKey.trim(),
      webhookUrl: webhookUrl.trim(),
      instance: instance.trim(),
    });

    toast.success('Integração conectada com sucesso!');
    setModalOpen(false);
    resetForm();
  };

  const handleDisconnect = (key: keyof typeof integrations) => {
    updateIntegration(key, {
      connected: false,
      apiUrl: '',
      apiKey: '',
      webhookUrl: '',
      instance: '',
    });
    toast.success('Integração desconectada');
  };

  const resetForm = () => {
    setApiUrl('');
    setApiKey('');
    setWebhookUrl('');
    setInstance('');
    setCurrentIntegration(null);
  };

  const currentConfig = currentIntegration ? integrationConfigs.find(c => c.key === currentIntegration) : null;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Plug className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg font-semibold">Integrações</CardTitle>
        </div>
        <CardDescription>Conecte ferramentas externas ao seu CRM</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrationConfigs.map(config => (
            <IntegrationCard
              key={config.key}
              name={config.name}
              description={config.description}
              icon={config.icon}
              integration={integrations[config.key]}
              onConnect={() => handleConnect(config.key)}
              onConfigure={() => handleConnect(config.key)}
              onDisconnect={() => handleDisconnect(config.key)}
            />
          ))}
        </div>
      </CardContent>

      <Dialog open={modalOpen} onOpenChange={(open) => {
        if (!open) resetForm();
        setModalOpen(open);
      }}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plug className="w-5 h-5 text-primary" />
              Conectar {currentConfig?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {currentConfig?.fields.includes('apiUrl') && (
              <div className="space-y-2">
                <Label htmlFor="apiUrl">URL da API *</Label>
                <Input
                  id="apiUrl"
                  value={apiUrl}
                  onChange={e => setApiUrl(e.target.value)}
                  placeholder="https://sua-api.com"
                />
              </div>
            )}

            {currentConfig?.fields.includes('apiKey') && (
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="Sua chave de API"
                />
              </div>
            )}

            {currentConfig?.fields.includes('webhookUrl') && (
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">URL do Webhook *</Label>
                <Input
                  id="webhookUrl"
                  value={webhookUrl}
                  onChange={e => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.zapier.com/..."
                />
              </div>
            )}

            {currentConfig?.fields.includes('instance') && (
              <div className="space-y-2">
                <Label htmlFor="instance">Nome da Instância</Label>
                <Input
                  id="instance"
                  value={instance}
                  onChange={e => setInstance(e.target.value)}
                  placeholder="minha-instancia"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                Salvar e Conectar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
