'use client';

import React, { useState } from 'react';
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

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Skill Paths', href: '/skillpaths', icon: BookOpen },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Admin', href: '/admin', icon: Users },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = user?.publicMetadata?.role === 'admin';

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="loading-spinner" style={{ width: '3rem', height: '3rem' }}></div>
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
    <div className="min-h-screen bg-slate-900">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed" style={{ inset: 0, zIndex: 40 }}>
          <div 
            className="fixed bg-slate-600" 
            style={{ inset: 0, opacity: 0.75 }} 
            onClick={() => setSidebarOpen(false)} 
          />
          <div className="relative flex flex-col bg-slate-800" style={{ maxWidth: '20rem', width: '100%' }}>
            <div className="absolute" style={{ top: 0, right: 0, marginRight: '-3rem', paddingTop: '0.5rem' }}>
              <Button
                variant="ghost"
                size="icon"
                className="ml-4 text-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="icon" />
              </Button>
            </div>
            <SidebarContent navigation={filteredNavigation} pathname={pathname} />
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden sidebar" style={{ display: 'none' }}>
        <div className="flex flex-col bg-slate-800 border" style={{ flex: 1, minHeight: 0, borderRightColor: 'var(--slate-700)' }}>
          <SidebarContent navigation={filteredNavigation} pathname={pathname} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col" style={{ marginLeft: 0, flex: 1 }}>
        {/* Top bar for mobile */}
        <div className="sticky bg-slate-900 border-b p-4" style={{ top: 0, zIndex: 10, borderBottomColor: 'var(--slate-800)' }}>
          <Button
            variant="ghost"
            size="icon"
            className="text-white mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="icon" />
          </Button>
        </div>
        
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .sidebar {
            display: flex !important;
            width: 16rem;
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
          }
          .main-content {
            margin-left: 16rem;
          }
          .mobile-menu-btn {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

function SidebarContent({ navigation, pathname }: { navigation: any[], pathname: string }) {
  const { user } = useUser();

  return (
    <>
      <div className="flex items-center bg-slate-900 p-4" style={{ height: '4rem', flexShrink: 0 }}>
        <Link href="/" className="flex items-center">
          <Brain className="icon-lg text-purple-400" />
          <span className="ml-2 text-xl font-bold text-white">Athena</span>
        </Link>
      </div>
      
      <div className="flex flex-col overflow-y-auto" style={{ flex: 1 }}>
        <nav className="p-4" style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="icon" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
        
        <div className="border-t p-4" style={{ flexShrink: 0, borderTopColor: 'var(--slate-700)' }}>
          <div className="flex items-center w-full">
            <div style={{ flexShrink: 0 }}>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "width: 2.5rem; height: 2.5rem;",
                  }
                }}
              />
            </div>
            <div className="ml-4" style={{ flex: 1, minWidth: 0 }}>
              <p className="text-sm font-medium text-white" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-400" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
