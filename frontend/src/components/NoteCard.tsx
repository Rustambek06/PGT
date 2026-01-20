/**
 * Note Card Component
 * Отображает одну заметку в списке
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { Note } from '../types';
import styles from './NoteCard.module.css';

interface NoteCardProps {
  note: Note;
  index?: number;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, index = 0 }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.05,
        ease: 'easeOut',
      },
    },
    hover: {
      y: -4,
      boxShadow: '0 12px 24px rgba(255, 165, 0, 0.2)',
      transition: { duration: 0.2 },
    },
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      className={styles.noteCard}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{note.title}</h3>
        {note.category && (
          <span className={styles.category}>{note.category.name}</span>
        )}
      </div>

      <p className={styles.content}>{note.content}</p>

      <div className={styles.footer}>
        <time className={styles.date}>{formatDate(note.createdAt)}</time>
      </div>
    </motion.div>
  );
};

export default NoteCard;