import { useState } from 'react';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSettings, Product } from '@/contexts/SettingsContext';
import { ProductModal } from './ProductModal';
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

export function ProductsTab() {
  const { products, deleteProduct } = useSettings();
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    if (product.clientsUsing > 0) {
      toast.error(`Não é possível excluir. ${product.clientsUsing} cliente(s) estão usando este produto.`);
      return;
    }
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      const success = deleteProduct(productToDelete.id);
      if (success) {
        toast.success('Produto excluído com sucesso!');
      } else {
        toast.error('Não foi possível excluir o produto.');
      }
    }
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Produtos e Serviços</CardTitle>
          <CardDescription>Gerencie os produtos oferecidos aos seus clientes</CardDescription>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Produto
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <Card key={product.id} className="bg-background border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">{product.name}</h3>
                  </div>
                  <Badge variant={product.active ? 'default' : 'secondary'}>
                    {product.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                
                <p className="text-lg font-bold text-primary mb-2">
                  R$ {product.defaultValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description || 'Sem descrição'}
                </p>
                
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    🏷️ Usado por: {product.clientsUsing} cliente(s)
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteClick(product)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>

      <ProductModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditProduct(null);
        }}
        editProduct={editProduct}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto "{productToDelete?.name}"? Esta ação não pode ser desfeita.
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
