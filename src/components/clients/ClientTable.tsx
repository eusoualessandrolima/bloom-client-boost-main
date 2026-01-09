import { useState } from 'react';
import { useClients } from '@/contexts/ClientContext';
import { Client, ClientStatus } from '@/types/client';
import { StatusBadge } from './StatusBadge';
import { NewClientModal } from './NewClientModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  ArrowUpDown,
  Building2,
  StickyNote,
  Download,
  Pencil,
  Trash2,
  MessageCircle,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { toast } from 'sonner';

interface ClientTableProps {
  onClientClick: (client: Client) => void;
  searchQuery: string;
}

type SortField = 'companyName' | 'monthlyValue' | 'connections' | 'dueDate';
type SortDirection = 'asc' | 'desc';

export function ClientTable({ onClientClick, searchQuery }: ClientTableProps) {
  const { clients, searchClients, getTotalRevenue, deleteClient, updateClientStatus } = useClients();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('companyName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const handleStatusChange = async (clientId: string, newStatus: ClientStatus) => {
    if (newStatus === 'cancelled') {
      if (!confirm('Tem certeza que deseja cancelar este cliente?')) {
        return;
      }
    }
    await updateClientStatus(clientId, newStatus);
  };

  const filteredClients = searchQuery ? searchClients(searchQuery) : clients;

  const sortedClients = [...filteredClients].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;

    switch (sortField) {
      case 'companyName':
        return multiplier * a.companyName.localeCompare(b.companyName);
      case 'monthlyValue':
        return multiplier * (a.monthlyValue - b.monthlyValue);
      case 'connections':
        return multiplier * (a.connections - b.connections);
      case 'dueDate':
        return multiplier * (a.dueDate - b.dueDate);
      default:
        return 0;
    }
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === sortedClients.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedClients.map(c => c.id)));
    }
  };

  const handleEdit = (client: Client) => {
    setEditClient(client);
    setEditModalOpen(true);
  };

  const handleDelete = (client: Client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (clientToDelete) {
      await deleteClient(clientToDelete.id);
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const handleWhatsApp = (client: Client) => {
    const phone = client.responsiblePhone.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá ${client.responsibleName}, tudo bem?`);
    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
  };

  const paymentMethodLabels = {
    pix: 'PIX',
    credit_card: 'Cartão de Crédito',
    boleto: 'Boleto',
    transfer: 'Transferência',
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedIds.size > 0 && (
            <span>{selectedIds.size} selecionado(s)</span>
          )}
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Exportar
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.size === sortedClients.length && sortedClients.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>
                <button
                  onClick={() => toggleSort('companyName')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Empresa
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Nicho</TableHead>
              <TableHead>
                <button
                  onClick={() => toggleSort('connections')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Conexões
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>
                <button
                  onClick={() => toggleSort('monthlyValue')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Valor
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>
                <button
                  onClick={() => toggleSort('dueDate')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Vencimento
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </TableHead>
              <TableHead className="w-20">Notas</TableHead>
              <TableHead className="w-36">Status</TableHead>
              <TableHead className="w-16 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedClients.map(client => (
              <TableRow
                key={client.id}
                className="cursor-pointer hover:bg-muted/30"
              >
                <TableCell onClick={e => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(client.id)}
                    onCheckedChange={() => toggleSelect(client.id)}
                  />
                </TableCell>
                <TableCell onClick={() => onClientClick(client)}>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{client.companyName}</span>
                  </div>
                </TableCell>
                <TableCell onClick={() => onClientClick(client)}>{client.responsibleName}</TableCell>
                <TableCell onClick={() => onClientClick(client)} className="text-muted-foreground">{client.responsiblePhone}</TableCell>
                <TableCell onClick={() => onClientClick(client)} className="text-muted-foreground">{client.email}</TableCell>
                <TableCell onClick={() => onClientClick(client)}>
                  <span className="px-2 py-0.5 bg-muted rounded text-xs">{client.niche}</span>
                </TableCell>
                <TableCell onClick={() => onClientClick(client)}>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {client.connections}
                  </span>
                </TableCell>
                <TableCell onClick={() => onClientClick(client)}>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {client.product}
                  </span>
                </TableCell>
                <TableCell onClick={() => onClientClick(client)} className="font-semibold">
                  R$ {client.monthlyValue.toLocaleString('pt-BR')}
                </TableCell>
                <TableCell onClick={() => onClientClick(client)} className="text-muted-foreground text-sm">
                  {paymentMethodLabels[client.paymentMethod]}
                </TableCell>
                <TableCell onClick={() => onClientClick(client)}>Dia {client.dueDate}</TableCell>
                <TableCell onClick={e => e.stopPropagation()} className="w-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClientClick(client);
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {client.notes ? (
                      <span className="flex items-center gap-1">
                        <StickyNote className="w-4 h-4" />
                        <span className="text-xs">Ver</span>
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/60">+ Notas</span>
                    )}
                  </button>
                </TableCell>
                <TableCell onClick={e => e.stopPropagation()} className="w-36">
                  <select
                    value={client.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleStatusChange(client.id, e.target.value as ClientStatus);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    className={`
                      px-3 py-1 rounded-full text-sm font-medium cursor-pointer
                      border-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
                      transition-all duration-200
                      ${client.status === 'active' ? 'bg-primary/20 text-primary focus:ring-primary hover:bg-primary/30' : ''}
                      ${client.status === 'overdue' ? 'bg-orange-500/20 text-orange-400 focus:ring-orange-500 hover:bg-orange-500/30' : ''}
                      ${client.status === 'inactive' ? 'bg-muted text-muted-foreground focus:ring-muted hover:bg-muted/80' : ''}
                      ${client.status === 'cancelled' ? 'bg-destructive/20 text-destructive focus:ring-destructive hover:bg-destructive/30' : ''}
                    `}
                  >
                    <option value="active" className="bg-background text-foreground">✅ Ativo</option>
                    <option value="overdue" className="bg-background text-foreground">⚠️ Inadimplente</option>
                    <option value="inactive" className="bg-background text-foreground">⏸️ Inativo</option>
                    <option value="cancelled" className="bg-background text-foreground">❌ Cancelado</option>
                  </select>
                </TableCell>
                <TableCell onClick={e => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(client)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onClientClick(client)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleWhatsApp(client)}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(client)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
        <span>{sortedClients.length} clientes</span>
        <span className="font-semibold text-foreground">
          Total: R$ {getTotalRevenue().toLocaleString('pt-BR')}/mês
        </span>
      </div>

      {/* Edit Modal */}
      <NewClientModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditClient(null);
        }}
        editClient={editClient}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O cliente "{clientToDelete?.companyName}"
              será permanentemente removido do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
