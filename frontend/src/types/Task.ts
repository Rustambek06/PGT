/**
 * Task interface - соответствует структуре Java Entity/DTO от бэкенда
 * - id: Уникальный идентификатор
 * - task: Название задачи
 * - description: Описание
 * - status: Статус выполнения ('TODO', 'IN_PROGRESS', 'DONE' или другие)
 * - priority: Приоритет ('LOW', 'MEDIUM', 'HIGH' или другие)
 * - isCompleated: Завершена ли задача (опечатка в бэкенде: isCompleated вместо isCompleted)
 * - dueDate: Срок выполнения (ISO 8601 format)
 * - category: Категория задачи
 * - createdAt: Дата создания
 */

import type { Category } from './Note';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | string;
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | string;

export interface Task {
  id: number;
  task: string; // Название задачи
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  isCompleated: boolean; // Завершена (опечатка из бэкенда: isCompleated)
  dueDate: string; // ISO 8601 date string
  category: Category;
  createdAt: string; // ISO 8601 date string
}

export interface TaskRequest {
  task: string;
  description: string;
  status: string;
  priority: string;
  isCompleated: boolean;
  dueDate: string;
  categoryId?: number;
}