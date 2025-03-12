export type TaskStatus = 'pending' | 'done';

export interface Task {
  id: string;
  description: string;
  status: TaskStatus;
  completedDate?: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
} 