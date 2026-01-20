/**
 * Main Layout Component
 * Основной макет приложения с Sidebar и основным контентом
 */

import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { useWindowSize } from '../hooks/useWindowSize';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isMobile } = useWindowSize();

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  return (
    <div className={styles.layoutContainer}>
      <Sidebar />
      <main className={`${styles.mainContent} ${isMobile ? styles.mobile : ''}`}>
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={styles.contentWrapper}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default MainLayout;