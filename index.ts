export interface Note {
  id: number;
  title: string;
  description: string;
  date: string; // ISO 8601 YYYY-MM-DD
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  date: string; // ISO 8601 YYYY-MM-DD
}