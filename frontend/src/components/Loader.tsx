/**
 * Компонент загрузки (Spinner)
 */

import React from 'react';
import { motion } from 'framer-motion';
import styles from './Loader.module.css';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
}

export const Loader: React.FC<LoaderProps> = ({ size = 'medium' }) => {
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  return (
    <div className={`${styles.loaderContainer} ${styles[size]}`}>
      <motion.div
        className={styles.spinner}
        variants={spinnerVariants}
        animate="animate"
      />
    </div>
  );
};
