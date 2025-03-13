import React, { useState, useEffect, KeyboardEvent } from 'react';
import { Column as ColumnType, Task, TaskStatus } from './types';
import Column from './components/Column';
import AddColumnButton from './components/AddColumnButton';
import { taskApi } from '../api/taskApi';
import { columnApi } from '../api/columnApi';
import './KanbanBoard.css';

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [newTaskInputs, setNewTaskInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadColumnsAndTasks();
  }, []);

  const loadColumnsAndTasks = async () => {
    try {
      const [columnsData, tasksData] = await Promise.all([
        columnApi.getAllColumns(),
        taskApi.getAllTasks()
      ]);

      const columnsWithTasks = columnsData.map((column: ColumnType) => ({
        ...column,
        tasks: tasksData.filter((task: Task) => task.columnId === column.id)
      }));

      setColumns(columnsWithTasks);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const addColumn = async () => {
    try {
      const newColumn = await columnApi.createColumn({
        id: Date.now().toString(),
        title: '新列',
        order: columns.length
      });

      setColumns(prevColumns => [...prevColumns, { ...newColumn, tasks: [] }]);
      setNewTaskInputs(prev => ({ ...prev, [newColumn.id]: '' }));
    } catch (error) {
      console.error('Failed to create column:', error);
    }
  };

  const deleteColumn = async (columnId: string) => {
    try {
      await columnApi.deleteColumn(columnId);
      setColumns(prevColumns => prevColumns.filter(column => column.id !== columnId));
      setNewTaskInputs(prev => {
        const updated = { ...prev };
        delete updated[columnId];
        return updated;
      });
    } catch (error) {
      console.error('Failed to delete column:', error);
    }
  };

  const updateColumnTitle = async (columnId: string, newTitle: string) => {
    try {
      await columnApi.updateColumn(columnId, { title: newTitle });
      setColumns(prevColumns => 
        prevColumns.map(column =>
          column.id === columnId ? { ...column, title: newTitle } : column
        )
      );
    } catch (error) {
      console.error('Failed to update column title:', error);
    }
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

  const handleNewTaskKeyPress = async (e: KeyboardEvent<HTMLInputElement>, columnId: string) => {
    if (e.key === 'Enter' && newTaskInputs[columnId].trim()) {
      try {
        const newTask = await taskApi.createTask({
          description: newTaskInputs[columnId].trim(),
          status: 'pending',
          columnId: columnId
        });

        setColumns(columns.map(column =>
          column.id === columnId
            ? { ...column, tasks: [...column.tasks, newTask] }
            : column
        ));
        setNewTaskInputs({ ...newTaskInputs, [columnId]: '' });
      } catch (error) {
        console.error('Failed to create task:', error);
        // 可以添加错误提示UI
      }
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
            col={column}
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