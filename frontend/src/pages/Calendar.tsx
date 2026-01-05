import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, addDays, addWeeks, startOfMonth, addMonths, startOfYear, addYears, eachDayOfInterval, endOfMonth, endOfWeek } from 'date-fns';
import type { Note, Task } from '../types';
import { notesApi, tasksApi } from '../api';
import './Calendar.css';

type ViewMode = 'week' | 'month' | 'year';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notesData, tasksData] = await Promise.all([
        notesApi.getAll(),
        tasksApi.getAll(),
      ]);
      setNotes(notesData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getItemsForDay = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayNotes = notes.filter(note => format(new Date(note.createdAt), 'yyyy-MM-dd') === dayStr);
    const dayTasks = tasks.filter(task => task.dueDate && format(new Date(task.dueDate), 'yyyy-MM-dd') === dayStr);
    return { notes: dayNotes, tasks: dayTasks };
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (viewMode === 'week') {
      setCurrentDate(prev => addWeeks(prev, direction === 'next' ? 1 : -1));
    } else if (viewMode === 'month') {
      setCurrentDate(prev => addMonths(prev, direction === 'next' ? 1 : -1));
    } else if (viewMode === 'year') {
      setCurrentDate(prev => addYears(prev, direction === 'next' ? 1 : -1));
    }
    setSelectedDay(null);
  };

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
      <div className="week-view">
        {weekDays.map(day => {
          const { notes: dayNotes, tasks: dayTasks } = getItemsForDay(day);
          return (
            <motion.div
              key={day.toISOString()}
              className={`day-column ${selectedDay && format(selectedDay, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') ? 'selected' : ''}`}
              onClick={() => handleDayClick(day)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3>{format(day, 'EEE d')}</h3>
              <div className="day-items">
                {dayNotes.map(note => (
                  <div key={note.id} className="item note">
                    <strong>Note:</strong> {note.title}
                  </div>
                ))}
                {dayTasks.map(task => (
                  <div key={task.id} className="item task">
                    <strong>Task:</strong> {task.task}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const monthDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="month-view">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="month-header">{day}</div>
        ))}
        {monthDays.map(day => {
          const { notes: dayNotes, tasks: dayTasks } = getItemsForDay(day);
          const isCurrentMonth = format(day, 'MM') === format(currentDate, 'MM');
          return (
            <motion.div
              key={day.toISOString()}
              className={`month-day ${!isCurrentMonth ? 'other-month' : ''} ${selectedDay && format(selectedDay, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') ? 'selected' : ''}`}
              onClick={() => handleDayClick(day)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="day-number">{format(day, 'd')}</div>
              <div className="day-items">
                {dayNotes.slice(0, 2).map(note => (
                  <div key={note.id} className="item note">N</div>
                ))}
                {dayTasks.slice(0, 2).map(task => (
                  <div key={task.id} className="item task">T</div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderYearView = () => {
    const yearStart = startOfYear(currentDate);
    const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));

    return (
      <div className="year-view">
        {months.map(month => {
          const monthNotes = notes.filter(note => format(new Date(note.createdAt), 'yyyy-MM') === format(month, 'yyyy-MM'));
          const monthTasks = tasks.filter(task => task.dueDate && format(new Date(task.dueDate), 'yyyy-MM') === format(month, 'yyyy-MM'));

          return (
            <motion.div
              key={month.toISOString()}
              className="year-month"
              onClick={() => {
                setCurrentDate(month);
                setViewMode('month');
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h4>{format(month, 'MMM')}</h4>
              <div className="month-summary">
                <div>Notes: {monthNotes.length}</div>
                <div>Tasks: {monthTasks.length}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <motion.div
      className="calendar-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Calendar</h1>
      <div className="calendar-controls">
        <div className="view-modes">
          <button onClick={() => setViewMode('week')} className={viewMode === 'week' ? 'active' : ''}>Week</button>
          <button onClick={() => setViewMode('month')} className={viewMode === 'month' ? 'active' : ''}>Month</button>
          <button onClick={() => setViewMode('year')} className={viewMode === 'year' ? 'active' : ''}>Year</button>
        </div>
        <div className="navigation">
          <button onClick={() => handleNavigation('prev')}>Previous</button>
          <span>
            {viewMode === 'week' && `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMMM d, yyyy')}`}
            {viewMode === 'month' && format(currentDate, 'MMMM yyyy')}
            {viewMode === 'year' && format(currentDate, 'yyyy')}
          </span>
          <button onClick={() => handleNavigation('next')}>Next</button>
        </div>
      </div>
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'year' && renderYearView()}
      {selectedDay && (
        <motion.div
          className="day-detail"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2>{format(selectedDay, 'EEEE, MMMM d, yyyy')}</h2>
          <div className="detail-items">
            <div className="notes-section">
              <h3>Notes</h3>
              {getItemsForDay(selectedDay).notes.map(note => (
                <div key={note.id} className="detail-item">
                  <h4>{note.title}</h4>
                  <p>{note.content}</p>
                  <small>{format(new Date(note.createdAt), 'HH:mm')}</small>
                </div>
              ))}
            </div>
            <div className="tasks-section">
              <h3>Tasks</h3>
              {getItemsForDay(selectedDay).tasks.map(task => (
                <div key={task.id} className="detail-item">
                  <h4>{task.task}</h4>
                  <p>{task.description}</p>
                  <p>Due: {format(new Date(task.dueDate), 'HH:mm')}</p>
                  <p>Completed: {task.isCompleated ? 'Yes' : 'No'}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Calendar;