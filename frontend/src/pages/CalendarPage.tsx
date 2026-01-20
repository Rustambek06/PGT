/**
 * Calendar Page
 * Отображает заметки и задачи в виде календаря (неделя, день, месяц, год)
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  eachDayOfInterval,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { useFetchNotes } from '../hooks/useFetchNotes';
import { useFetchTasks } from '../hooks/useFetchTasks';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';
import styles from './Calendar.module.css';
import type { Note, Task } from '../types';

type CalendarView = 'week' | 'day' | 'month' | 'year';

interface DayItems {
  notes: Note[];
  tasks: Task[];
}

const CalendarPage: React.FC = () => {
  const [view, setView] = useState<CalendarView>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const { notes, loading: notesLoading, error: notesError, refetch: refetchNotes } = useFetchNotes();
  const { tasks, loading: tasksLoading, error: tasksError, refetch: refetchTasks } = useFetchTasks();

  const isLoading = notesLoading || tasksLoading;
  const error = notesError || tasksError;

  // Функция для получения элементов по дате
  const getItemsForDate = (date: Date): DayItems => {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    return {
      notes: notes.filter((note) => {
        const noteDate = new Date(note.createdAt);
        return noteDate >= dayStart && noteDate <= dayEnd;
      }),
      tasks: tasks.filter((task) => {
        const taskDate = new Date(task.dueDate);
        return taskDate >= dayStart && taskDate <= dayEnd;
      }),
    };
  };

  // Получить дни для текущего представления
  const daysToDisplay = useMemo(() => {
    let start, end;
    switch (view) {
      case 'week':
        start = startOfWeek(currentDate, { weekStartsOn: 1 });
        end = endOfWeek(currentDate, { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
      case 'month':
        start = startOfMonth(currentDate);
        end = endOfMonth(currentDate);
        return eachDayOfInterval({ start, end });
      case 'day':
        return [currentDate];
      case 'year':
        return [];
      default:
        return [];
    }
  }, [view, currentDate]);

  const handlePrevPeriod = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'week':
        newDate.setDate(currentDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(currentDate.getMonth() - 1);
        break;
      case 'year':
        newDate.setFullYear(currentDate.getFullYear() - 1);
        break;
      case 'day':
        newDate.setDate(currentDate.getDate() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleNextPeriod = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'week':
        newDate.setDate(currentDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(currentDate.getMonth() + 1);
        break;
      case 'year':
        newDate.setFullYear(currentDate.getFullYear() + 1);
        break;
      case 'day':
        newDate.setDate(currentDate.getDate() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getViewTitle = () => {
    switch (view) {
      case 'week':
        return format(currentDate, 'MMMM yyyy');
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'year':
        return format(currentDate, 'yyyy');
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      default:
        return '';
    }
  };

  const renderWeekView = () => (
    <div className={styles.weekContainer}>
      <div className={styles.weekGrid}>
        {daysToDisplay.map((day) => {
          const items = getItemsForDate(day);
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

          return (
            <motion.div
              key={format(day, 'yyyy-MM-dd')}
              className={`${styles.dayColumn} ${isToday ? styles.today : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <div className={styles.dayHeader}>
                <h3 className={styles.dayName}>{format(day, 'EEE')}</h3>
                <span className={styles.dayDate}>{format(day, 'd')}</span>
              </div>

              <div className={styles.dayContent}>
                {items.notes.length === 0 && items.tasks.length === 0 ? (
                  <div className={styles.emptyDay}>No items</div>
                ) : (
                  <>
                    {items.notes.map((note) => (
                      <div key={`note-${note.id}`} className={styles.noteItem}>
                        <span className={styles.itemIcon}>📝</span>
                        <span className={styles.itemTitle}>{note.title}</span>
                      </div>
                    ))}
                    {items.tasks.map((task) => (
                      <div
                        key={`task-${task.id}`}
                        className={`${styles.taskItem} ${
                          task.isCompleated ? styles.completed : ''
                        }`}
                      >
                        <span className={styles.itemIcon}>
                          {task.isCompleated ? '✓' : '○'}
                        </span>
                        <span className={styles.itemTitle}>{task.task}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderDayView = () => {
    const items = getItemsForDate(currentDate);

    return (
      <div className={styles.dayViewContainer}>
        <div className={styles.dayViewContent}>
          <div className={styles.dayViewSection}>
            <h3 className={styles.sectionTitle}>📝 Notes</h3>
            {items.notes.length === 0 ? (
              <p className={styles.emptyMessage}>No notes for this day</p>
            ) : (
              <div className={styles.itemsList}>
                {items.notes.map((note) => (
                  <div key={`note-${note.id}`} className={styles.fullItem}>
                    <h4>{note.title}</h4>
                    <p>{note.content}</p>
                    {note.category && <span className={styles.category}>{note.category.name}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.dayViewSection}>
            <h3 className={styles.sectionTitle}>✓ Tasks</h3>
            {items.tasks.length === 0 ? (
              <p className={styles.emptyMessage}>No tasks for this day</p>
            ) : (
              <div className={styles.itemsList}>
                {items.tasks.map((task) => (
                  <div
                    key={`task-${task.id}`}
                    className={`${styles.fullItem} ${task.isCompleated ? styles.completed : ''}`}
                  >
                    <div className={styles.taskHeader}>
                      <h4>
                        {task.isCompleated ? '✓' : '○'} {task.task}
                      </h4>
                      <span className={styles.priority}>{task.priority}</span>
                    </div>
                    <p>{task.description}</p>
                    {task.category && (
                      <span className={styles.category}>{task.category.name}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderMonthView = () => (
    <div className={styles.monthContainer}>
      <div className={styles.monthGrid}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className={styles.monthHeader}>
            {day}
          </div>
        ))}
        {daysToDisplay.map((day) => {
          const items = getItemsForDate(day);
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();

          return (
            <motion.div
              key={format(day, 'yyyy-MM-dd')}
              className={`${styles.monthDay} ${!isCurrentMonth ? styles.otherMonth : ''} ${
                isToday ? styles.today : ''
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className={styles.monthDayNumber}>{format(day, 'd')}</div>
              <div className={styles.monthDayItems}>
                {items.notes.length > 0 && (
                  <span className={styles.itemCount}>📝 {items.notes.length}</span>
                )}
                {items.tasks.length > 0 && (
                  <span className={styles.itemCount}>✓ {items.tasks.length}</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderYearView = () => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const monthDate = new Date(currentDate.getFullYear(), i, 1);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

      let noteCount = 0;
      let taskCount = 0;

      monthDays.forEach((day) => {
        const items = getItemsForDate(day);
        noteCount += items.notes.length;
        taskCount += items.tasks.length;
      });

      return {
        date: monthDate,
        noteCount,
        taskCount,
      };
    });

    return (
      <div className={styles.yearContainer}>
        <div className={styles.yearGrid}>
          {months.map((month) => (
            <motion.div
              key={format(month.date, 'MM')}
              className={styles.monthCard}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.02 }}
            >
              <h3>{format(month.date, 'MMM')}</h3>
              <div className={styles.monthStats}>
                {month.noteCount > 0 && <span>📝 {month.noteCount}</span>}
                {month.taskCount > 0 && <span>✓ {month.taskCount}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className={styles.pageContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>📅 Calendar</h1>
        <p className={styles.pageDescription}>View your notes and tasks organized by date</p>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.viewSelector}>
          {(['week', 'day', 'month', 'year'] as CalendarView[]).map((v) => (
            <button
              key={v}
              className={`${styles.viewBtn} ${view === v ? styles.active : ''}`}
              onClick={() => setView(v)}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.navigation}>
          <button className={styles.navBtn} onClick={handlePrevPeriod} title="Previous">
            ← Prev
          </button>
          <span className={styles.dateDisplay}>{getViewTitle()}</span>
          <button className={styles.navBtn} onClick={handleNextPeriod} title="Next">
            Next →
          </button>
          <button className={styles.todayBtn} onClick={handleToday}>
            Today
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading && <Loader size="large" />}

      {error && <ErrorMessage message={error} onRetry={() => { refetchNotes(); refetchTasks(); }} />}

      {!isLoading && !error && (
        <AnimatePresence mode="wait">
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
          {view === 'month' && renderMonthView()}
          {view === 'year' && renderYearView()}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default CalendarPage;