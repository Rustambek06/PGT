import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Note } from '../types';
import { api } from '../services/api';

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await api.notes.getAll();
        setNotes(data);
      } catch (err) {
        setError('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  if (loading) return <div className="loader" />;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <header className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-bold">My Notes</h2>
        <button className="btn btn-primary">+ New Note</button>
      </header>

      {notes.length === 0 ? (
        <div className="text-center text-[var(--text-secondary)] py-20">
          No notes found. Create one to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <motion.div
              key={note.id}
              whileHover={{ scale: 1.02 }}
              className="card flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-[var(--accent-green)]">{note.title}</h3>
                <span className="text-xs text-[var(--text-secondary)]">{note.date}</span>
              </div>
              <p className="text-[var(--text-secondary)] line-clamp-4 flex-1">
                {note.description}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default NotesPage;