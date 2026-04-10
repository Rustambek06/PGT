import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { Category } from '../types';
import { Modal } from '../components/Modal';
import { Pagination } from '../components/Pagination';
import { CategoryCard } from '../components/CategoryCard';
import { CategoryForm } from '../components/CategoryForm';
import { DeleteConfirmation } from '../components/DeleteConfirmation';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';
import styles from '../pages/Pages.module.css';

export const CategoriesPage: React.FC = () => {
  const {
    data,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    category: Category | null;
    loading: boolean;
  }>({
    isOpen: false,
    category: null,
    loading: false,
  });

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (formData: any) => {
    try {
      await createCategory(formData);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Error creating category:', err);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (formData: any) => {
    if (!editingCategory) return;
    try {
      await updateCategory(editingCategory.id, formData);
      setIsEditModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const handleDeleteClick = (category: Category) => {
    setDeleteConfirm({
      isOpen: true,
      category,
      loading: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.category) return;
    try {
      setDeleteConfirm((prev) => ({ ...prev, loading: true }));
      await deleteCategory(deleteConfirm.category.id);
      setDeleteConfirm({ isOpen: false, category: null, loading: false });
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const handlePageChange = (page: number) => {
    fetchCategories(page);
  };

  if (loading && data.content.length === 0) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          📂 Категории ({data.totalElements})
        </h1>
        <button className={styles.createButton} onClick={handleCreateClick}>
          ➕ Создать
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className={styles.grid}>
        {data.content.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            loading={loading}
          />
        ))}
      </div>

      {data.content.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <p>Нет категорий</p>
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
        title="📂 Новая категория"
        onClose={() => setIsCreateModalOpen(false)}
        size="md"
      >
        <CategoryForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateModalOpen(false)}
          loading={loading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen && editingCategory !== null}
        title={`✏️ Редактировать: ${editingCategory?.name}`}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCategory(null);
        }}
        size="md"
      >
        {editingCategory && (
          <CategoryForm
            initialData={editingCategory}
            onSubmit={handleEditSubmit}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingCategory(null);
            }}
            loading={loading}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={deleteConfirm.isOpen}
        itemName={deleteConfirm.category?.name || ''}
        itemType="category"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, category: null, loading: false })}
        loading={deleteConfirm.loading}
      />
    </div>
  );
};