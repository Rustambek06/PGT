export * from './Note';
export * from './Task';

// Re-export shared utilities and pagination
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
}

export interface UserRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email?: string;
}

// Calendar helper types
export type CalendarViewType = 'week' | 'day' | 'month' | 'year';

export interface CalendarState {
  viewType: CalendarViewType;
  year: number;
  month: number;
  week: number;
  selectedDate: Date;
}

// Delete Confirmation
export interface DeleteConfirmation {
  isOpen: boolean;
  itemId: number | null;
  itemName: string;
  itemType: 'note' | 'task' | 'user';
  onConfirm: () => void;
  onCancel: () => void;
}