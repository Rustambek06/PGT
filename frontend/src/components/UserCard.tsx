import React from 'react';
import { User } from '../types';
import styles from './UserCard.module.css';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  loading?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  loading = false,
}) => {
  // Mask password display
  const maskedPassword = '••••••••';

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.details}>
            <h3 className={styles.name}>{user.name}</h3>
            <p className={styles.email}>{user.email}</p>
            <p className={styles.password}>
              <span className={styles.label}>Password:</span>{' '}
              <span className={styles.masked}>{maskedPassword}</span>
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.editButton}`}
            onClick={() => onEdit(user)}
            disabled={loading}
            title="Edit user"
          >
            ✏️ Редактировать
          </button>
          <button
            className={`${styles.button} ${styles.deleteButton}`}
            onClick={() => onDelete(user)}
            disabled={loading}
            title="Delete user"
          >
            🗑️ Удалить
          </button>
        </div>
      </div>
    </div>
  );
};
