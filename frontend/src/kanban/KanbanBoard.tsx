import React, { useState, KeyboardEvent } from 'react';
import { Column, Task } from './types';
import './KanbanBoard.css';

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([
    { id: '1', title: '待办', tasks: [] },
    { id: '2', title: '已完成', tasks: [] },
  ]);

  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [newTaskInputs, setNewTaskInputs] = useState<{ [key: string]: string }>({});

  const addColumn = () => {
    const newColumn: Column = {
      id: Date.now().toString(),
      title: '新列',
      tasks: [],
    };
    setColumns([...columns, newColumn]);
    setNewTaskInputs({ ...newTaskInputs, [newColumn.id]: '' });
  };

  const deleteColumn = (columnId: string) => {
    setColumns(columns.filter(column => column.id !== columnId));
    const updatedInputs = { ...newTaskInputs };
    delete updatedInputs[columnId];
    setNewTaskInputs(updatedInputs);
  };

  const updateColumnTitle = (columnId: string, newTitle: string) => {
    setColumns(columns.map(column =>
      column.id === columnId ? { ...column, title: newTitle } : column
    ));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
    setDraggedColumnId(columnId);
    e.currentTarget.classList.add('dragging');
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('dragging');
    setDraggedColumnId(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    
    if (!draggedColumnId || draggedColumnId === targetColumnId) {
      return;
    }

    const draggedColumnIndex = columns.findIndex(col => col.id === draggedColumnId);
    const targetColumnIndex = columns.findIndex(col => col.id === targetColumnId);
    
    if (draggedColumnIndex === -1 || targetColumnIndex === -1) {
      return;
    }

    const newColumns = [...columns];
    const [draggedColumn] = newColumns.splice(draggedColumnIndex, 1);
    newColumns.splice(targetColumnIndex, 0, draggedColumn);
    
    setColumns(newColumns);
  };

  const handleNewTaskInputChange = (columnId: string, value: string) => {
    setNewTaskInputs({ ...newTaskInputs, [columnId]: value });
  };

  const handleNewTaskKeyPress = (e: KeyboardEvent<HTMLInputElement>, columnId: string) => {
    if (e.key === 'Enter' && newTaskInputs[columnId].trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        description: newTaskInputs[columnId].trim(),
        status: 'pending',
      };

      setColumns(columns.map(column =>
        column.id === columnId
          ? { ...column, tasks: [...column.tasks, newTask] }
          : column
      ));
      setNewTaskInputs({ ...newTaskInputs, [columnId]: '' });
    }
  };

  const updateTask = (columnId: string, taskId: string, updates: Partial<Task>) => {
    setColumns(columns.map(column =>
      column.id === columnId
        ? {
            ...column,
            tasks: column.tasks.map(task =>
              task.id === taskId ? { ...task, ...updates } : task
            ),
          }
        : column
    ));
  };

  const deleteTask = (columnId: string, taskId: string) => {
    setColumns(columns.map(column =>
      column.id === columnId
        ? { ...column, tasks: column.tasks.filter(task => task.id !== taskId) }
        : column
    ));
  };

  return (
    <div className="kanban-board">
      <div className="board-header">
        <h2>看板</h2>
        <button onClick={addColumn} className="add-column-btn">添加新列</button>
      </div>
      <div className="board-columns">
        {columns.map(column => (
          <div
            key={column.id}
            className="column"
            draggable="true"
            onDragStart={(e) => handleDragStart(e, column.id)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="column-header">
              <input
                type="text"
                value={column.title}
                onChange={(e) => updateColumnTitle(column.id, e.target.value)}
                className="column-title"
              />
              <button onClick={() => deleteColumn(column.id)} className="delete-btn" aria-label="删除列">
                ×
              </button>
            </div>
            <div className="tasks">
              <div className="new-task-input-container">
                <input
                  type="text"
                  placeholder="输入任务描述，回车创建"
                  value={newTaskInputs[column.id] || ''}
                  onChange={(e) => handleNewTaskInputChange(column.id, e.target.value)}
                  onKeyPress={(e) => handleNewTaskKeyPress(e, column.id)}
                  className="new-task-input"
                />
              </div>
              {column.tasks
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
                <div key={task.id} className="task">
                  <div className="task-content">
                    <label className={`task-checkbox ${task.status === 'done' ? 'done' : ''}`}>
                      <input
                        type="checkbox"
                        checked={task.status === 'done'}
                        onChange={(e) => {
                          const newStatus = e.target.checked ? 'done' : 'pending';
                          const updates: Partial<Task> = {
                            status: newStatus,
                            completedDate: newStatus === 'done' ? new Date().toISOString().split('T')[0] : undefined
                          };
                          updateTask(column.id, task.id, updates);
                        }}
                      />
                      <span className={`task-description ${task.status === 'done' ? 'done' : ''}`}>
                        {task.description}
                      </span>
                    </label>
                    <button onClick={() => deleteTask(column.id, task.id)} className="delete-btn" aria-label="删除任务">
                      ×
                    </button>
                  </div>
                  {task.status === 'done' && task.completedDate && (
                    <div className="completed-date">
                      完成于: {task.completedDate}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard; 