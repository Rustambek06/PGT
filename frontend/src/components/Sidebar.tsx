/**
 * Sidebar Component - Вертикальная панель навигации
 * На мобильных устройствах - сворачиваемое меню
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowSize } from '../hooks/useWindowSize';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useWindowSize();

  const sidebarVariants = {
    hidden: {
      x: -100,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    exit: {
      x: -100,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
  };

  const handleNavClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const navigationItems = [
    { path: '/notes', label: 'Notes', icon: '📝' },
    { path: '/tasks', label: 'Tasks', icon: '✓' },
    { path: '/calendar', label: 'Calendar', icon: '📅' },
  ];

  return (
    <>
      {/* Hamburger Menu Button - только на мобильных */}
      {isMobile && (
        <button
          className={styles.sidebarToggle}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        <motion.div
          key="sidebar"
          className={`${styles.sidebar} ${isMobile && !isOpen ? styles.hidden : ''}`}
          variants={isMobile ? sidebarVariants : undefined}
          initial={isMobile ? 'hidden' : undefined}
          animate={isMobile && !isOpen ? 'hidden' : 'visible'}
          exit={isMobile ? 'exit' : undefined}
        >
          <div className={styles.logo}>
            <h1>🚀 Tracker</h1>
          </div>

          <nav className={styles.nav}>
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink} ${
                  location.pathname === item.path ? styles.active : ''
                }`}
                onClick={handleNavClick}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.label}</span>
              </Link>
            ))}
          </nav>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Sidebar;