import { useState, useEffect } from 'react';
import { Loader2, FolderOpen } from 'lucide-react';
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
import { useSettings, Niche } from '@/contexts/SettingsContext';
import { toast } from 'sonner';

interface NicheModalProps {
  open: boolean;
  onClose: () => void;
  editNiche?: Niche | null;
}

const EMOJI_OPTIONS = ['⚖️', '💪', '📚', '📱', '❤️', '🛒', '🔧', '💻', '🍔', '📋', '🏠', '🚗', '✈️', '🎵', '🎨', '🎬', '📸', '🎮', '🏥', '🏢'];

export function NicheModal({ open, onClose, editNiche }: NicheModalProps) {
  const { addNiche, updateNiche, niches } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📋');
  const [color, setColor] = useState('#00FF94');
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (editNiche) {
      setName(editNiche.name);
      setEmoji(editNiche.emoji);
      setColor(editNiche.color);
      setActive(editNiche.active);
    } else {
      resetForm();
    }
  }, [editNiche, open]);

  const resetForm = () => {
    setName('');
    setEmoji('📋');
    setColor('#00FF94');
    setActive(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      toast.error('Nome do nicho deve ter pelo menos 2 caracteres');
      return;
    }

    const duplicateName = niches.find(
      n => n.name.toLowerCase() === name.trim().toLowerCase() && n.id !== editNiche?.id
    );
    if (duplicateName) {
      toast.error('Já existe um nicho com este nome');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    if (editNiche) {
      updateNiche(editNiche.id, {
        name: name.trim(),
        emoji,
        color,
        active,
      });
      toast.success('Nicho atualizado com sucesso!');
    } else {
      addNiche({
        name: name.trim(),
        emoji,
        color,
        active,
      });
      toast.success('Nicho salvo com sucesso!');
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
            <FolderOpen className="w-5 h-5 text-primary" />
            {editNiche ? 'Editar Nicho' : 'Adicionar Nicho'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Nicho *</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Imobiliária"
            />
          </div>

          <div className="space-y-2">
            <Label>Emoji</Label>
            <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
              {EMOJI_OPTIONS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`text-2xl p-2 rounded-lg transition-colors ${
                    emoji === e ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-muted-foreground/10'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Cor de Destaque</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-12 h-10 rounded border border-border cursor-pointer"
              />
              <Input
                value={color}
                onChange={e => setColor(e.target.value)}
                placeholder="#00FF94"
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={active}
              onCheckedChange={(checked) => setActive(checked as boolean)}
            />
            <Label htmlFor="active" className="text-sm font-normal cursor-pointer">
              Nicho ativo
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
                'Salvar Nicho'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
