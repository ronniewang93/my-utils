export interface Task {
  id: string;
  description: string;
  status: 'pending' | 'done';
  completedDate?: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
} 