/**
 * Tasks Page
 * Отображает все задачи с загрузкой данных с бэкенда
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFetchTasks } from '../hooks/useFetchTasks';
import TaskCard from '../components/TaskCard';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import styles from './Pages.module.css';

const TasksPage: React.FC = () => {
  const { tasks, loading, error, refetch } = useFetchTasks();
  const [filter, setFilter] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const filteredTasks = filter
    ? tasks.filter((task) => task.status === filter)
    : tasks;

  const taskStatuses = Array.from(new Set(tasks.map((task) => task.status)));

  const handleToggleTask = (id: number, completed: boolean) => {
    // TODO: Implement task toggle in backend
    console.log(`Task ${id} toggled to ${completed}`);
  };

  return (
    <motion.div
      className={styles.pageContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>✓ Tasks</h1>
        <p className={styles.subtitle}>
          Manage your tasks, set priorities, and track progress.
        </p>
      </div>

      {/* Filter Buttons */}
      {!loading && tasks.length > 0 && (
        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${filter === null ? styles.active : ''}`}
            onClick={() => setFilter(null)}
          >
            All ({tasks.length})
          </button>
          {taskStatuses.map((status) => (
            <button
              key={status}
              className={`${styles.filterButton} ${filter === status ? styles.active : ''}`}
              onClick={() => setFilter(status)}
            >
              {status} ({tasks.filter((t) => t.status === status).length})
            </button>
          ))}
        </div>
      )}

      {loading && <Loader size="large" />}

      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {!loading && !error && (
        <>
          {filteredTasks.length > 0 ? (
            <motion.div
              className={styles.grid}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onToggle={handleToggleTask}
                />
              ))}
            </motion.div>
          ) : (
            <EmptyState
              icon="✓"
              title={filter ? `No ${filter} tasks` : 'No tasks yet'}
              description="Create your first task to get started!"
            />
          )}
        </>
      )}
    </motion.div>
  );
};

export default TasksPage;