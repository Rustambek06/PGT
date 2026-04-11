import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const features = [
    {
      icon: '🎯',
      title: t('home.features.habits.title'),
      description: t('home.features.habits.description'),
    },
    {
      icon: '🏆',
      title: t('home.features.goals.title'),
      description: t('home.features.goals.description'),
    },
    {
      icon: '📝',
      title: t('home.features.reflection.title'),
      description: t('home.features.reflection.description'),
    },
    {
      icon: '📅',
      title: t('home.features.calendar.title'),
      description: t('home.features.calendar.description'),
    },
  ];

  const testimonials = [
    {
      text: t('home.testimonials.testimonial1.text'),
      author: t('home.testimonials.testimonial1.author'),
    },
    {
      text: t('home.testimonials.testimonial2.text'),
      author: t('home.testimonials.testimonial2.author'),
    },
    {
      text: t('home.testimonials.testimonial3.text'),
      author: t('home.testimonials.testimonial3.author'),
    },
  ];

  const stats = [
    { number: t('home.stats.users'), label: 'активных пользователей' },
    { number: t('home.stats.habits'), label: 'отслеженных привычек' },
    { number: t('home.stats.goals'), label: 'достигнутых целей' },
    { number: t('home.stats.notes'), label: 'заметок о прогрессе' },
  ];

  return (
    <div className={styles.homePage}>
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

      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.heroTitle}>
            {t('home.hero.title')}
          </h1>
          <p className={styles.heroSubtitle}>
            {t('home.hero.subtitle')}
          </p>
          <div className={styles.heroButtons}>
            <Link to="/register" className={`${styles.button} ${styles.primaryButton}`}>
              {t('home.hero.getStarted')}
            </Link>
            <Link to="/login" className={`${styles.button} ${styles.secondaryButton}`}>
              {t('home.hero.signIn')}
            </Link>
          </div>
        </motion.div>
        <motion.div
          className={styles.heroImage}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className={styles.mockup}>
            <div className={styles.mockupScreen}>
              <div className={styles.mockupHeader}>
                <span>📚</span>
                <span>🏃‍♂️</span>
                <span>🧘‍♀️</span>
                <span>📈</span>
              </div>
              <div className={styles.mockupContent}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill}></div>
                  <span>Чтение: 7/7 дней</span>
                </div>
                <div className={styles.mockupNote}>
                  <h4>Сегодняшние достижения</h4>
                  <p>✅ Прочитал 30 страниц</p>
                  <p>✅ Пробежал 5 км</p>
                  <p>✅ 10 мин медитации</p>
                </div>
                <div className={styles.mockupCalendar}>
                  <div className={styles.calendarDay} data-active="true">15</div>
                  <div className={styles.calendarDay}>16</div>
                  <div className={styles.calendarDay} data-active="true">17</div>
                  <div className={styles.calendarDay}>18</div>
                  <div className={styles.calendarDay} data-active="true">19</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className={styles.statItem}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>
              {t('home.features.title')}
            </h2>
            <p className={styles.sectionDescription}>
              {t('home.features.description')}
            </p>
          </motion.div>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={styles.featureIcon}>
                  {feature.icon}
                </div>
                <h3 className={styles.featureTitle}>
                  {feature.title}
                </h3>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>
              {t('home.testimonials.title')}
            </h2>
          </motion.div>

          <div className={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className={styles.testimonialCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={styles.testimonialQuote}>
                  "{testimonial.text}"
                </div>
                <div className={styles.testimonialAuthor}>
                  {testimonial.author}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <motion.div
          className={styles.ctaContent}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.ctaTitle}>
            {t('home.cta.title')}
          </h2>
          <p className={styles.ctaDescription}>
            {t('home.cta.description')}
          </p>
          <Link to="/register" className={`${styles.button} ${styles.primaryButton}`}>
            {t('home.cta.button')}
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>
              🚀 Personal Growth Tracker
            </div>
            <div className={styles.footerLinks}>
              <Link to="/login">{t('home.footer.signIn')}</Link>
              <Link to="/register">{t('home.footer.signUp')}</Link>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>{t('home.footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;