/**
 * Notes Page
 * Отображает все заметки с CRUD операциями и пагинацией
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useFetchNotes } from '../hooks/useFetchNotes';
import { Note, NoteRequest } from '../types';
import NoteCard from '../components/NoteCard';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';
import { Pagination } from '../components/Pagination';
import { Modal } from '../components/Modal';
import { NoteForm } from '../components/NoteForm';
import { DeleteConfirmation } from '../components/DeleteConfirmation';
import styles from './Pages.module.css';

const NotesPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    data,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  } = useFetchNotes();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    note: Note | null;
    loading: boolean;
  }>({
    isOpen: false,
    note: null,
    loading: false,
  });

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (formData: NoteRequest) => {
    try {
      await createNote(formData);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };

  const handleEditClick = (note: Note) => {
    setEditingNote(note);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (formData: NoteRequest) => {
    if (!editingNote) return;
    try {
      await updateNote(editingNote.id, formData);
      setIsEditModalOpen(false);
      setEditingNote(null);
    } catch (err) {
      console.error('Error updating note:', err);
    }
  };

  const handleDeleteClick = (note: Note) => {
    setDeleteConfirm({
      isOpen: true,
      note,
      loading: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.note) return;
    try {
      setDeleteConfirm((prev) => ({ ...prev, loading: true }));
      await deleteNote(deleteConfirm.note.id);
      setDeleteConfirm({ isOpen: false, note: null, loading: false });
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const handlePageChange = (page: number) => {
    fetchNotes(page);
  };

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

  if (loading && data.content.length === 0) {
    return <Loader />;
  }

  return (
    <motion.div
      className={styles.pageContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>
          📝 {t('pages.notesPage.title')} ({data.totalElements})
        </h1>
        <button className={styles.createButton} onClick={handleCreateClick}>
          ➕ {t('common.create')}
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {!error && (
        <>
          {data.content.length > 0 ? (
            <>
              <motion.div
                className={styles.grid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {data.content.map((note, index) => (
                  <div key={note.id} className={styles.cardWrapper}>
                    <NoteCard note={note} index={index} />
                    <div className={styles.cardActions}>
                      <button
                        className={`${styles.actionButton} ${styles.editAction}`}
                        onClick={() => handleEditClick(note)}
                        title="Edit note"
                      >
                        ✏️
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteAction}`}
                        onClick={() => handleDeleteClick(note)}
                        title="Delete note"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>

              {data.totalPages > 1 && (
                <Pagination
                  currentPage={data.number}
                  totalPages={data.totalPages}
                  totalElements={data.totalElements}
                  pageSize={data.size}
                  onPageChange={handlePageChange}
                  loading={loading}
                />
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>{t('pages.notesPage.noNotes')}</p>
            </div>
          )}
        </>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        title={`📝 ${t('pages.notesPage.newNote')}`}
        onClose={() => setIsCreateModalOpen(false)}
        size="lg"
      >
        <NoteForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateModalOpen(false)}
          loading={loading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen && editingNote !== null}
        title={`✏️ ${t('common.edit')}: ${editingNote?.title}`}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingNote(null);
        }}
        size="lg"
      >
        {editingNote && (
          <NoteForm
            initialData={editingNote}
            onSubmit={handleEditSubmit}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingNote(null);
            }}
            loading={loading}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={deleteConfirm.isOpen}
        itemName={deleteConfirm.note?.title || ''}
        itemType="note"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, note: null, loading: false })}
        loading={deleteConfirm.loading}
      />
    </motion.div>
  );
};

export default NotesPage;