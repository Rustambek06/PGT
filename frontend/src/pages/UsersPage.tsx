import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { User } from '../types';
import { Modal } from '../components/Modal';
import { Pagination } from '../components/Pagination';
import { UserCard } from '../components/UserCard';
import { UserForm } from '../components/UserForm';
import { DeleteConfirmation } from '../components/DeleteConfirmation';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';
import styles from '../pages/Pages.module.css';

export const UsersPage: React.FC = () => {
  const {
    data,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    user: User | null;
    loading: boolean;
  }>({
    isOpen: false,
    user: null,
    loading: false,
  });

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (formData: any) => {
    try {
      await createUser(formData);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (formData: any) => {
    if (!editingUser) return;
    try {
      await updateUser(editingUser.id, formData);
      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleDeleteClick = (user: User) => {
    setDeleteConfirm({
      isOpen: true,
      user,
      loading: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.user) return;
    try {
      setDeleteConfirm((prev) => ({ ...prev, loading: true }));
      await deleteUser(deleteConfirm.user.id);
      setDeleteConfirm({ isOpen: false, user: null, loading: false });
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  if (loading && data.content.length === 0) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          👥 Пользователи ({data.totalElements})
        </h1>
        <button className={styles.createButton} onClick={handleCreateClick}>
          ➕ Создать
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className={styles.grid}>
        {data.content.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            loading={loading}
          />
        ))}
      </div>

      {data.content.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <p>Нет пользователей</p>
        </div>
      )}

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

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        title="👥 Новый пользователь"
        onClose={() => setIsCreateModalOpen(false)}
        size="md"
      >
        <UserForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateModalOpen(false)}
          loading={loading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen && editingUser !== null}
        title={`✏️ Редактировать: ${editingUser?.name}`}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        size="md"
      >
        {editingUser && (
          <UserForm
            initialData={editingUser}
            onSubmit={handleEditSubmit}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingUser(null);
            }}
            loading={loading}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={deleteConfirm.isOpen}
        itemName={deleteConfirm.user?.name || ''}
        itemType="user"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, user: null, loading: false })}
        loading={deleteConfirm.loading}
      />
    </div>
  );
};
