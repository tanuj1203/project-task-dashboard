import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Task, TaskStatus } from '../types';
import { 
  getTasks, 
  getTaskStats, 
  addTask, 
  updateTask, 
  deleteTask 
} from '../services/api';
import StatCard from './StatCard';
import ProgressBar from './ProgressBar';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0, progress: 0 });
  const [activeFilter, setActiveFilter] = useState<TaskStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks based on active filter and search query
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTasks = await getTasks(activeFilter, searchQuery);
      setTasks(fetchedTasks);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch task statistics
  const fetchStats = async () => {
    try {
      setIsStatsLoading(true);
      const fetchedStats = await getTaskStats();
      setStats(fetchedStats);
    } catch (err) {
      console.error(err);
    } finally {
      setIsStatsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  // Reload tasks when filter or search changes
  useEffect(() => {
    fetchTasks();
  }, [activeFilter, searchQuery]);

  // Handle adding a new task
  const handleAddTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      setIsLoading(true);
      const newTask = await addTask(taskData);
      
      // In a real app with a real API, we'd refetch the tasks instead
      setTasks(prev => [...prev, newTask]);
      await fetchStats(); // Refresh stats
      
      setShowTaskForm(false);
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle updating a task
  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      setIsLoading(true);
      const updatedTask = await updateTask(taskId, updates);
      
      // Update the task in our local state
      setTasks(prev => 
        prev.map(task => task.id === taskId ? { ...task, ...updates } : task)
      );
      
      await fetchStats(); // Refresh stats
      setTaskToEdit(null);
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle completing a task
  const handleCompleteTask = async (taskId: string) => {
    try {
      await handleUpdateTask(taskId, { status: 'completed' });
    } catch (err) {
      setError('Failed to complete task. Please try again.');
      console.error(err);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId: string) => {
    try {
      setIsLoading(true);
      await deleteTask(taskId);
      
      // Remove the task from our local state
      setTasks(prev => prev.filter(task => task.id !== taskId));
      await fetchStats(); // Refresh stats
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editing a task
  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
  };

  // Filter options
  const filterOptions: { value: TaskStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">Task Management Dashboard</h1>
          <p className="text-center text-indigo-100 mb-6">Stay organized and boost your productivity</p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              title="Total Tasks" 
              value={isStatsLoading ? 0 : stats.total} 
              bgColorClass="bg-gradient-to-r from-pink-500 to-pink-400" 
            />
            <StatCard 
              title="Completed" 
              value={isStatsLoading ? 0 : stats.completed} 
              bgColorClass="bg-gradient-to-r from-blue-500 to-cyan-400" 
            />
            <StatCard 
              title="Pending" 
              value={isStatsLoading ? 0 : stats.pending} 
              bgColorClass="bg-gradient-to-r from-amber-500 to-orange-400" 
            />
            <StatCard 
              title="Overdue" 
              value={isStatsLoading ? 0 : stats.overdue} 
              bgColorClass="bg-gradient-to-r from-red-500 to-rose-400" 
            />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 -mt-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Progress Bar */}
          <ProgressBar 
            progress={isStatsLoading ? 0 : stats.progress} 
            label={`Overall Progress (${isStatsLoading ? 0 : stats.progress}%)`} 
          />
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-auto md:flex-grow md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex space-x-2 overflow-x-auto py-1">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setActiveFilter(option.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeFilter === option.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowTaskForm(true)}
              className="bg-indigo-600 text-white rounded-md px-4 py-2 flex items-center justify-center md:justify-start hover:bg-indigo-700 transition-colors"
            >
              <Plus size={18} className="mr-1" />
              <span>Add New Task</span>
            </button>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}
          
          {/* Task List */}
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            onCompleteTask={handleCompleteTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </main>
      
      {/* Task Form Modal */}
      {(showTaskForm || taskToEdit) && (
        <TaskForm
          onSubmit={taskToEdit 
            ? (data) => handleUpdateTask(taskToEdit.id, data) 
            : handleAddTask
          }
          onCancel={() => {
            setShowTaskForm(false);
            setTaskToEdit(null);
          }}
          initialData={taskToEdit || undefined}
          isEditing={!!taskToEdit}
        />
      )}
    </div>
  );
};

export default Dashboard;