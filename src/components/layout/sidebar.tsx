'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  Settings,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Subjects', href: '/subjects', icon: BookOpen },
  { name: 'Exams', href: '/exams', icon: CalendarCheck },
  { name: 'Study Schedule', href: '/schedule', icon: CalendarDays },
];

export function Sidebar() {
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <div className="flex flex-col h-full w-64 border-r bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 bg-primary rounded-lg text-primary-foreground shadow-lg shadow-primary/20">
          <GraduationCap size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight">StudyFlow</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group',
              pathname === item.href
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <item.icon
              size={18}
              className={cn(
                'transition-transform group-hover:scale-110',
                pathname === item.href ? 'text-primary' : 'text-muted-foreground group-hover:text-accent-foreground'
              )}
            />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t space-y-2 mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
