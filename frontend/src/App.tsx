/**
 * Main App Component
 * Маршрутизация между страницами Notes, Tasks и Calendar
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './components/MainLayout';
import NotesPage from './pages/NotesPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import { UsersPage } from './pages/UsersPage';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Navigate to="/notes" replace />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </AnimatePresence>
      </MainLayout>
    </Router>
  );
};

export default App;