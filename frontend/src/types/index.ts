export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: number;
  task: string;
  description: string;
  isCompleated: boolean;
  dueDate: string;
  createdAt: string;
}

export interface NoteRequest {
  title: string;
  content: string;
}

export interface TaskRequest {
  task: string;
  description: string;
  dueDate: string;
}