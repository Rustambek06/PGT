/**
 * Note Card Component
 * Premium note card with smooth interactions and line clamping
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
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    hover: {
      y: -6,
      transition: { duration: 0.2 },
    },
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      className={styles.card}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{note.title}</h3>
        {note.category && (
          <span className={styles.cardCategory}>
            {note.category.name || 'Uncategorized'}
          </span>
        )}
      </div>

      <p className={styles.cardContent}>{note.content}</p>

      <div className={styles.cardFooter}>
        <time className={styles.cardDate}>
          📅 {formatDate(note.createdAt)}
        </time>
      </div>
    </motion.div>
  );
};

export default NoteCard;