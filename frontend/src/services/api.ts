/**
 * API сервис для работы с бэкендом
 * Spring Boot приложение на порту 8080
 */

import axios from 'axios';
import type { Note, Task, NoteRequest, TaskRequest } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== NOTES ====================

export const notesApi = {
  /**
   * Получить все заметки с бэкенда
   */
  getAll: async (): Promise<Note[]> => {
    try {
      const response = await axiosInstance.get<Note[]>('/notes');
      return response.data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw new Error('Failed to fetch notes');
    }
  },

  /**
   * Получить заметку по ID
   */
  getById: async (id: number): Promise<Note> => {
    try {
      const response = await axiosInstance.get<Note>(`/notes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching note ${id}:`, error);
      throw new Error(`Failed to fetch note with id ${id}`);
    }
  },

  /**
   * Создать новую заметку
   */
  create: async (note: NoteRequest): Promise<Note> => {
    try {
      const response = await axiosInstance.post<Note>('/notes', note);
      return response.data;
    } catch (error) {
      console.error('Error creating note:', error);
      throw new Error('Failed to create note');
    }
  },

  /**
   * Обновить заметку
   */
  update: async (id: number, note: NoteRequest): Promise<Note> => {
    try {
      const response = await axiosInstance.put<Note>(`/notes/${id}`, note);
      return response.data;
    } catch (error) {
      console.error(`Error updating note ${id}:`, error);
      throw new Error('Failed to update note');
    }
  },

  /**
   * Удалить заметку
   */
  delete: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/notes/${id}`);
    } catch (error) {
      console.error(`Error deleting note ${id}:`, error);
      throw new Error('Failed to delete note');
    }
  },

  /**
   * Фильтровать заметки по дате (на клиенте, так как API не поддерживает query параметры)
   */
  filterByDateRange: async (startDate: Date, endDate: Date): Promise<Note[]> => {
    const allNotes = await notesApi.getAll();
    return allNotes.filter((note) => {
      const noteDate = new Date(note.createdAt);
      return noteDate >= startDate && noteDate <= endDate;
    });
  },
};

// ==================== TASKS ====================

export const tasksApi = {
  /**
   * Получить все задачи с бэкенда
   */
  getAll: async (): Promise<Task[]> => {
    try {
      const response = await axiosInstance.get<Task[]>('/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  },

  /**
   * Получить задачу по ID
   */
  getById: async (id: number): Promise<Task> => {
    try {
      const response = await axiosInstance.get<Task>(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw new Error(`Failed to fetch task with id ${id}`);
    }
  },

  /**
   * Создать новую задачу
   */
  create: async (task: TaskRequest): Promise<Task> => {
    try {
      const response = await axiosInstance.post<Task>('/tasks', task);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  },

  /**
   * Обновить задачу
   */
  update: async (id: number, task: TaskRequest): Promise<Task> => {
    try {
      const response = await axiosInstance.put<Task>(`/tasks/${id}`, task);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw new Error('Failed to update task');
    }
  },

  /**
   * Удалить задачу
   */
  delete: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/tasks/${id}`);
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw new Error('Failed to delete task');
    }
  },

  /**
   * Фильтровать задачи по дате выполнения (на клиенте)
   */
  filterByDateRange: async (startDate: Date, endDate: Date): Promise<Task[]> => {
    const allTasks = await tasksApi.getAll();
    return allTasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return dueDate >= startDate && dueDate <= endDate;
    });
  },

  /**
   * Фильтровать задачи по статусу
   */
  filterByStatus: async (status: string): Promise<Task[]> => {
    const allTasks = await tasksApi.getAll();
    return allTasks.filter((task) => task.status === status);
  },
};
