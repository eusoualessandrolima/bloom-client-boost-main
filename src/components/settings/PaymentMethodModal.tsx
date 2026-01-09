import { useState, useEffect } from 'react';
import { Loader2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSettings, PaymentMethodSetting } from '@/contexts/SettingsContext';
import { toast } from 'sonner';

interface PaymentMethodModalProps {
  open: boolean;
  onClose: () => void;
  editMethod?: PaymentMethodSetting | null;
}

const ICON_OPTIONS = ['💚', '💳', '📄', '🏦', '💵', '💰', '🪙', '💎', '📱', '🔄'];

export function PaymentMethodModal({ open, onClose, editMethod }: PaymentMethodModalProps) {
  const { addPaymentMethod, updatePaymentMethod, paymentMethods } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💳');
  const [observation, setObservation] = useState('');
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (editMethod) {
      setName(editMethod.name);
      setIcon(editMethod.icon);
      setObservation(editMethod.observation);
      setActive(editMethod.active);
    } else {
      resetForm();
    }
  }, [editMethod, open]);

  const resetForm = () => {
    setName('');
    setIcon('💳');
    setObservation('');
    setActive(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      toast.error('Nome deve ter pelo menos 2 caracteres');
      return;
    }

    const duplicateName = paymentMethods.find(
      m => m.name.toLowerCase() === name.trim().toLowerCase() && m.id !== editMethod?.id
    );
    if (duplicateName) {
      toast.error('Já existe uma forma de pagamento com este nome');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    if (editMethod) {
      updatePaymentMethod(editMethod.id, {
        name: name.trim(),
        icon,
        observation: observation.trim(),
        active,
      });
      toast.success('Forma de pagamento atualizada com sucesso!');
    } else {
      addPaymentMethod({
        name: name.trim(),
        icon,
        observation: observation.trim(),
        active,
      });
      toast.success('Forma de pagamento salva com sucesso!');
    }

    setIsLoading(false);
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            {editMethod ? 'Editar Forma de Pagamento' : 'Adicionar Forma de Pagamento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Débito"
            />
          </div>

          <div className="space-y-2">
            <Label>Ícone</Label>
            <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
              {ICON_OPTIONS.map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`text-2xl p-2 rounded-lg transition-colors ${
                    icon === i ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-muted-foreground/10'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observation">Taxa/Observação (opcional)</Label>
            <Input
              id="observation"
              value={observation}
              onChange={e => setObservation(e.target.value)}
              placeholder="Ex: Taxa de 2,5%"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={active}
              onCheckedChange={(checked) => setActive(checked as boolean)}
            />
            <Label htmlFor="active" className="text-sm font-normal cursor-pointer">
              Forma de pagamento ativa
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
