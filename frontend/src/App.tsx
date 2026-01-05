import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Notes from './pages/Notes';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main>
          <Routes>
            <Route path="/notes" element={<Notes />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/" element={<Notes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
