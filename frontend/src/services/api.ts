/**
 * API сервис для работы с бэкендом
 * Spring Boot приложение на порту 8080
 */

import apiService from './apiService';
import type { Note, Task, NoteRequest, TaskRequest } from '../types';

const pageSize = 12; // unify paginated fetch size

const getOrCreateDefaultCategory = async (): Promise<number> => {
  try {
    const response = await apiService.getPaginated<any>('/categories', 0, 1);
    const page = response.data;
    if (page?.content?.length > 0) {
      return page.content[0].id;
    }
    const created = await apiService.create<any>('/categories', { name: 'Uncategorized' });
    return created.data?.id ?? 1;
  } catch (err) {
    console.warn('Could not ensure default category, falling back to 1', err);
    return 1;
  }
};

// ==================== NOTES ====================

export const notesApi = {
  getAll: async (page = 0): Promise<Note[]> => {
    const response = await apiService.getPaginated<Note>('/notes', page, pageSize, 'createdAt,desc');
    return response.data.content;
  },

  getById: async (id: number): Promise<Note> => {
    const response = await apiService.getById<Note>('/notes', id);
    return response.data;
  },

  create: async (note: NoteRequest): Promise<Note> => {
    if (!note.categoryId) {
      note.categoryId = await getOrCreateDefaultCategory();
    }
    const response = await apiService.create<Note>('/notes', note);
    return response.data;
  },

  update: async (id: number, note: NoteRequest): Promise<Note> => {
    if (!note.categoryId) {
      note.categoryId = await getOrCreateDefaultCategory();
    }
    const response = await apiService.update<Note>('/notes', id, note);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiService.delete('/notes', id);
  },

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
  getAll: async (page = 0): Promise<Task[]> => {
    const response = await apiService.getPaginated<Task>('/tasks', page, pageSize, 'dueDate,asc');
    return response.data.content;
  },

  getById: async (id: number): Promise<Task> => {
    const response = await apiService.getById<Task>('/tasks', id);
    return response.data;
  },

  create: async (task: TaskRequest): Promise<Task> => {
    if (!task.categoryId) {
      task.categoryId = await getOrCreateDefaultCategory();
    }
    if (task.dueDate && /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate)) {
      task.dueDate = `${task.dueDate}T00:00:00`;
    }
    const response = await apiService.create<Task>('/tasks', task);
    return response.data;
  },

  update: async (id: number, task: TaskRequest): Promise<Task> => {
    if (!task.categoryId) {
      task.categoryId = await getOrCreateDefaultCategory();
    }
    if (task.dueDate && /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate)) {
      task.dueDate = `${task.dueDate}T00:00:00`;
    }
    const response = await apiService.update<Task>('/tasks', id, task);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiService.delete('/tasks', id);
  },

  filterByDateRange: async (startDate: Date, endDate: Date): Promise<Task[]> => {
    const allTasks = await tasksApi.getAll();
    return allTasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return dueDate >= startDate && dueDate <= endDate;
    });
  },

  filterByStatus: async (status: string): Promise<Task[]> => {
    const allTasks = await tasksApi.getAll();
    return allTasks.filter((task) => task.status === status);
  },
};
