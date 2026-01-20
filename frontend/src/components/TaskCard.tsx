/**
 * Task Card Component
 * Premium task card with smooth interactions and status indicators
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { Task } from '../types';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  index?: number;
  onToggle?: (id: number, completed: boolean) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index = 0, onToggle }) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    hover: {
      y: -6,
      transition: { duration: 0.2 },
    },
  };

  const getPriorityBadgeClass = (priority: string) => {
    const priorityUpper = priority?.toUpperCase();
    if (priorityUpper === 'HIGH') {
      return styles.priorityBadgeHigh;
    }
    return styles.priorityBadge;
  };

  const getStatusBadgeClass = (isCompleted: boolean) => {
    return isCompleted ? styles.statusBadgeCompleted : styles.statusBadge;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      className={styles.card}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className={styles.cardHeader}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={task.isCompleated}
          onChange={(e) => onToggle?.(task.id, e.target.checked)}
          aria-label={`Toggle task: ${task.task}`}
        />
        <h3 className={`${styles.cardTitle} ${task.isCompleated ? styles.cardTitleCompleted : ''}`}>
          {task.task}
        </h3>
      </div>

      {task.description && (
        <p className={styles.cardContent}>{task.description}</p>
      )}

      <div className={styles.cardFooter}>
        <div className={styles.badges}>
          <span className={`${styles.badge} ${getStatusBadgeClass(task.isCompleated)}`}>
            {task.isCompleated ? '✓ Done' : task.status || 'Todo'}
          </span>
          <span className={`${styles.badge} ${getPriorityBadgeClass(task.priority)}`}>
            {task.priority || 'Normal'}
          </span>
        </div>

        <div className={styles.cardMeta}>
          {task.category && (
            <span className={styles.cardCategory}>
              {task.category.name || 'Uncategorized'}
            </span>
          )}
          <span className={styles.cardDate}>
            📅 {formatDate(task.dueDate)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;