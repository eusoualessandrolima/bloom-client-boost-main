import { Client } from '@/types/client';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  X,
  Edit2,
  MessageSquare,
  Calendar,
  Receipt,
  Archive,
  Phone,
  Mail,
  Building2,
  CreditCard,
  Wifi,
  Clock,
  User,
} from 'lucide-react';
import { format, differenceInMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientDetailDrawerProps {
  client: Client | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (client: Client) => void;
}

export function ClientDetailDrawer({ client, open, onClose, onEdit }: ClientDetailDrawerProps) {
  if (!client) return null;

  const monthsAsClient = differenceInMonths(new Date(), client.createdAt);

  const paymentMethodLabels = {
    pix: 'PIX',
    credit_card: 'Cartão de Crédito',
    boleto: 'Boleto',
    transfer: 'Transferência',
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-popover border-l border-border">
        <SheetHeader className="mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-xl font-bold text-foreground mb-2">
                {client.companyName}
              </SheetTitle>
              <StatusBadge status={client.status} size="lg" />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={(e) => {
                e.stopPropagation();
                if (onEdit) {
                  onEdit(client);
                  onClose();
                }
              }}
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </Button>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full bg-muted mb-6">
            <TabsTrigger value="overview" className="flex-1">Visão Geral</TabsTrigger>
            <TabsTrigger value="activities" className="flex-1">Atividades</TabsTrigger>
            <TabsTrigger value="financial" className="flex-1">Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Contact info */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Informações de Contato
              </h4>
              <div className="grid gap-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{client.responsibleName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{client.responsiblePhone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{client.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{client.document}</span>
                </div>
              </div>
            </div>

            {/* Client info */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Dados do Cliente
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Segmento</p>
                  <p className="font-medium text-foreground">{client.niche}</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Cliente há</p>
                  <p className="font-medium text-foreground">{monthsAsClient} meses</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Início</p>
                  <p className="font-medium text-foreground">
                    {format(client.createdAt, "dd 'de' MMM, yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Vencimento</p>
                  <p className="font-medium text-foreground">Dia {client.dueDate}</p>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Produtos e Serviços
              </h4>
              <div className="bg-muted rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">
                    {client.product}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    R$ {client.monthlyValue.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Wifi className="w-4 h-4" />
                    <span>{client.connections} conexões</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    <span>{paymentMethodLabels[client.paymentMethod]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Anotações
              </h4>
              <Textarea
                placeholder="Adicione uma anotação..."
                className="bg-muted border-0 min-h-[100px]"
                defaultValue={client.notes}
              />
            </div>

            {/* Tags */}
            {client.tags && client.tags.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {client.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-border space-y-3">
              <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                <MessageSquare className="w-4 h-4" />
                Enviar mensagem
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Agendar
                </Button>
                <Button variant="outline" className="gap-2">
                  <Receipt className="w-4 h-4" />
                  Cobrança
                </Button>
              </div>
              <Button variant="ghost" className="w-full gap-2 text-muted-foreground hover:text-destructive">
                <Archive className="w-4 h-4" />
                Arquivar cliente
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Clock className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm">Nenhuma atividade recente</p>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <div className="bg-muted rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Valor mensal</p>
              <p className="text-3xl font-bold text-primary">
                R$ {client.monthlyValue.toLocaleString('pt-BR')}
              </p>
            </div>

            <div className="bg-muted rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Total recebido (estimado)</p>
              <p className="text-2xl font-bold text-foreground">
                R$ {(client.monthlyValue * monthsAsClient).toLocaleString('pt-BR')}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
