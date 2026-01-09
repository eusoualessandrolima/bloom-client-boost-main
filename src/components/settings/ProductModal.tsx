import { useState, useEffect } from 'react';
import { Loader2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSettings, Product } from '@/contexts/SettingsContext';
import { toast } from 'sonner';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  editProduct?: Product | null;
}

export function ProductModal({ open, onClose, editProduct }: ProductModalProps) {
  const { addProduct, updateProduct, products } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [defaultValue, setDefaultValue] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (editProduct) {
      setName(editProduct.name);
      setDefaultValue(editProduct.defaultValue.toString());
      setDescription(editProduct.description);
      setActive(editProduct.active);
    } else {
      resetForm();
    }
  }, [editProduct, open]);

  const resetForm = () => {
    setName('');
    setDefaultValue('');
    setDescription('');
    setActive(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 3) {
      toast.error('Nome do produto deve ter pelo menos 3 caracteres');
      return;
    }

    const duplicateName = products.find(
      p => p.name.toLowerCase() === name.trim().toLowerCase() && p.id !== editProduct?.id
    );
    if (duplicateName) {
      toast.error('Já existe um produto com este nome');
      return;
    }

    if (parseFloat(defaultValue) < 0) {
      toast.error('Valor padrão não pode ser negativo');
      return;
    }

    if (description.length > 200) {
      toast.error('Descrição deve ter no máximo 200 caracteres');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    if (editProduct) {
      updateProduct(editProduct.id, {
        name: name.trim(),
        defaultValue: parseFloat(defaultValue) || 0,
        description: description.trim(),
        active,
      });
      toast.success('Produto atualizado com sucesso!');
    } else {
      addProduct({
        name: name.trim(),
        defaultValue: parseFloat(defaultValue) || 0,
        description: description.trim(),
        active,
      });
      toast.success('Produto salvo com sucesso!');
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
            <Package className="w-5 h-5 text-primary" />
            {editProduct ? 'Editar Produto' : 'Adicionar Produto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto *</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Plano Premium"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultValue">Valor Padrão (R$) *</Label>
            <Input
              id="defaultValue"
              type="number"
              value={defaultValue}
              onChange={e => setDefaultValue(e.target.value)}
              placeholder="0,00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descrição breve do produto..."
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">{description.length}/200 caracteres</p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={active}
              onCheckedChange={(checked) => setActive(checked as boolean)}
            />
            <Label htmlFor="active" className="text-sm font-normal cursor-pointer">
              Produto ativo
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
                'Salvar Produto'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
