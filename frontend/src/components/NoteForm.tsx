import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './UserForm.module.css';
import { NoteRequest, Note, Category } from '../types';
import apiService from '../services/apiService';

interface NoteFormProps {
  initialData?: Note;
  onSubmit: (data: NoteRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const NoteForm: React.FC<NoteFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = React.useState<NoteRequest>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    categoryId: initialData?.category?.id,
  });
  const [errors, setErrors] = React.useState<Partial<NoteRequest>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryError, setNewCategoryError] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await apiService.getPaginated<Category>('/categories', 0, 100);
      setCategories(response.data.content);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setNewCategoryError(t('forms.noteForm.categoryRequired'));
      return;
    }

    try {
      setIsCreatingCategory(true);
      const response = await apiService.create<Category>('/categories', { name: newCategoryName });
      setCategories([...categories, response.data]);
      setFormData((prev) => ({ ...prev, categoryId: response.data.id }));
      setNewCategoryName('');
      setNewCategoryError('');
      setShowNewCategoryForm(false);
    } catch (err) {
      setNewCategoryError(err instanceof Error ? err.message : t('forms.noteForm.categoryCreateError'));
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<NoteRequest> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('forms.noteForm.titleRequired');
    }
    if (!formData.content.trim()) {
      newErrors.content = t('forms.noteForm.contentRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      setFormData({ title: '', content: '' });
      setErrors({});
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'categoryId' ? (value ? parseInt(value) : undefined) : value,
    }));
    if (errors[name as keyof NoteRequest]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          {t('forms.noteForm.title')}
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`${styles.input} ${errors.title ? styles.error : ''}`}
          placeholder={t('forms.noteForm.enterTitle')}
          disabled={isSubmitting || loading}
        />
        {errors.title && (
          <span className={styles.errorText}>{errors.title}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content" className={styles.label}>
          {t('forms.noteForm.content')}
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          className={`${styles.textarea} ${errors.content ? styles.error : ''}`}
          placeholder={t('forms.noteForm.enterContent')}
          disabled={isSubmitting || loading}
        />
        {errors.content && (
          <span className={styles.errorText}>{errors.content}</span>
        )}
      </div>

      {/* Category Selection */}
      <div className={styles.formGroup}>
        <label htmlFor="categoryId" className={styles.label}>
          {t('forms.noteForm.category')} ({t('common.optional')})
        </label>
        {categoriesLoading && !showNewCategoryForm ? (
          <div className={styles.input} style={{ color: 'var(--color-text-secondary)' }}>
            {t('forms.noteForm.categoryLoading')}
          </div>
        ) : !showNewCategoryForm ? (
          <>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId || ''}
                onChange={handleChange}
                className={styles.input}
                disabled={isSubmitting || loading}
              >
                <option value="">{t('forms.noteForm.notSelected')}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewCategoryForm(true)}
                className={styles.button}
                style={{
                  padding: '0.6rem 1rem',
                  minWidth: '120px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.5)',
                  color: '#3b82f6',
                }}
                disabled={isSubmitting || loading}
              >
                ➕ {t('forms.noteForm.createCategory')}
              </button>
            </div>
          </>
        ) : (
          <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                setNewCategoryError('');
              }}
              placeholder={t('forms.noteForm.categoryName')}
              className={styles.input}
              disabled={isCreatingCategory}
              style={{ marginBottom: '0.5rem' }}
            />
            {newCategoryError && (
              <span className={styles.errorText} style={{ display: 'block', marginBottom: '0.5rem' }}>
                {newCategoryError}
              </span>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleCreateCategory}
                className={styles.button}
                disabled={isCreatingCategory || isSubmitting || loading}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: 'white',
                }}
              >
                {isCreatingCategory ? t('forms.noteForm.categoryCreating') : t('common.create')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNewCategoryForm(false);
                  setNewCategoryName('');
                  setNewCategoryError('');
                }}
                className={styles.button}
                disabled={isCreatingCategory}
                style={{
                  flex: 1,
                  background: 'rgba(107, 114, 128, 0.2)',
                  border: '1px solid rgba(107, 114, 128, 0.3)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.buttons}>
        <button
          type="button"
          className={`${styles.button} ${styles.cancelButton}`}
          onClick={onCancel}
          disabled={isSubmitting || loading}
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          className={`${styles.button} ${styles.submitButton}`}
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? t('common.loading') : t('common.save')}
        </button>
      </div>
    </form>
  );
};
