import React from 'react';
import styles from './UserForm.module.css';
import { NoteRequest, Note } from '../types';

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
  const [formData, setFormData] = React.useState<NoteRequest>({
    title: initialData?.title || '',
    content: initialData?.content || '',
  });
  const [errors, setErrors] = React.useState<Partial<NoteRequest>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateForm = () => {
    const newErrors: Partial<NoteRequest> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название требуется';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Содержание требуется';
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
          Название
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`${styles.input} ${errors.title ? styles.error : ''}`}
          placeholder="Введите название заметки"
          disabled={isSubmitting || loading}
        />
        {errors.title && (
          <span className={styles.errorText}>{errors.title}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content" className={styles.label}>
          Содержание
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          className={`${styles.textarea} ${errors.content ? styles.error : ''}`}
          placeholder="Напишите содержание заметки..."
          disabled={isSubmitting || loading}
        />
        {errors.content && (
          <span className={styles.errorText}>{errors.content}</span>
        )}
      </div>

      <div className={styles.buttons}>
        <button
          type="button"
          className={`${styles.button} ${styles.cancelButton}`}
          onClick={onCancel}
          disabled={isSubmitting || loading}
        >
          Отмена
        </button>
        <button
          type="submit"
          className={`${styles.button} ${styles.submitButton}`}
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
};
