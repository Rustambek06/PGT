import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import NotesPage from './pages/NotesPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/notes" replace />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="calendar" element={<CalendarPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;