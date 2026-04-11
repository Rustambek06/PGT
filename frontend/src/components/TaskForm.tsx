import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './UserForm.module.css';
import { TaskRequest, Task, Category } from '../types';
import apiService from '../services/apiService';

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: TaskRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = React.useState<TaskRequest>({
    task: initialData?.task || '',
    description: initialData?.description || '',
    status: initialData?.status || 'TODO',
    priority: initialData?.priority || 'MEDIUM',
    dueDate: initialData?.dueDate || '',
    isCompleated: initialData?.isCompleated || false,
    categoryId: initialData?.category?.id,
  });
  const [errors, setErrors] = React.useState<Partial<TaskRequest>>({});
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
      setNewCategoryError(t('forms.taskForm.categoryRequired'));
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
      setNewCategoryError(err instanceof Error ? err.message : t('forms.taskForm.categoryCreateError'));
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<TaskRequest> = {};

    if (!formData.task || !formData.task.trim()) {
      newErrors.task = t('forms.taskForm.titleRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      // Convert date-only values (YYYY-MM-DD) to LocalDateTime string expected by backend
      const payload: TaskRequest = { ...formData } as TaskRequest;
      if (payload.dueDate && /^\d{4}-\d{2}-\d{2}$/.test(payload.dueDate)) {
        payload.dueDate = `${payload.dueDate}T00:00:00`;
      }

      await onSubmit(payload);
      setFormData({
        task: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: '',
        isCompleated: false,
      });
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
      // keep boolean for checkbox, otherwise assign string/number for categoryId
      [name]: (e.target as HTMLInputElement).type === 'checkbox' ? (e.target as HTMLInputElement).checked : name === 'categoryId' ? (value ? parseInt(value) : undefined) : value,
    }));
    if (errors[name as keyof TaskRequest]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="task" className={styles.label}>
          {t('forms.taskForm.title')}
        </label>
        <input
          type="text"
          id="task"
          name="task"
          value={formData.task}
          onChange={handleChange}
          className={`${styles.input} ${errors.task ? styles.error : ''}`}
          placeholder={t('forms.taskForm.enterTitle')}
          disabled={isSubmitting || loading}
        />
        {errors.task && (
          <span className={styles.errorText}>{errors.task}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          {t('forms.taskForm.description')}
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          className={styles.textarea}
          placeholder={t('forms.taskForm.enterDescription')}
          disabled={isSubmitting || loading}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="priority" className={styles.label}>
          {t('forms.taskForm.priority')}
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority || 'MEDIUM'}
          onChange={handleChange}
          className={styles.input}
          disabled={isSubmitting || loading}
        >
          <option value="LOW">{t('forms.taskForm.priorityLow')}</option>
          <option value="MEDIUM">{t('forms.taskForm.priorityMedium')}</option>
          <option value="HIGH">{t('forms.taskForm.priorityHigh')}</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="status" className={styles.label}>
          {t('forms.taskForm.status')}
        </label>
        <select
          id="status"
          name="status"
          value={formData.status || 'TODO'}
          onChange={handleChange}
          className={styles.input}
          disabled={isSubmitting || loading}
        >
          <option value="TODO">{t('forms.taskForm.statusTodo')}</option>
          <option value="IN_PROGRESS">{t('forms.taskForm.statusInProgress')}</option>
          <option value="DONE">{t('forms.taskForm.statusDone')}</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="dueDate" className={styles.label}>
          {t('forms.taskForm.dueDate')}
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate || ''}
          onChange={handleChange}
          className={styles.input}
          disabled={isSubmitting || loading}
        />
      </div>

      {/* Category Selection */}
      <div className={styles.formGroup}>
        <label htmlFor="categoryId" className={styles.label}>
          {t('forms.taskForm.category')} ({t('common.optional')})
        </label>
        {categoriesLoading && !showNewCategoryForm ? (
          <div className={styles.input} style={{ color: 'var(--color-text-secondary)' }}>
            {t('forms.taskForm.categoryLoading')}
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
                <option value="">{t('forms.taskForm.notSelected')}</option>
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
                ➕ {t('forms.taskForm.createCategory')}
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
              placeholder={t('forms.taskForm.categoryName')}
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
                {isCreatingCategory ? t('forms.taskForm.categoryCreating') : t('common.create')}
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
