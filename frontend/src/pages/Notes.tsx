import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Note } from '../types';
import { notesApi } from '../api';
import './Notes.css';

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await notesApi.getAll();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <motion.div
      className="notes-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Notes</h1>
      <div className="notes-list">
        {notes.map(note => (
          <motion.div
            key={note.id}
            className="note-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <small>{new Date(note.createdAt).toLocaleString()}</small>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Notes;