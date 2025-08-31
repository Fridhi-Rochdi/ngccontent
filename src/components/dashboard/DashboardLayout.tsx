'use client';

import React, { ReactNode, useState } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Brain, 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  Users, 
  User,
  Menu,
  X,
  Home,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Skill Paths', href: '/skillpaths', icon: BookOpen },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Admin', href: '/admin', icon: Users }, // Only for admins
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = user?.publicMetadata?.role === 'admin';

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const filteredNavigation = navigation.filter(item => {
    if (item.name === 'Admin') {
      return isAdmin;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 flex z-40 md:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-slate-900 opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col max-w-xs w-full bg-slate-800 shadow-xl animate-slide-in-left">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 flex items-center justify-center w-10 h-10 text-white hover:bg-slate-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          <SidebarContent navigation={filteredNavigation} pathname={pathname} />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-1 min-h-0 bg-slate-800 border-r border-slate-700 shadow-lg">
          <SidebarContent navigation={filteredNavigation} pathname={pathname} />
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 glass-effect border-b border-slate-800">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-0.5 -mt-0.5 w-12 h-12 text-white hover:bg-slate-700 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
        
        <main className="flex-1 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ navigation, pathname }: { navigation: any[], pathname: string }) {
  const { user } = useUser();

  return (
    <>
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-slate-900 border-b border-slate-700">
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <Brain className="w-8 h-8 text-violet-400 animate-pulse" />
          <span className="ml-2 text-xl font-bold text-white">Athena</span>
        </Link>
      </div>
      
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "nav-link group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "active bg-gradient-primary text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white hover:shadow-md"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className="mr-3 flex-shrink-0 w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="flex-shrink-0 border-t border-slate-700 p-4 bg-slate-800">
          <div className="flex items-center w-full">
            <div className="flex-shrink-0">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 hover:shadow-lg transition-shadow",
                  }
                }}
              />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
