/**
 * Notes Page
 * Отображает все заметки с загрузкой данных с бэкенда
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useFetchNotes } from '../hooks/useFetchNotes';
import NoteCard from '../components/NoteCard';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import styles from './Pages.module.css';

const NotesPage: React.FC = () => {
  const { notes, loading, error, refetch } = useFetchNotes();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className={styles.pageContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>📝 Notes</h1>
        <p className={styles.subtitle}>
          All your notes in one place. Create, edit, and manage your thoughts.
        </p>
      </div>

      {loading && <Loader size="large" />}

      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {!loading && !error && (
        <>
          {notes.length > 0 ? (
            <motion.div
              className={styles.grid}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {notes.map((note, index) => (
                <NoteCard key={note.id} note={note} index={index} />
              ))}
            </motion.div>
          ) : (
            <EmptyState
              icon="📭"
              title="No notes yet"
              description="Start creating your first note to get started!"
            />
          )}
        </>
      )}
    </motion.div>
  );
};

export default NotesPage;