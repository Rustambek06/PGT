import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import apiService from '../services/apiService';
import styles from './AuthPage.module.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/notes';

  const infoMessage = new URLSearchParams(location.search).get('info');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/notes', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.login(email.trim(), password);
      if (response.token) {
        console.log('Token saved:', localStorage.getItem('token'));
        // Dispatch custom event to update sidebar immediately
        window.dispatchEvent(new Event('userLogin'));
        navigate(from, { replace: true });
      } else {
        setError('Не удалось войти: неверный ответ сервера.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      alert(JSON.stringify(err.response?.data || err.message));
      const message = err?.response?.data?.message || err?.message || 'Ошибка входа';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Вход</h2>
        <p className={styles.authDescription}>Используйте email и пароль для входа в Tracker</p>

        {infoMessage && <div className={styles.feedback}>{infoMessage}</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
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
                placeholder="Введите пароль"
                autoComplete="current-password"
                minLength={6}
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

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>

        <div className={styles.helperLinks}>
          <span>Нет аккаунта?</span>
          <Link to="/register">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
