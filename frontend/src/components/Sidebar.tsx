/**
 * Sidebar Component
 * Premium navigation panel with smooth animations and responsive design
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowSize } from '../hooks/useWindowSize';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('userName') || '');
  const { isMobile } = useWindowSize();

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Sync username with localStorage updates from login/register events
  useEffect(() => {
    const updateName = () => {
      setUserName(localStorage.getItem('userName') || '');
    };

    updateName();
    window.addEventListener('storage', updateName);
    window.addEventListener('userLogin', updateName);
    return () => {
      window.removeEventListener('storage', updateName);
      window.removeEventListener('userLogin', updateName);
    };
  }, []);

  const sidebarVariants = {
    hidden: {
      x: '-100%',
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      x: '-100%',
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const navigationItems = [
    { path: '/notes', label: 'Notes', icon: '📝' },
    { path: '/tasks', label: 'Tasks', icon: '✓' },
    { path: '/calendar', label: 'Calendar', icon: '📅' },
    { path: '/users', label: 'Users', icon: '👥' },
    { path: '/categories', label: 'Categories', icon: '📂' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Hamburger Toggle */}
      {isMobile && (
        <motion.button
          className={`${styles.sidebarToggle} ${isOpen ? styles.open : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          whileTap={{ scale: 0.95 }}
        >
          <span></span>
          <span></span>
          <span></span>
        </motion.button>
      )}

      {/* Overlay for Mobile */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            className={`${styles.overlay} ${isOpen ? styles.visible : ''}`}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`${styles.sidebar} ${isMobile && !isOpen ? styles.hidden : ''}`}
        variants={isMobile ? sidebarVariants : undefined}
        initial={isMobile ? 'hidden' : undefined}
        animate={isMobile ? (isOpen ? 'visible' : 'hidden') : undefined}
        exit={isMobile ? 'exit' : undefined}
      >
        {/* Logo Section */}
        <div className={styles.logo}>
          <h1>🚀 Tracker</h1>
        </div>

        {/* User Block */}
        <div className={styles.userBlock}>
          <div className={styles.userAvatar} aria-label="User avatar">
            {userName ? userName[0].toUpperCase() : 'U'}
          </div>
          <div className={styles.userDetails}>
            <p className={styles.userLabel}>Пользователь</p>
            <p className={styles.userName}>{userName || 'Гость'}</p>
          </div>
          {userName && (
            <button
              className={styles.logoutBtn}
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                window.location.href = '/login';
              }}
            >
              Выйти
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={!isMobile ? { opacity: 0, x: -20 } : undefined}
              animate={!isMobile ? { opacity: 1, x: 0 } : undefined}
              transition={!isMobile ? { duration: 0.3, delay: index * 0.1 } : undefined}
            >
              <Link
                to={item.path}
                className={`${styles.navLink} ${isActive(item.path) ? styles.active : ''}`}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;