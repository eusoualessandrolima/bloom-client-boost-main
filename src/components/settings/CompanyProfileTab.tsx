import { useState } from 'react';
import { Loader2, Building2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSettings } from '@/contexts/SettingsContext';
import { toast } from 'sonner';

export function CompanyProfileTab() {
  const { companyInfo, updateCompanyInfo } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(companyInfo.name);
  const [cnpj, setCnpj] = useState(companyInfo.cnpj);
  const [email, setEmail] = useState(companyInfo.email);
  const [phone, setPhone] = useState(companyInfo.phone);
  const [address, setAddress] = useState(companyInfo.address);

  const formatCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Nome da empresa é obrigatório');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Email corporativo válido é obrigatório');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    updateCompanyInfo({
      name: name.trim(),
      cnpj: cnpj.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });

    toast.success('Informações da empresa atualizadas com sucesso!');
    setIsLoading(false);
  };

  const handleCancel = () => {
    setName(companyInfo.name);
    setCnpj(companyInfo.cnpj);
    setEmail(companyInfo.email);
    setPhone(companyInfo.phone);
    setAddress(companyInfo.address);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg font-semibold">Informações da Empresa</CardTitle>
        </div>
        <CardDescription>Configure os dados da sua empresa</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa *</Label>
              <Input
                id="companyName"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Minha Empresa Ltda"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={cnpj}
                onChange={e => setCnpj(formatCnpj(e.target.value))}
                placeholder="00.000.000/0000-00"
                maxLength={18}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Corporativo *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="contato@empresa.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço Completo</Label>
            <Textarea
              id="address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Rua, número, bairro, cidade, estado, CEP"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Logo da Empresa</Label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                {companyInfo.logo ? (
                  <img src={companyInfo.logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <Building2 className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <Button type="button" variant="outline" disabled>
                <Upload className="w-4 h-4 mr-2" />
                Upload de Imagem
              </Button>
              <span className="text-xs text-muted-foreground">
                (Em breve)
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
