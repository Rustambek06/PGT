import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import styles from './AuthPage.module.css';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/notes', { replace: true });
    }
  }, [navigate]);

  const passwordStrength = (value: string) => {
    const lengthOk = value.length >= 8;
    const containsNumber = /\d/.test(value);
    const containsLetter = /[a-zA-Z]/.test(value);
    const containsSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    if (!lengthOk) return 'Минимум 8 символов';
    if (!containsNumber) return 'Добавьте хотя бы одну цифру';
    if (!containsLetter) return 'Добавьте хотя бы одну букву';
    if (!containsSpecial) return 'Добавьте спецсимвол (!@#$...)';
    return 'Надёжный пароль';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const strength = passwordStrength(password);
    if (strength !== 'Надёжный пароль') {
      setError(strength);
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.register(name.trim(), email.trim(), password);
      if (response.status === 200 || response.status === 201) {
        navigate('/login?info=' + encodeURIComponent('Аккаунт создан! Теперь войдите'), { replace: true });
      } else {
        setError('Не удалось зарегистрироваться');
      }
    } catch (err: any) {
      console.error('Register error:', err);
      alert(JSON.stringify(err.response?.data || err.message));
      const message = err?.response?.data?.message || err?.message || 'Ошибка регистрации';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Регистрация</h2>
        <p className={styles.authDescription}>Создайте новый аккаунт, чтобы вести трекер</p>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="name">
              Имя
            </label>
            <div className={styles.inputRow}>
              <span className={styles.inputIcon}>👤</span>
              <input
                id="name"
                className={styles.textInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ваше имя"
                autoComplete="name"
                minLength={2}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="email">
              Email
            </label>
            <div className={styles.inputRow}>
              <span className={styles.inputIcon}>📧</span>
              <input
                id="email"
                className={styles.textInput}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@domain.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="password">
              Пароль
            </label>
            <div className={styles.inputRow}>
              <span className={styles.inputIcon}>🔒</span>
              <input
                id="password"
                className={styles.textInput}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Пароль"
                autoComplete="new-password"
                minLength={8}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showPassword ? 'Скрыть' : 'Показать'}
              </button>
            </div>
          </div>

          <div className={styles.feedback}>{password ? passwordStrength(password) : 'Пароль должен быть сложным'}</div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Создаем...' : 'Создать аккаунт'}
          </button>
        </form>

        <div className={styles.helperLinks}>
          <span>Уже есть аккаунт?</span>
          <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
