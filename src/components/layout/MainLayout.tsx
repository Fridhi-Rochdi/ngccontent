import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="main-layout-new">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      {/* Contenu principal */}
      <div className="main-layout-content">
        {/* Navbar */}
        <Navbar />

        {/* Contenu de la page */}
        <main className="main-content-new">
          {children}
        </main>
      </div>
    </div>
  );
}
