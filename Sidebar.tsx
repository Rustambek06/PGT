import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, CheckSquare, StickyNote, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { path: '/notes', label: 'Notes', icon: StickyNote },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`
          fixed top-0 left-0 h-full z-50
          w-[250px] bg-[var(--bg-panel)] border-r border-[var(--border-color)]
          flex flex-col p-6
          md:translate-x-0 md:static md:block
        `}
        style={{ 
          // Force reset transform on desktop via CSS to override motion style if needed
          // but Tailwind md:static usually handles layout flow
        }}
      >
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold gradient-text">Tracker</h1>
          <button onClick={onClose} className="md:hidden text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 768) onClose();
              }}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-[var(--accent-gradient)] text-black font-semibold shadow-lg' 
                  : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-[var(--border-color)]">
          <p className="text-xs text-[var(--text-secondary)] text-center">
            © 2024 Growth Tracker
          </p>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;