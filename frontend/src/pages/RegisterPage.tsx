import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import apiService from '../services/apiService';
import styles from './AuthPage.module.css';

const RegisterPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const alreadyLoggedIn = Boolean(localStorage.getItem('token'));
  const loggedInUserName = localStorage.getItem('userName') || '';

  const handleLogoutClear = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    window.location.reload();
  };

  const passwordStrength = (value: string) => {
    const lengthOk = value.length >= 8;
    const containsNumber = /\d/.test(value);
    const containsLetter = /[a-zA-Z]/.test(value);
    const containsSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    if (!lengthOk) return t('pages.registerPage.passwordTooShort');
    if (!containsNumber) return 'Add a number';
    if (!containsLetter) return 'Add a letter';
    if (!containsSpecial) return 'Add a special character (!@#$...)';
    return 'Strong';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const strength = passwordStrength(password);
    if (strength !== 'Strong') {
      setError(strength);
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.register(name.trim(), email.trim(), password);
      if (response.status === 200 || response.status === 201) {
        navigate('/login?info=' + encodeURIComponent(t('pages.registerPage.register')), { replace: true });
      } else {
        setError(t('pages.registerPage.registerError'));
      }
    } catch (err: any) {
      console.error('Register error:', err);
      const message = err?.response?.data?.message || err?.message || t('pages.registerPage.registerError');
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
        <h2 className={styles.authTitle}>{t('pages.registerPage.title')}</h2>
        <p className={styles.authDescription}>{t('pages.registerPage.register')}</p>

        {alreadyLoggedIn && (
          <div className={styles.infoBanner}>
            {t('pages.registerPage.alreadyLoggedIn', { name: loggedInUserName })}
            <button type="button" className={styles.authLinkButton} onClick={handleLogoutClear}>
              {t('common.logout')}
            </button>
          </div>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="name">
              {t('pages.registerPage.name')}
            </label>
            <div className={styles.inputRow}>
              <span className={styles.inputIcon}>👤</span>
              <input
                id="name"
                className={styles.textInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t('pages.registerPage.enterName')}
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
              {t('pages.registerPage.password')}
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
                placeholder={t('pages.registerPage.enterPassword')}
                autoComplete="new-password"
                minLength={8}
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

          <div className={styles.feedback}>{password ? passwordStrength(password) : t('pages.registerPage.passwordStrength')}</div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? t('common.loading') : t('pages.registerPage.register')}
          </button>
        </form>

        <div className={styles.helperLinks}>
          <Link to="/">🏠 {t('pages.registerPage.backHome', 'Вернуться на главную')}</Link>
          <span>{t('pages.registerPage.haveAccount')}</span>
          <Link to="/login">{t('pages.registerPage.login')}</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
