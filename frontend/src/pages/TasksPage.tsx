/**
 * Tasks Page
 * Отображает все задачи с CRUD операциями и пагинацией
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useFetchTasks } from '../hooks/useFetchTasks';
import { Task, TaskRequest } from '../types';
import TaskCard from '../components/TaskCard';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';
import { Pagination } from '../components/Pagination';
import { Modal } from '../components/Modal';
import { TaskForm } from '../components/TaskForm';
import { DeleteConfirmation } from '../components/DeleteConfirmation';
import styles from './Pages.module.css';

const TasksPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    data,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useFetchTasks();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    task: Task | null;
    loading: boolean;
  }>({
    isOpen: false,
    task: null,
    loading: false,
  });

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (formData: TaskRequest) => {
    try {
      await createTask(formData);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (formData: TaskRequest) => {
    if (!editingTask) return;
    try {
      await updateTask(editingTask.id, formData);
      setIsEditModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteClick = (task: Task) => {
    setDeleteConfirm({
      isOpen: true,
      task,
      loading: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.task) return;
    try {
      setDeleteConfirm((prev) => ({ ...prev, loading: true }));
      await deleteTask(deleteConfirm.task.id);
      setDeleteConfirm({ isOpen: false, task: null, loading: false });
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handlePageChange = (page: number) => {
    fetchTasks(page);
  };

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

  if (loading && data.content.length === 0) {
    return <Loader />;
  }

  return (
    <motion.div
      className={styles.pageContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>
          ✓ {t('pages.tasksPage.title')} ({data.totalElements})
        </h1>
        <button className={styles.createButton} onClick={handleCreateClick}>
          ➕ {t('common.create')}
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {!error && (
        <>
          {data.content.length > 0 ? (
            <>
              <motion.div
                className={styles.grid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {data.content.map((task, index) => (
                  <div key={task.id} className={styles.cardWrapper}>
                    <TaskCard task={task} index={index} />
                    <div className={styles.cardActions}>
                      <button
                        className={`${styles.actionButton} ${styles.editAction}`}
                        onClick={() => handleEditClick(task)}
                        title="Edit task"
                      >
                        ✏️
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteAction}`}
                        onClick={() => handleDeleteClick(task)}
                        title="Delete task"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>

              {data.totalPages > 1 && (
                <Pagination
                  currentPage={data.number}
                  totalPages={data.totalPages}
                  totalElements={data.totalElements}
                  pageSize={data.size}
                  onPageChange={handlePageChange}
                  loading={loading}
                />
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>{t('pages.tasksPage.noTasks')}</p>
            </div>
          )}
        </>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        title={`✓ ${t('pages.tasksPage.newTask')}`}
        onClose={() => setIsCreateModalOpen(false)}
        size="lg"
      >
        <TaskForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateModalOpen(false)}
          loading={loading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen && editingTask !== null}
        title={`✏️ ${t('common.edit')}: ${editingTask?.task}`}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        size="lg"
      >
        {editingTask && (
          <TaskForm
            initialData={editingTask}
            onSubmit={handleEditSubmit}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingTask(null);
            }}
            loading={loading}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={deleteConfirm.isOpen}
        itemName={deleteConfirm.task?.task || ''}
        itemType="task"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, task: null, loading: false })}
        loading={deleteConfirm.loading}
      />
    </motion.div>
  );
};

export default TasksPage;