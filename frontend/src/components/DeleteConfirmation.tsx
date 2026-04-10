import React from 'react';
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
  if (!isOpen) return null;

  const typeLabel = {
    note: 'заметку',
    task: 'задачу',
    user: 'пользователя',
    category: 'категорию',
  }[itemType];

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <span className={styles.icon}>🗑️</span>
          <h2 className={styles.title}>Удалить {typeLabel}?</h2>
        </div>

        <div className={styles.content}>
          <p className={styles.message}>
            Вы уверены, что хотите удалить <strong>"{itemName}"</strong>?
          </p>
          <p className={styles.warning}>
            Это действие невозможно отменить.
          </p>
        </div>

        <div className={styles.buttons}>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onCancel}
            disabled={loading}
          >
            Отмена
          </button>
          <button
            className={`${styles.button} ${styles.deleteButton}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Удаляю...' : 'Да, удалить'}
          </button>
        </div>
      </div>
    </div>
  );
};
