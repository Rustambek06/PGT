import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Task } from '../types';
import { tasksApi } from '../api';
import './Tasks.css';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await tasksApi.getAll();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <motion.div
      className="tasks-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Tasks</h1>
      <div className="tasks-list">
        {tasks.map(task => (
          <motion.div
            key={task.id}
            className="task-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3>{task.task}</h3>
            <p>{task.description}</p>
            <p>Due: {new Date(task.dueDate).toLocaleString()}</p>
            <p>Completed: {task.isCompleated ? 'Yes' : 'No'}</p>
            <small>{new Date(task.createdAt).toLocaleString()}</small>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Tasks;