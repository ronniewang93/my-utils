import React, { KeyboardEvent } from 'react';
import { Column as ColumnType } from '../types';
import Task from './Task';

interface ColumnProps {
  col: ColumnType;
  newTaskInput: string;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onTitleChange: (newTitle: string) => void;
  onDelete: () => void;
  onNewTaskInputChange: (value: string) => void;
  onNewTaskKeyPress: (e: KeyboardEvent<HTMLInputElement>) => void;
  onTaskStatusChange: (taskId: string, checked: boolean) => void;
  onTaskDelete: (taskId: string) => void;
}

const Column: React.FC<ColumnProps> = ({
  col,
  newTaskInput,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onTitleChange,
  onDelete,
  onNewTaskInputChange,
  onNewTaskKeyPress,
  onTaskStatusChange,
  onTaskDelete,
}) => {
  return (
    <div
      className="col"
      draggable="true"
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="col-header">
        <input
          type="text"
          value={col.title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="col-title"
        />
        <button onClick={onDelete} className="delete-btn" aria-label="删除列">
          ×
        </button>
      </div>
      <div className="tasks">
        <div className="new-task-input-container">
          <input
            type="text"
            placeholder="输入任务描述，回车创建"
            value={newTaskInput}
            onChange={(e) => onNewTaskInputChange(e.target.value)}
            onKeyPress={onNewTaskKeyPress}
            className="new-task-input"
          />
        </div>
        {col.tasks
          .sort((a, b) => {
            if (a.status !== b.status) {
              return a.status === 'pending' ? -1 : 1;
            }
            if (a.status === 'done' && b.status === 'done') {
              const dateA = a.completedDate ? new Date(a.completedDate).getTime() : 0;
              const dateB = b.completedDate ? new Date(b.completedDate).getTime() : 0;
              return dateB - dateA;
            }
            return 0;
          })
          .map(task => (
            <Task
              key={task.id}
              task={task}
              onStatusChange={(checked: boolean) => onTaskStatusChange(task.id, checked)}
              onDelete={() => onTaskDelete(task.id)}
            />
          ))}
      </div>
    </div>
  );
};

export default Column; 