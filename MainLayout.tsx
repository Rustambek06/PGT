import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  // Handle resize to auto-show sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--bg-dark)] text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden p-4 flex items-center border-b border-[var(--border-color)] bg-[var(--bg-panel)]">
          <button onClick={() => setIsSidebarOpen(true)} className="mr-4">
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg gradient-text">Tracker</span>
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;