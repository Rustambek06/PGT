import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Task } from '../types';
import { api } from '../services/api';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await api.tasks.getAll();
        setTasks(data);
      } catch (err) {
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'HIGH': return 'text-red-400';
      case 'MEDIUM': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

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
        <h2 className="text-3xl font-bold">Tasks</h2>
        <button className="btn btn-primary">+ New Task</button>
      </header>

      {tasks.length === 0 ? (
        <div className="text-center text-[var(--text-secondary)] py-20">
          No tasks pending. Good job!
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${task.status === 'COMPLETED' ? 'bg-green-500' : 'bg-gray-500'}`} />
                <div>
                  <h3 className={`font-semibold ${task.status === 'COMPLETED' ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </h3>
                  <div className="flex gap-3 text-xs mt-1">
                    <span className="text-[var(--text-secondary)]">{task.date}</span>
                    <span className={`font-bold ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-sm px-3 py-1 rounded bg-white/5 border border-white/10">
                {task.status}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TasksPage;