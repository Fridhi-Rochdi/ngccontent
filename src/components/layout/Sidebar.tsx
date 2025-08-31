import React from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Sparkles, 
  User, 
  Users, 
  Settings,
  Home,
  Brain,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, requireAuth: true },
  { name: 'Skill Paths', href: '/skillpaths', icon: BookOpen, requireAuth: true },
  { name: 'Générateur', href: '/generator', icon: Sparkles, requireAuth: true },
  { name: 'Admin', href: '/admin', icon: Users, requireAuth: true, adminOnly: true },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, isSignedIn } = useUser();
  const pathname = usePathname();

  const isAdmin = user?.publicMetadata?.role === 'admin';

  const filteredNavigation = navigation.filter(item => {
    if (item.requireAuth && !isSignedIn) return false;
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          sidebar-enhanced
          ${isOpen ? 'open' : ''}
        `}
      >
        {/* Header avec bouton fermer */}
        <div className="sidebar-header-enhanced">
          <div className="sidebar-brand">
            <Brain className="sidebar-brand-icon" />
            <span className="sidebar-brand-text">Athena</span>
          </div>
          <button 
            className="sidebar-close-btn"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation principale */}
        <div className="sidebar-content-enhanced">
          <nav className="sidebar-nav-enhanced">
            <div className="nav-section">
              <h3 className="nav-section-title">Menu Principal</h3>
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`nav-item-enhanced ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="nav-item-icon" />
                    <span className="nav-item-text">{item.name}</span>
                    {isActive && <div className="nav-item-indicator" />}
                  </Link>
                );
              })}
            </div>

            {/* Section profil et paramètres */}
            {isSignedIn && (
              <div className="nav-section">
                <h3 className="nav-section-title">Compte</h3>
                
                <Link
                  href="/profile"
                  onClick={onClose}
                  className={`nav-item-enhanced ${pathname === '/profile' ? 'active' : ''}`}
                >
                  <User className="nav-item-icon" />
                  <span className="nav-item-text">Mon Profil</span>
                  {pathname === '/profile' && <div className="nav-item-indicator" />}
                </Link>

                <Link
                  href="/settings"
                  onClick={onClose}
                  className={`nav-item-enhanced ${pathname === '/settings' ? 'active' : ''}`}
                >
                  <Settings className="nav-item-icon" />
                  <span className="nav-item-text">Paramètres</span>
                  {pathname === '/settings' && <div className="nav-item-indicator" />}
                </Link>
              </div>
            )}
          </nav>

          {/* Footer du sidebar */}
          {isSignedIn && (
            <div className="sidebar-footer-enhanced">
              <div className="sidebar-user-card">
                <div className="user-status-indicator">
                  <div className="status-dot"></div>
                  <span className="status-text">En ligne</span>
                </div>
                <div className="user-summary">
                  <div className="user-name-sidebar">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="user-role-sidebar">
                    {isAdmin ? 'Administrateur' : 'Utilisateur'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
