/**
 * Custom hook для получения и управления задачами с пагинацией
 */

import { useState, useCallback, useEffect } from 'react';
import { PageResponse, Task, TaskRequest } from '../types';
import apiService from '../services/apiService';

interface UseFetchTasksReturn {
  data: PageResponse<Task>;
  loading: boolean;
  error: string | null;
  fetchTasks: (page: number) => Promise<void>;
  createTask: (task: TaskRequest) => Promise<void>;
  updateTask: (id: number, task: TaskRequest) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

export const useFetchTasks = (): UseFetchTasksReturn => {
  const [data, setData] = useState<PageResponse<Task>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 12,
    first: true,
    last: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getPaginated<Task>(
        '/tasks',
        page,
        12,
        'dueDate,asc'
      );
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setData({
        content: [],
        totalElements: 0,
        totalPages: 0,
        number: 0,
        size: 12,
        first: true,
        last: true,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(
    async (task: TaskRequest) => {
      try {
        setError(null);
        await apiService.create('/tasks', task);
        await fetchTasks(0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create task');
        throw err;
      }
    },
    [fetchTasks]
  );

  const updateTask = useCallback(
    async (id: number, task: TaskRequest) => {
      try {
        setError(null);
        await apiService.update('/tasks', id, task);
        await fetchTasks(data.number);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update task');
        throw err;
      }
    },
    [fetchTasks, data.number]
  );

  const deleteTask = useCallback(
    async (id: number) => {
      try {
        setError(null);
        await apiService.delete('/tasks', id);
        await fetchTasks(data.number);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete task');
        throw err;
      }
    },
    [fetchTasks, data.number]
  );

  useEffect(() => {
    fetchTasks(0);
  }, [fetchTasks]);

  // Backwards-compatible fields used by CalendarPage (tasks, refetch)
  const tasks = data.content;
  const refetch = async () => fetchTasks(data.number);

  return {
    data,
    tasks,
    loading,
    error,
    fetchTasks,
    refetch,
    createTask,
    updateTask,
    deleteTask,
  } as unknown as UseFetchTasksReturn & { tasks: Task[]; refetch: () => Promise<void> };
};
