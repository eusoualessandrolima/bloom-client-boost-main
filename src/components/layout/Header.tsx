import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Link2, Zap, UserPlus, Settings, User, Activity, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { NewClientModal } from '@/components/clients/NewClientModal';

interface HeaderProps {
  activeView: 'board' | 'kanban';
  onViewChange: (view: 'board' | 'kanban') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ activeView, onViewChange, searchQuery, onSearchChange }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-foreground">Gestão Clientes7</h1>

            {/* View tabs */}
            <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => onViewChange('board')}
                className={cn(
                  'px-4 py-1.5 text-sm font-medium rounded-md transition-all',
                  activeView === 'board'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Quadro principal
              </button>
              <button
                onClick={() => onViewChange('kanban')}
                className={cn(
                  'px-4 py-1.5 text-sm font-medium rounded-md transition-all',
                  activeView === 'kanban'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Kanban
              </button>
            </div>
          </div>

          {/* Right section */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente..."
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                className="pl-9 bg-muted border-0"
              />
            </div>

            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtros</span>
            </Button>

            <Button variant="outline" size="sm" className="gap-2">
              <Link2 className="w-4 h-4" />
              <span className="hidden sm:inline">Integrar</span>
            </Button>

            <Button variant="outline" size="sm" className="gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Automatizar</span>
            </Button>

            <Button
              size="sm"
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setNewClientModalOpen(true)}
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">+ Novo Cliente</span>
            </Button>

            {/* User Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-sm font-semibold text-primary-foreground cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                  {user?.name?.charAt(0) || 'U'}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="font-medium text-foreground">{user?.name || 'Usuário'}</p>
                  <p className="text-xs text-muted-foreground">{user?.role || 'Admin'}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Activity className="w-4 h-4 mr-2" />
                  Atividade
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <NewClientModal
        open={newClientModalOpen}
        onClose={() => setNewClientModalOpen(false)}
      />
    </>
  );
}
