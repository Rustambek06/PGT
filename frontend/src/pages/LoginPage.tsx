import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import apiService from '../services/apiService';
import styles from './AuthPage.module.css';

const LoginPage: React.FC = () => {
  const { t, i18n } = useTranslation();
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
      navigate('/', { replace: true });
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
        setError(t('pages.loginPage.loginError'));
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const message = err?.response?.data?.message || err?.message || t('pages.loginPage.loginError');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className={styles.authPage}>
      {/* Language Toggle */}
      <div className={styles.languageToggle}>
        <button
          onClick={() => handleLanguageChange('ru')}
          className={`${styles.languageButton} ${i18n.language === 'ru' ? styles.active : ''}`}
        >
          🇷🇺 РУ
        </button>
        <button
          onClick={() => handleLanguageChange('en')}
          className={`${styles.languageButton} ${i18n.language === 'en' ? styles.active : ''}`}
        >
          🇺🇸 EN
        </button>
      </div>

      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>{t('pages.loginPage.title')}</h2>
        <p className={styles.authDescription}>{t('pages.loginPage.email')} {t('pages.loginPage.password')}</p>

        {infoMessage && <div className={styles.feedback}>{infoMessage}</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="email">
              {t('pages.loginPage.email')}
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
              {t('pages.loginPage.password')}
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
                placeholder={t('pages.loginPage.enterPassword')}
                autoComplete="current-password"
                minLength={6}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? t('common.hide') : t('common.show')}
              >
                {showPassword ? t('common.hide') : t('common.show')}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? t('common.loading') : t('pages.loginPage.login')}
          </button>
        </form>

        <div className={styles.helperLinks}>
          <span>{t('pages.loginPage.noAccount')}</span>
          <Link to="/register">{t('pages.loginPage.register')}</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
