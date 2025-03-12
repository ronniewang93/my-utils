import React from 'react';
import { Task as TaskType } from '../types';

interface TaskProps {
  task: TaskType;
  onStatusChange: (checked: boolean) => void;
  onDelete: () => void;
}

const Task: React.FC<TaskProps> = ({ task, onStatusChange, onDelete }) => {
  return (
    <div className="task">
      <div className="task-content">
        <label className={`task-checkbox ${task.status === 'done' ? 'done' : ''}`}>
          <input
            type="checkbox"
            checked={task.status === 'done'}
            onChange={(e) => onStatusChange(e.target.checked)}
          />
          <span className={`task-description ${task.status === 'done' ? 'done' : ''}`}>
            {task.description}
          </span>
        </label>
        <button onClick={onDelete} className="delete-btn" aria-label="删除任务">
          ×
        </button>
      </div>
      {task.status === 'done' && task.completedDate && (
        <div className="completed-date">
          完成于: {task.completedDate}
        </div>
      )}
    </div>
  );
};

export default Task; 