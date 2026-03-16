'use client';

import { usePathname } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, User as UserIcon, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopBarProps {
  user: User | null;
}

export function TopBar({ user }: TopBarProps) {
  const pathname = usePathname();

  // Simple title generator based on pathname
  const getTitle = () => {
    const path = pathname?.split('/').pop();
    if (!path || path === 'dashboard') return 'Overview';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 sticky top-0 z-10">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{getTitle()}</h2>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell size={18} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger 
            render={
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || 'Student'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
