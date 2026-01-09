import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useClients } from '@/contexts/ClientContext';
import { useSettings } from '@/contexts/SettingsContext';
import { Client, ClientStatus, PaymentMethod } from '@/types/client';
import { toast } from 'sonner';

interface NewClientModalProps {
  open: boolean;
  onClose: () => void;
  editClient?: Client | null;
}

export function NewClientModal({ open, onClose, editClient }: NewClientModalProps) {
  const { addClient, updateClient } = useClients();
  const { getActiveProducts, getActiveNiches, getActivePaymentMethods } = useSettings();
  const [isLoading, setIsLoading] = useState(false);

  const activeProducts = getActiveProducts();
  const activeNiches = getActiveNiches();
  const activePaymentMethods = getActivePaymentMethods();

  // Form state
  const [companyName, setCompanyName] = useState('');
  const [document, setDocument] = useState('');
  const [niche, setNiche] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [email, setEmail] = useState('');
  const [responsibleName, setResponsibleName] = useState('');
  const [responsibleRole, setResponsibleRole] = useState('');
  const [responsiblePhone, setResponsiblePhone] = useState('');
  const [responsibleEmail, setResponsibleEmail] = useState('');
  const [product, setProduct] = useState('');
  const [monthlyValue, setMonthlyValue] = useState('');
  const [connections, setConnections] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<ClientStatus>('active');
  const [notes, setNotes] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (editClient) {
      setCompanyName(editClient.companyName || '');
      setDocument(editClient.document || '');
      setNiche(editClient.niche || '');
      setCompanyPhone(editClient.companyPhone || '');
      setEmail(editClient.email || '');
      setResponsibleName(editClient.responsibleName || '');
      setResponsibleRole(editClient.responsibleRole || '');
      setResponsiblePhone(editClient.responsiblePhone || '');
      setResponsibleEmail(editClient.responsibleEmail || '');
      setProduct(editClient.product || '');
      setMonthlyValue(editClient.monthlyValue?.toString() || '');
      setConnections(editClient.connections?.toString() || '1');
      setPaymentMethod(editClient.paymentMethod || 'pix');
      setDueDate(editClient.dueDate?.toString() || '');
      setStatus(editClient.status || 'active');
      setNotes(editClient.notes || '');
    } else {
      resetForm();
    }
  }, [editClient, open]);

  const resetForm = () => {
    setCompanyName('');
    setDocument('');
    setNiche('');
    setCompanyPhone('');
    setEmail('');
    setResponsibleName('');
    setResponsibleRole('');
    setResponsiblePhone('');
    setResponsibleEmail('');
    setProduct('');
    setMonthlyValue('');
    setConnections('1');
    setPaymentMethod('pix');
    setDueDate('');
    setStatus('active');
    setNotes('');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatDocument = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const validateEmail = (email: string) => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateDocument = (doc: string) => {
    if (!doc) return true;
    const numbers = doc.replace(/\D/g, '');
    return numbers.length === 11 || numbers.length === 14;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!companyName.trim()) {
      toast.error('Nome da empresa é obrigatório');
      return;
    }
    if (!niche) {
      toast.error('Nicho/Segmento é obrigatório');
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      toast.error('Email principal válido é obrigatório');
      return;
    }
    if (!responsibleName.trim()) {
      toast.error('Nome do responsável é obrigatório');
      return;
    }
    if (!responsiblePhone.trim()) {
      toast.error('Telefone do responsável é obrigatório');
      return;
    }
    if (!product) {
      toast.error('Produto contratado é obrigatório');
      return;
    }
    if (!monthlyValue || parseFloat(monthlyValue) <= 0) {
      toast.error('Valor mensal deve ser maior que zero');
      return;
    }
    if (!dueDate || parseInt(dueDate) < 1 || parseInt(dueDate) > 31) {
      toast.error('Dia de vencimento deve ser entre 1 e 31');
      return;
    }
    if (document && !validateDocument(document)) {
      toast.error('CPF ou CNPJ inválido');
      return;
    }
    if (responsibleEmail && !validateEmail(responsibleEmail)) {
      toast.error('Email do responsável inválido');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const clientData: Omit<Client, 'id' | 'createdAt'> = {
      companyName: companyName.trim(),
      document: document.trim(),
      niche,
      companyPhone: companyPhone.trim(),
      email: email.trim(),
      responsibleName: responsibleName.trim(),
      responsibleRole: responsibleRole.trim(),
      responsiblePhone: responsiblePhone.trim(),
      responsibleEmail: responsibleEmail.trim(),
      product,
      monthlyValue: parseFloat(monthlyValue),
      connections: parseInt(connections) || 1,
      paymentMethod,
      dueDate: parseInt(dueDate),
      status,
      notes: notes.trim(),
      tags: [],
    };

    if (editClient) {
      await updateClient(editClient.id, clientData);
    } else {
      await addClient(clientData);
    }

    setIsLoading(false);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editClient ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Company & Responsible Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 - Company Info */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                Informações da Empresa
              </h3>

              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa *</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Ex: Empresa XYZ Ltda"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="document">CPF ou CNPJ</Label>
                <Input
                  id="document"
                  value={document}
                  onChange={e => setDocument(formatDocument(e.target.value))}
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  maxLength={18}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="niche">Nicho/Segmento *</Label>
                <Select value={niche} onValueChange={setNiche}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nicho" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeNiches.map(n => (
                      <SelectItem key={n.id} value={n.name}>{n.emoji} {n.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyPhone">Telefone da Empresa</Label>
                <Input
                  id="companyPhone"
                  value={companyPhone}
                  onChange={e => setCompanyPhone(formatPhone(e.target.value))}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Principal *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="contato@empresa.com"
                />
              </div>
            </div>

            {/* Column 2 - Responsible Info */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                Informações do Responsável
              </h3>

              <div className="space-y-2">
                <Label htmlFor="responsibleName">Nome do Responsável *</Label>
                <Input
                  id="responsibleName"
                  value={responsibleName}
                  onChange={e => setResponsibleName(e.target.value)}
                  placeholder="Ex: João Silva"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibleRole">Cargo</Label>
                <Input
                  id="responsibleRole"
                  value={responsibleRole}
                  onChange={e => setResponsibleRole(e.target.value)}
                  placeholder="Ex: Diretor Comercial"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsiblePhone">Telefone do Responsável *</Label>
                <Input
                  id="responsiblePhone"
                  value={responsiblePhone}
                  onChange={e => setResponsiblePhone(formatPhone(e.target.value))}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibleEmail">Email do Responsável</Label>
                <Input
                  id="responsibleEmail"
                  type="email"
                  value={responsibleEmail}
                  onChange={e => setResponsibleEmail(e.target.value)}
                  placeholder="joao@empresa.com"
                />
              </div>
            </div>
          </div>

          {/* Commercial Info - Full Width */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
              Informações Comerciais
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product">Produto Contratado *</Label>
                <Select value={product} onValueChange={setProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeProducts.map(p => (
                      <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyValue">Valor Mensal (R$) *</Label>
                <Input
                  id="monthlyValue"
                  type="number"
                  value={monthlyValue}
                  onChange={e => setMonthlyValue(e.target.value)}
                  placeholder="0,00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="connections">Número de Conexões *</Label>
                <Input
                  id="connections"
                  type="number"
                  value={connections}
                  onChange={e => setConnections(e.target.value)}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activePaymentMethods.map(pm => (
                      <SelectItem key={pm.id} value={pm.name}>{pm.icon} {pm.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Dia de Vencimento *</Label>
                <Input
                  id="dueDate"
                  type="number"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  placeholder="1-31"
                  min="1"
                  max="31"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status Inicial *</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as ClientStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Anotações</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Observações importantes sobre o cliente..."
                rows={3}
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                editClient ? 'Atualizar Cliente' : 'Salvar Cliente'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
