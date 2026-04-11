import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CategoryForm.module.css';
import { Category, CategoryRequest } from '../types';

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: CategoryRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = React.useState<CategoryRequest>({
    name: initialData?.name || '',
  });
  const [errors, setErrors] = React.useState<Partial<CategoryRequest>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateForm = () => {
    const newErrors: Partial<CategoryRequest> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('forms.categoryForm.nameRequired');
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
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof CategoryRequest]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          {t('forms.categoryForm.name')}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className={`${styles.input} ${errors.name ? styles.error : ''}`}
          placeholder={t('forms.categoryForm.enterName')}
          disabled={loading || isSubmitting}
          autoFocus
        />
        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={loading || isSubmitting}
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading || isSubmitting}
        >
          {isSubmitting ? t('common.loading') : t('common.save')}
        </button>
      </div>
    </form>
  );
};