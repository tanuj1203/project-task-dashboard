export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  createdAt: string;
  dueDate: string;
}

export type TaskStatus = 'all' | 'pending' | 'completed' | 'overdue';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  progress: number;
}