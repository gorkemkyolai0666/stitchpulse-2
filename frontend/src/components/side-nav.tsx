'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Frame,
  ClipboardList,
  Wrench,
  CheckSquare,
  Package,
  Tags,
  Settings,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { href: '/work-benches', label: 'Tezgahlar', icon: Frame },
  { href: '/framing-orders', label: 'Siparişler', icon: ClipboardList },
  { href: '/equipment-maintenance', label: 'Ekipman', icon: Wrench },
  { href: '/quality-checklists', label: 'Kalite', icon: CheckSquare },
  { href: '/moulding-orders', label: 'Profil', icon: Package },
  { href: '/pricing-tiers', label: 'Fiyatlar', icon: Tags },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
];

export function SideNav() {
  const pathname = usePathname();
  const { framingShop, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border/80 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90">
      <div className="border-b border-border/60 px-5 py-6">
        <Link href="/dashboard" className="flex items-center gap-3" aria-label="FramePulse ana sayfa">
          <div className="flex h-10 w-10 items-center justify-center border border-accent/40 bg-background">
            <Frame className="h-5 w-5 text-accent" strokeWidth={1.75} />
          </div>
          <div>
            <p className="font-display text-lg leading-none text-primary">FramePulse</p>
            <p className="mt-1 truncate text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {framingShop?.name || 'Çerçeve Atölyesi'}
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Ana menü">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-4 w-4" strokeWidth={active ? 2.25 : 1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/60 p-4">
        {user && (
          <p className="mb-3 truncate text-xs text-muted-foreground">
            {user.firstName} {user.lastName}
          </p>
        )}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
            aria-label="Tema değiştir"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-9 w-9 text-muted-foreground hover:text-destructive"
            aria-label="Çıkış yap"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
