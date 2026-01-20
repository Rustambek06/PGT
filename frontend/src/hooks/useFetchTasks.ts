/**
 * Custom hook для получения и управления задачами
 */

import { useState, useEffect } from 'react';
import { tasksApi } from '../services/api';
import type { Task } from '../types';

interface UseFetchTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFetchTasks = (): UseFetchTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tasksApi.getAll();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
  };
};
