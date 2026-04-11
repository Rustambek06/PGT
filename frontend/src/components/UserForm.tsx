import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './UserForm.module.css';
import { User, UserRequest } from '../types';

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: UserRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = React.useState<UserRequest>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: '',
  });
  const [errors, setErrors] = React.useState<Partial<UserRequest>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateForm = () => {
    const newErrors: Partial<UserRequest> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('forms.userForm.nameRequired');
    }
    if (!formData.email.trim()) {
      newErrors.email = t('forms.userForm.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('forms.userForm.emailRequired');
    }
    if (!formData.password.trim()) {
      newErrors.password = t('forms.userForm.passwordRequired');
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
      setFormData({ name: '', email: '', password: '' });
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
    if (errors[name as keyof UserRequest]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          {t('forms.userForm.name')}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`${styles.input} ${errors.name ? styles.error : ''}`}
          placeholder={t('forms.userForm.enterName')}
          disabled={isSubmitting || loading}
        />
        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          {t('forms.userForm.email')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`${styles.input} ${errors.email ? styles.error : ''}`}
          placeholder={t('forms.userForm.enterEmail')}
          disabled={isSubmitting || loading}
        />
        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          {t('forms.userForm.password')}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`${styles.input} ${errors.password ? styles.error : ''}`}
          placeholder={t('forms.userForm.enterPassword')}
          disabled={isSubmitting || loading}
        />
        {errors.password && (
          <span className={styles.errorText}>{errors.password}</span>
        )}
      </div>

      <div className={styles.buttons}>
        <button
          type="button"
          className={`${styles.button} ${styles.cancelButton}`}
          onClick={onCancel}
          disabled={isSubmitting || loading}
        >
          {t('forms.userForm.cancel')}
        </button>
        <button
          type="submit"
          className={`${styles.button} ${styles.submitButton}`}
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? t('forms.userForm.saving') : t('forms.userForm.save')}
        </button>
      </div>
    </form>
  );
};
