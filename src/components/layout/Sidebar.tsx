import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  MessageSquare,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const mainNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Clientes', path: '/clientes' },
  { icon: BarChart3, label: 'Relatórios', path: '/reports' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300',
          'lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">CompanyChat</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto scrollbar-thin p-4">
            <div className="space-y-1">
              {mainNavItems.map(item => {
                const isActive = location.pathname === item.path || 
                  (item.path === '/dashboard' && location.pathname === '/');
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      'nav-item',
                      isActive && 'nav-item-active bg-primary/10 text-primary'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
