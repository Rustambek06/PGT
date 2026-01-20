/**
 * Task Card Component
 * Отображает одну задачу в списке
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.05,
        ease: 'easeOut',
      },
    },
    hover: {
      y: -4,
      boxShadow: '0 12px 24px rgba(255, 165, 0, 0.2)',
      transition: { duration: 0.2 },
    },
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return styles.priorityHigh;
      case 'MEDIUM':
        return styles.priorityMedium;
      case 'LOW':
        return styles.priorityLow;
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'DONE':
      case 'COMPLETED':
        return styles.statusDone;
      case 'IN_PROGRESS':
        return styles.statusInProgress;
      default:
        return styles.statusTodo;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      className={`${styles.taskCard} ${task.isCompleated ? styles.completed : ''}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className={styles.header}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={task.isCompleated}
          onChange={(e) => onToggle?.(task.id, e.target.checked)}
          aria-label={`Toggle task completion for ${task.task}`}
        />
        <h3 className={styles.title}>{task.task}</h3>
      </div>

      {task.description && <p className={styles.description}>{task.description}</p>}

      <div className={styles.metadata}>
        <div className={styles.badges}>
          <span className={`${styles.status} ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
          <span className={`${styles.priority} ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>

        <div className={styles.footer}>
          {task.category && (
            <span className={styles.category}>{task.category.name}</span>
          )}
          <time className={styles.dueDate}>
            Due: {formatDate(task.dueDate)}
          </time>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;