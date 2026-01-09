import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSettings, Niche } from '@/contexts/SettingsContext';
import { NicheModal } from './NicheModal';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

export function NichesTab() {
  const { niches, deleteNiche } = useSettings();
  const [modalOpen, setModalOpen] = useState(false);
  const [editNiche, setEditNiche] = useState<Niche | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nicheToDelete, setNicheToDelete] = useState<Niche | null>(null);

  const handleEdit = (niche: Niche) => {
    setEditNiche(niche);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditNiche(null);
    setModalOpen(true);
  };

  const handleDeleteClick = (niche: Niche) => {
    if (niche.clientsUsing > 0) {
      toast.error(`Não é possível excluir. ${niche.clientsUsing} cliente(s) estão neste nicho.`);
      return;
    }
    setNicheToDelete(niche);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (nicheToDelete) {
      const success = deleteNiche(nicheToDelete.id);
      if (success) {
        toast.success('Nicho excluído com sucesso!');
      } else {
        toast.error('Não foi possível excluir o nicho.');
      }
    }
    setDeleteDialogOpen(false);
    setNicheToDelete(null);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Nichos e Segmentos</CardTitle>
          <CardDescription>Categorias de clientes para melhor organização</CardDescription>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Nicho
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {niches.map(niche => (
            <Card key={niche.id} className="bg-background border-border min-w-[240px] flex-1 max-w-[320px]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{niche.emoji}</span>
                    <h3 className="font-semibold text-foreground">{niche.name}</h3>
                  </div>
                  <Badge variant={niche.active ? 'default' : 'secondary'}>
                    {niche.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {niche.clientsUsing} cliente(s)
                </p>
                
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(niche)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteClick(niche)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>

      <NicheModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditNiche(null);
        }}
        editNiche={editNiche}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o nicho "{nicheToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
