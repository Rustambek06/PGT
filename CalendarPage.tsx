import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, getWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { Note, Task } from '../types';

type ViewMode = 'Day' | 'Week' | 'Month' | 'Year';

const CalendarPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('Week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch data on mount
  useEffect(() => {
    Promise.all([api.notes.getAll(), api.tasks.getAll()]).then(([n, t]) => {
      setNotes(n);
      setTasks(t);
    });
  }, []);

  // Navigation Handlers
  const navigate = (direction: 'prev' | 'next') => {
    const amount = direction === 'next' ? 1 : -1;
    if (viewMode === 'Day') setCurrentDate(addDays(currentDate, amount));
    if (viewMode === 'Week') setCurrentDate(addWeeks(currentDate, amount));
    if (viewMode === 'Month') setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + amount)));
    if (viewMode === 'Year') setCurrentDate(new Date(currentDate.setFullYear(currentDate.getFullYear() + amount)));
  };

  // Data Helpers
  const getItemsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const daysNotes = notes.filter(n => n.date === dateStr);
    const daysTasks = tasks.filter(t => t.date === dateStr);
    return { daysNotes, daysTasks };
  };

  // --- Sub-Components for Views ---

  const DayView = () => {
    const { daysNotes, daysTasks } = getItemsForDate(currentDate);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-bold mb-4 text-[var(--accent-green)]">Notes</h3>
          {daysNotes.length === 0 && <p className="text-gray-500">No notes for today.</p>}
          {daysNotes.map(n => (
            <div key={n.id} className="mb-2 p-2 bg-white/5 rounded border-l-2 border-[var(--accent-green)]">
              {n.title}
            </div>
          ))}
        </div>
        <div className="card">
          <h3 className="text-xl font-bold mb-4 text-yellow-400">Tasks</h3>
          {daysTasks.length === 0 && <p className="text-gray-500">No tasks for today.</p>}
          {daysTasks.map(t => (
            <div key={t.id} className="mb-2 p-2 bg-white/5 rounded border-l-2 border-yellow-400">
              {t.title} <span className="text-xs opacity-50">({t.status})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const WeekView = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(start, i));

    return (
      <div className="grid grid-cols-7 gap-2 h-[600px] overflow-x-auto min-w-[800px]">
        {weekDays.map((day) => {
          const { daysNotes, daysTasks } = getItemsForDate(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div 
              key={day.toString()} 
              onClick={() => { setCurrentDate(day); setViewMode('Day'); }}
              className={`
                border border-[var(--border-color)] rounded-lg p-2 flex flex-col gap-2 cursor-pointer
                hover:bg-white/5 transition-colors
                ${isToday ? 'bg-white/5 border-[var(--accent-green)]' : ''}
              `}
            >
              <div className="text-center border-b border-white/10 pb-1 mb-1">
                <div className="text-xs text-[var(--text-secondary)]">{format(day, 'EEE')}</div>
                <div className={`font-bold ${isToday ? 'text-[var(--accent-green)]' : ''}`}>
                  {format(day, 'd')}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {daysNotes.map(n => (
                  <div key={n.id} className="text-[10px] bg-green-900/30 text-green-200 p-1 rounded mb-1 truncate">
                    {n.title}
                  </div>
                ))}
                {daysTasks.map(t => (
                  <div key={t.id} className="text-[10px] bg-yellow-900/30 text-yellow-200 p-1 rounded mb-1 truncate">
                    {t.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const MonthView = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });
    
    // Pad start to align with Monday
    const startDay = start.getDay(); // 0 is Sunday
    const padStart = startDay === 0 ? 6 : startDay - 1;

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} className="text-center text-sm text-[var(--text-secondary)] py-2">{d}</div>
        ))}
        {Array.from({ length: padStart }).map((_, i) => <div key={`pad-${i}`} />)}
        {days.map(day => {
          const { daysNotes, daysTasks } = getItemsForDate(day);
          const count = daysNotes.length + daysTasks.length;
          return (
            <div 
              key={day.toString()}
              onClick={() => { setCurrentDate(day); setViewMode('Day'); }}
              className="aspect-square border border-[var(--border-color)] rounded p-1 cursor-pointer hover:bg-white/5 relative"
            >
              <span className="text-sm">{format(day, 'd')}</span>
              {count > 0 && (
                <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-[var(--accent-green)]" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const YearView = () => {
    const months = Array.from({ length: 12 }).map((_, i) => new Date(currentDate.getFullYear(), i, 1));
    return (
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {months.map(month => (
          <button
            key={month.toString()}
            onClick={() => { setCurrentDate(month); setViewMode('Month'); }}
            className="p-4 border border-[var(--border-color)] rounded hover:bg-[var(--accent-gradient)] hover:text-black transition-colors"
          >
            {format(month, 'MMMM')}
          </button>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold w-48">
            {viewMode === 'Year' ? format(currentDate, 'yyyy') : format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-1">
            <button onClick={() => navigate('prev')} className="p-2 hover:bg-white/10 rounded"><ChevronLeft /></button>
            <button onClick={() => navigate('next')} className="p-2 hover:bg-white/10 rounded"><ChevronRight /></button>
          </div>
        </div>

        <div className="flex bg-[var(--bg-panel)] p-1 rounded-lg border border-[var(--border-color)]">
          {(['Day', 'Week', 'Month', 'Year'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`
                px-4 py-1.5 rounded-md text-sm font-medium transition-all
                ${viewMode === mode ? 'bg-[var(--accent-gradient)] text-black shadow' : 'text-[var(--text-secondary)] hover:text-white'}
              `}
            >
              {mode}
            </button>
          ))}
        </div>

        {viewMode === 'Week' && (
          <div className="text-sm text-[var(--text-secondary)]">
            Week {getWeek(currentDate)}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-[var(--bg-panel)] rounded-xl border border-[var(--border-color)] p-4 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode + currentDate.toString()}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {viewMode === 'Day' && <DayView />}
            {viewMode === 'Week' && <WeekView />}
            {viewMode === 'Month' && <MonthView />}
            {viewMode === 'Year' && <YearView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CalendarPage;