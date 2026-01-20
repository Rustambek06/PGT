export * from './Note';
export * from './Task';

import type { Note } from './Note';
import type { Task } from './Task';

// Types для календаря
export type CalendarViewType = 'week' | 'day' | 'month' | 'year';

export interface CalendarState {
  viewType: CalendarViewType;
  year: number;
  month: number;
  week: number;
  selectedDate: Date;
}

export interface DayItems {
  notes: Note[];
  tasks: Task[];
}