import axios from 'axios';
import type { Note, Task, NoteRequest, TaskRequest } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export const notesApi = {
  getAll: () => api.get<Note[]>('/notes').then(res => res.data),
  create: (note: NoteRequest) => api.post<Note>('/notes', note).then(res => res.data),
  update: (id: number, note: NoteRequest) => api.put<Note>(`/notes/${id}`, note).then(res => res.data),
  delete: (id: number) => api.delete(`/notes/${id}`),
};

export const tasksApi = {
  getAll: () => api.get<Task[]>('/tasks').then(res => res.data),
  create: (task: TaskRequest) => api.post<Task>('/tasks', task).then(res => res.data),
  update: (id: number, task: TaskRequest) => api.put<Task>(`/tasks/${id}`, task).then(res => res.data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
};