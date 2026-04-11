import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DeleteConfirmation.module.css';

interface DeleteConfirmationProps {
  isOpen: boolean;
  itemName: string;
  itemType: 'note' | 'task' | 'user' | 'category';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  itemName,
  itemType,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const typeLabel = t(`modals.deleteConfirmation.${itemType}`);

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <span className={styles.icon}>🗑️</span>
          <h2 className={styles.title}>{t('modals.deleteConfirmation.title')} {typeLabel}?</h2>
        </div>

        <div className={styles.content}>
          <p className={styles.message}>
            {t('modals.deleteConfirmation.confirmDelete')} <strong>"{itemName}"</strong>?
          </p>
          <p className={styles.warning}>
            {t('modals.deleteConfirmation.warning')}
          </p>
        </div>

        <div className={styles.buttons}>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onCancel}
            disabled={loading}
          >
            {t('modals.deleteConfirmation.cancel')}
          </button>
          <button
            className={`${styles.button} ${styles.deleteButton}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? t('modals.deleteConfirmation.deleting') : t('modals.deleteConfirmation.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};
