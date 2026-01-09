import { useState } from 'react';
import { Plus, Pencil, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSettings, PaymentMethodSetting } from '@/contexts/SettingsContext';
import { PaymentMethodModal } from './PaymentMethodModal';
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

export function PaymentMethodsTab() {
  const { paymentMethods, deletePaymentMethod } = useSettings();
  const [modalOpen, setModalOpen] = useState(false);
  const [editMethod, setEditMethod] = useState<PaymentMethodSetting | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<PaymentMethodSetting | null>(null);

  const handleEdit = (method: PaymentMethodSetting) => {
    setEditMethod(method);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditMethod(null);
    setModalOpen(true);
  };

  const handleDeleteClick = (method: PaymentMethodSetting) => {
    if (method.clientsUsing > 0) {
      toast.error(`Não é possível excluir. ${method.clientsUsing} cliente(s) estão usando esta forma de pagamento.`);
      return;
    }
    setMethodToDelete(method);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (methodToDelete) {
      const success = deletePaymentMethod(methodToDelete.id);
      if (success) {
        toast.success('Forma de pagamento excluída com sucesso!');
      } else {
        toast.error('Não foi possível excluir a forma de pagamento.');
      }
    }
    setDeleteDialogOpen(false);
    setMethodToDelete(null);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Formas de Pagamento</CardTitle>
          <CardDescription>Métodos de pagamento aceitos</CardDescription>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Forma de Pagamento
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paymentMethods.map(method => (
            <Card key={method.id} className="bg-background border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{method.icon}</span>
                    <h3 className="font-semibold text-foreground">{method.name}</h3>
                  </div>
                  <Badge variant={method.active ? 'default' : 'secondary'}>
                    {method.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                
                {method.observation && (
                  <p className="text-sm text-muted-foreground mb-2">{method.observation}</p>
                )}
                
                <p className="text-sm text-muted-foreground mb-3">
                  Usado por: {method.clientsUsing} cliente(s)
                </p>
                
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(method)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteClick(method)}
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

      <PaymentMethodModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditMethod(null);
        }}
        editMethod={editMethod}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a forma de pagamento "{methodToDelete?.name}"? Esta ação não pode ser desfeita.
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
