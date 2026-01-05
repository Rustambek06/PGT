import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav>
          <Link to="/notes" className={location.pathname === '/notes' ? 'active' : ''} onClick={() => setIsOpen(false)}>
            Notes
          </Link>
          <Link to="/tasks" className={location.pathname === '/tasks' ? 'active' : ''} onClick={() => setIsOpen(false)}>
            Tasks
          </Link>
          <Link to="/calendar" className={location.pathname === '/calendar' ? 'active' : ''} onClick={() => setIsOpen(false)}>
            Calendar
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;