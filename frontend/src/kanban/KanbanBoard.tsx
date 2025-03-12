import React, { useState, KeyboardEvent } from 'react';
import { Column as ColumnType, Task, TaskStatus } from './types';
import Column from './components/Column';
import AddColumnButton from './components/AddColumnButton';
import './KanbanBoard.css';

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType[]>([
    { id: '1', title: '待办', tasks: [] },
    { id: '2', title: '已完成', tasks: [] },
  ]);

  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [newTaskInputs, setNewTaskInputs] = useState<{ [key: string]: string }>({});

  const addColumn = () => {
    const newColumn: ColumnType = {
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

  const handleTaskStatusChange = (columnId: string, taskId: string, checked: boolean) => {
    const newStatus: TaskStatus = checked ? 'done' : 'pending';
    const updates: Partial<Task> = {
      status: newStatus,
      completedDate: newStatus === 'done' ? new Date().toISOString().split('T')[0] : undefined
    };

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

  const handleTaskDelete = (columnId: string, taskId: string) => {
    setColumns(columns.map(column =>
      column.id === columnId
        ? { ...column, tasks: column.tasks.filter(task => task.id !== taskId) }
        : column
    ));
  };

  return (
    <div className="kanban-board">
      <div className="board-columns">
        {columns.map(column => (
          <Column
            key={column.id}
            column={column}
            newTaskInput={newTaskInputs[column.id] || ''}
            onDragStart={(e) => handleDragStart(e, column.id)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
            onTitleChange={(newTitle) => updateColumnTitle(column.id, newTitle)}
            onDelete={() => deleteColumn(column.id)}
            onNewTaskInputChange={(value) => handleNewTaskInputChange(column.id, value)}
            onNewTaskKeyPress={(e) => handleNewTaskKeyPress(e, column.id)}
            onTaskStatusChange={(taskId, checked) => handleTaskStatusChange(column.id, taskId, checked)}
            onTaskDelete={(taskId) => handleTaskDelete(column.id, taskId)}
          />
        ))}
        <AddColumnButton onClick={addColumn} />
      </div>
    </div>
  );
};

export default KanbanBoard; 