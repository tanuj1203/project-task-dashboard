import React, { useState } from 'react';
import { CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Task } from '../types';
import { formatDate, isTaskOverdue } from '../services/api';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onComplete, 
  onEdit, 
  onDelete 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isOverdue = isTaskOverdue(task);
  
  // Determine the status display
  let statusDisplay = null;
  if (task.status === 'completed') {
    statusDisplay = (
      <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-800">
        COMPLETED
      </span>
    );
  } else if (isOverdue) {
    statusDisplay = (
      <span className="text-xs font-semibold px-2 py-1 rounded bg-red-100 text-red-800">
        OVERDUE
      </span>
    );
  } else {
    statusDisplay = (
      <span className="text-xs font-semibold px-2 py-1 rounded bg-yellow-100 text-yellow-800">
        PENDING
      </span>
    );
  }

  // Determine the border color based on status
  let borderClass = "border-l-4 ";
  if (task.status === 'completed') {
    borderClass += "border-green-500";
  } else if (isOverdue) {
    borderClass += "border-red-500";
  } else {
    borderClass += "border-yellow-500";
  }

  return (
    <div className={`mb-4 p-4 bg-white rounded-lg shadow border ${borderClass} transition-all duration-200`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
          {task.title}
        </h3>
        <div className="flex-shrink-0">
          {statusDisplay}
        </div>
      </div>
      
      <p className={`text-sm mb-3 ${task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'}`}>
        {task.description}
      </p>
      
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {task.status === 'completed' ? 
            `Completed: ${formatDate(task.dueDate)}` : 
            `Due: ${formatDate(task.dueDate)}`
          }
        </div>
        
        <div className="flex space-x-2">
          {task.status !== 'completed' && (
            <button 
              onClick={() => onComplete(task.id)}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
              title="Mark as complete"
            >
              <CheckCircle size={18} />
            </button>
          )}
          
          <button 
            onClick={() => onEdit(task)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit task"
          >
            <Edit size={18} />
          </button>
          
          {!showDeleteConfirm ? (
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete task"
            >
              <Trash2 size={18} />
            </button>
          ) : (
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => onDelete(task.id)}
                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;