/**
 * Компонент для отображения сообщений об ошибках
 */

import React from 'react';
import { motion } from 'framer-motion';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <motion.div
      className={styles.errorContainer}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.errorContent}>
        <h3 className={styles.errorTitle}>⚠️ Error</h3>
        <p className={styles.errorMessage}>{message}</p>
        {onRetry && (
          <button className={styles.retryButton} onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    </motion.div>
  );
};
