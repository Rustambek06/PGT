import React from 'react';
import { Category } from '../types';
import styles from './CategoryCard.module.css';

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  loading?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
  loading = false,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.categoryInfo}>
          <div className={styles.icon}>
            📁
          </div>
          <div className={styles.details}>
            <h3 className={styles.name}>{category.name}</h3>
            <p className={styles.id}>ID: {category.id}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.editButton}`}
            onClick={() => onEdit(category)}
            disabled={loading}
            title="Edit category"
          >
            ✏️ Редактировать
          </button>
          <button
            className={`${styles.button} ${styles.deleteButton}`}
            onClick={() => onDelete(category)}
            disabled={loading}
            title="Delete category"
          >
            🗑️ Удалить
          </button>
        </div>
      </div>
    </div>
  );
};