import React from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  loading = false,
}) => {
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  const getPaginationRange = () => {
    const range = [];
    const delta = 2;
    const left = Math.max(0, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    if (left > 0) {
      range.push(0);
      if (left > 1) {
        range.push(-1); // represents ellipsis
      }
    }

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages - 1) {
      if (right < totalPages - 2) {
        range.push(-1); // represents ellipsis
      }
      range.push(totalPages - 1);
    }

    return range;
  };

  const pages = getPaginationRange();

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <span className={styles.text}>
          Показано {startItem}-{endItem} из {totalElements}
        </span>
      </div>

      <div className={styles.controls}>
        <button
          className={styles.button}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0 || loading}
          aria-label="Previous page"
        >
          ← Назад
        </button>

        <div className={styles.pages}>
          {pages.map((page, idx) => {
            if (page === -1) {
              return (
                <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                className={`${styles.pageButton} ${
                  page === currentPage ? styles.active : ''
                }`}
                onClick={() => onPageChange(page)}
                disabled={loading}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page + 1}
              </button>
            );
          })}
        </div>

        <button
          className={styles.button}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1 || loading}
          aria-label="Next page"
        >
          Далее →
        </button>
      </div>
    </div>
  );
};
