import React, { useState, useRef, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown,
  Settings,
  HelpCircle,
  Shield,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onMenuClick?: () => void;
  showMobileMenu?: boolean;
}

export function Navbar({ onMenuClick, showMobileMenu = false }: NavbarProps) {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.publicMetadata?.role === 'admin';

  // Fermer les menus quand on clique dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="enhanced-navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Section gauche - Vide pour l'équilibre */}
          <div className="navbar-left">
            {/* Espace réservé pour l'équilibre visuel */}
          </div>

          {/* Section droite - Profil utilisateur à l'extrême droite */}
          <div className="navbar-right navbar-right-profile" style={{ marginLeft: 'auto' }}>
            {isSignedIn ? (
              <>
                {/* Menu utilisateur */}
                <div className="user-menu-wrapper" ref={userMenuRef}>
                  {/* Section utilisateur cliquable vers profil */}
                  <Link href="/profile" className="user-profile-link">
                    <div className="user-info">
                      <span className="user-name">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className="user-role">
                        {isAdmin ? 'Administrateur' : 'Utilisateur'}
                      </span>
                    </div>
                    <div className="user-avatar-wrapper">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8",
                          }
                        }}
                      />
                    </div>
                  </Link>
                  
                  {/* Bouton pour menu déroulant */}
                  <button
                    className="user-menu-toggle"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <ChevronDown className="h-4 w-4 text-white/60" />
                  </button>

                  {/* Menu déroulant utilisateur */}
                  {userMenuOpen && (
                    <div className="user-dropdown">
                      <div className="dropdown-header">
                        <Settings className="h-4 w-4 text-blue-400" />
                        <div>
                          <div className="font-semibold">{user?.firstName} {user?.lastName}</div>
                          <div className="text-sm text-white/60">{user?.primaryEmailAddress?.emailAddress}</div>
                        </div>
                      </div>

                      <div className="dropdown-divider"></div>
                      
                      <Link href="/dashboard" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <LayoutDashboard className="dropdown-item-icon" />
                        <span>Dashboard</span>
                      </Link>

                      {isAdmin && (
                        <Link href="/admin" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                          <Shield className="dropdown-item-icon" />
                          <span>Administration</span>
                        </Link>
                      )}

                      <div className="dropdown-divider"></div>

                      <Link href="/settings" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <Settings className="dropdown-item-icon" />
                        <span>Paramètres</span>
                      </Link>

                      <Link href="/help" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <HelpCircle className="dropdown-item-icon" />
                        <span>Aide</span>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link href="/auth">
                  <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                    Se connecter
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500">
                    Commencer
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
