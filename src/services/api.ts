import axios from 'axios';
import { format, parseISO, isBefore } from 'date-fns';
import { Task, TaskStats } from '../types';

// Mock API base URL - in a real app, this would be your actual API endpoint
const API_URL = 'https://jsonplaceholder.typicode.com';

// Mock data for tasks
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Write and review the Q2 project proposal document. Include timeline, budget, and resource allocation details.',
    status: 'pending',
    createdAt: '2023-06-15T10:00:00Z',
    dueDate: '2024-07-15T23:59:59Z',
  },
  {
    id: '2',
    title: 'Update website design',
    description: 'Redesign the homepage layout with improved user experience and modern design elements.',
    status: 'completed',
    createdAt: '2023-06-10T09:00:00Z',
    dueDate: '2024-07-10T23:59:59Z',
  },
  {
    id: '3',
    title: 'Client presentation',
    description: 'Prepare and deliver presentation to the new client about our services and capabilities.',
    status: 'pending',
    createdAt: '2023-06-01T14:00:00Z',
    dueDate: '2024-07-08T17:00:00Z',
  },
  {
    id: '4',
    title: 'Weekly team meeting',
    description: 'Conduct regular team meeting to discuss progress and blockers.',
    status: 'completed',
    createdAt: '2023-06-05T11:00:00Z',
    dueDate: '2024-07-05T15:00:00Z',
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all tasks with optional filtering
export const getTasks = async (status: string = 'all', searchQuery: string = '') => {
  try {
    // Simulate API call delay
    await delay(800);
    
    // In a real app, you would make an actual API call like:
    // const response = await axios.get(`${API_URL}/tasks`);
    
    let filteredTasks = [...MOCK_TASKS];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.description.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (status !== 'all') {
      const now = new Date();
      
      if (status === 'overdue') {
        filteredTasks = filteredTasks.filter(task => 
          task.status === 'pending' && isBefore(parseISO(task.dueDate), now)
        );
      } else {
        filteredTasks = filteredTasks.filter(task => task.status === status);
      }
    }
    
    return filteredTasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Get task statistics
export const getTaskStats = async (): Promise<TaskStats> => {
  try {
    // Simulate API call delay
    await delay(600);
    
    const allTasks = [...MOCK_TASKS];
    const now = new Date();
    
    const total = allTasks.length;
    const completed = allTasks.filter(task => task.status === 'completed').length;
    const pending = allTasks.filter(task => task.status === 'pending').length;
    const overdue = allTasks.filter(task => 
      task.status === 'pending' && isBefore(parseISO(task.dueDate), now)
    ).length;
    
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, pending, overdue, progress };
  } catch (error) {
    console.error('Error fetching task stats:', error);
    throw error;
  }
};

// Add a new task
export const addTask = async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
  try {
    // Simulate API call delay
    await delay(1000);
    
    // In a real app, you would post to the API:
    // const response = await axios.post(`${API_URL}/tasks`, task);
    
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    // In a real app, the response would come from the server
    // Here we're just simulating it
    return newTask;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
  try {
    // Simulate API call delay
    await delay(800);
    
    // In a real app, you would use:
    // const response = await axios.put(`${API_URL}/tasks/${taskId}`, updates);
    
    // Find the task in our mock data
    const taskIndex = MOCK_TASKS.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    // Apply updates
    const updatedTask = {
      ...MOCK_TASKS[taskIndex],
      ...updates,
    };
    
    // In a real app, the response would come from the server
    return updatedTask;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    // Simulate API call delay
    await delay(800);
    
    // In a real app, you would use:
    // await axios.delete(`${API_URL}/tasks/${taskId}`);
    
    // No response body is typically returned for successful delete operations
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Format a date for display
export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM d, yyyy');
};

// Check if a task is overdue
export const isTaskOverdue = (task: Task): boolean => {
  return task.status === 'pending' && isBefore(parseISO(task.dueDate), new Date());
};