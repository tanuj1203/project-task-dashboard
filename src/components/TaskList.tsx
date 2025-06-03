import React from 'react';
import TaskCard from './TaskCard';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onCompleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  isLoading, 
  onCompleteTask, 
  onEditTask, 
  onDeleteTask 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-pulse flex flex-col space-y-4 w-full">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-24 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No tasks found. Create a new task to get started!</p>
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={onCompleteTask}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;