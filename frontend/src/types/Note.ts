/**
 * Note interface - соответствует структуре Java Entity/DTO от бэкенда
 * - id: Уникальный идентификатор
 * - title: Заголовок заметки
 * - content: Основной текст
 * - category: Категория заметки (объект Category)
 * - createdAt: Дата создания (ISO 8601 format)
 */

export interface Category {
  id: number;
  name: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  category: Category;
  createdAt: string; // ISO 8601 date string, e.g., "2024-01-20T10:00:00"
}

export interface NoteRequest {
  title: string;
  content: string;
  categoryId?: number;
}