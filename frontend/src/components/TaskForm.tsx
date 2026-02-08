import React from 'react';
import styles from './UserForm.module.css';
import { TaskRequest, Task } from '../types';

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
  const [formData, setFormData] = React.useState<TaskRequest>({
    task: initialData?.task || '',
    description: initialData?.description || '',
    status: initialData?.status || 'TODO',
    priority: initialData?.priority || 'MEDIUM',
    dueDate: initialData?.dueDate || '',
    isCompleated: initialData?.isCompleated || false,
  });
  const [errors, setErrors] = React.useState<Partial<TaskRequest>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateForm = () => {
    const newErrors: Partial<TaskRequest> = {};

    if (!formData.task || !formData.task.trim()) {
      newErrors.task = 'Название требуется';
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
      // keep boolean for checkbox, otherwise assign string
      [name]: (e.target as HTMLInputElement).type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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
          Название
        </label>
        <input
          type="text"
          id="task"
          name="task"
          value={formData.task}
          onChange={handleChange}
          className={`${styles.input} ${errors.task ? styles.error : ''}`}
          placeholder="Введите название задачи"
          disabled={isSubmitting || loading}
        />
        {errors.task && (
          <span className={styles.errorText}>{errors.task}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Описание
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Опишите задачу (опционально)"
          disabled={isSubmitting || loading}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="priority" className={styles.label}>
          Приоритет
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority || 'MEDIUM'}
          onChange={handleChange}
          className={styles.input}
          disabled={isSubmitting || loading}
        >
          <option value="LOW">Низкий</option>
          <option value="MEDIUM">Средний</option>
          <option value="HIGH">Высокий</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="status" className={styles.label}>
          Статус
        </label>
        <select
          id="status"
          name="status"
          value={formData.status || 'TODO'}
          onChange={handleChange}
          className={styles.input}
          disabled={isSubmitting || loading}
        >
          <option value="TODO">В ожидании</option>
          <option value="IN_PROGRESS">В процессе</option>
          <option value="DONE">Завершено</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="dueDate" className={styles.label}>
          Срок
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
