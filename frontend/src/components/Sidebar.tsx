/**
 * Sidebar Component
 * Premium navigation panel with smooth animations and responsive design
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from '../hooks/useWindowSize';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
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
    { path: '/notes', labelKey: 'navigation.notes', icon: '📝' },
    { path: '/tasks', labelKey: 'navigation.tasks', icon: '✓' },
    { path: '/calendar', labelKey: 'navigation.calendar', icon: '📅' },
    { path: '/users', labelKey: 'navigation.users', icon: '👥' },
    { path: '/categories', labelKey: 'navigation.categories', icon: '📂' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

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
            <p className={styles.userLabel}>{t('sidebar.user')}</p>
            <p className={styles.userName}>{userName || t('common.guest')}</p>
          </div>
          {userName && (
            <>
              <button
                className={styles.logoutBtn}
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('userName');
                  window.location.href = '/login';
                }}
              >
                {t('sidebar.logout')}
              </button>
              {/* Language Toggle */}
              <div className={styles.languageToggle} style={{ marginTop: '0.5rem', display: 'flex', gap: '0.25rem', borderTop: '1px solid rgba(255, 165, 0, 0.1)', paddingTop: '0.5rem' }}>
                <button
                  onClick={() => handleLanguageChange('ru')}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    background: i18n.language === 'ru' ? 'rgba(255, 165, 0, 0.3)' : 'rgba(255, 165, 0, 0.1)',
                    border: '1px solid rgba(255, 165, 0, 0.3)',
                    borderRadius: '4px',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: i18n.language === 'ru' ? '600' : '500',
                    transition: 'all 0.2s ease',
                  }}
                >
                  РУ
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    background: i18n.language === 'en' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '4px',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: i18n.language === 'en' ? '600' : '500',
                    transition: 'all 0.2s ease',
                  }}
                >
                  EN
                </button>
              </div>
            </>
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
                <span className={styles.label}>{t(item.labelKey)}</span>
              </Link>
            </motion.div>
          ))}
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;