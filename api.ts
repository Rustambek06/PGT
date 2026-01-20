import { Note, Task } from '../types';

// Assuming the backend runs on localhost:8080
const API_BASE = 'http://localhost:8080/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
};

export const api = {
  notes: {
    getAll: async (): Promise<Note[]> => {
      try {
        const res = await fetch(`${API_BASE}/notes`);
        return handleResponse(res);
      } catch (e) {
        console.error("Failed to fetch notes", e);
        // Return empty array or mock data if backend is offline for UI testing
        return []; 
      }
    },
    create: async (note: Omit<Note, 'id'>): Promise<Note> => {
      const res = await fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      });
      return handleResponse(res);
    }
  },
  tasks: {
    getAll: async (): Promise<Task[]> => {
      try {
        const res = await fetch(`${API_BASE}/tasks`);
        return handleResponse(res);
      } catch (e) {
        console.error("Failed to fetch tasks", e);
        return [];
      }
    },
    create: async (task: Omit<Task, 'id'>): Promise<Task> => {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      return handleResponse(res);
    }
  }
};