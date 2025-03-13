import axios from 'axios';
import { Task } from '../kanban/types';

const API_BASE_URL = 'http://localhost:8080/api';

export interface TaskDTO {
    id?: number;
    description: string;
    status: string;
    completedDate?: string;
    columnId: string;
}

const convertToTask = (taskDTO: TaskDTO): Task => ({
    id: taskDTO.id!.toString(),
    description: taskDTO.description,
    status: taskDTO.status as Task['status'],
    completedDate: taskDTO.completedDate,
    columnId: taskDTO.columnId,
});

export const taskApi = {
    getAllTasks: async (): Promise<Task[]> => {
        const response = await axios.get(`${API_BASE_URL}/tasks`);
        return response.data.map(convertToTask);
    },

    createTask: async (task: TaskDTO): Promise<Task> => {
        const response = await axios.post(`${API_BASE_URL}/tasks`, task);
        return convertToTask(response.data);
    },

    getTasksByColumnId: async (columnId: string): Promise<Task[]> => {
        const response = await axios.get(`${API_BASE_URL}/tasks/column/${columnId}`);
        return response.data.map(convertToTask);
    },
}; 