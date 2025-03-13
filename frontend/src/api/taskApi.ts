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

export const taskApi = {
    getAllTasks: async (): Promise<Task[]> => {
        const response = await axios.get(`${API_BASE_URL}/tasks`);
        return response.data.map((task: TaskDTO) => ({
            id: task.id!.toString(),
            description: task.description,
            status: task.status,
            completedDate: task.completedDate,
        }));
    },

    createTask: async (task: TaskDTO): Promise<Task> => {
        const response = await axios.post(`${API_BASE_URL}/tasks`, task);
        return {
            id: response.data.id.toString(),
            description: response.data.description,
            status: response.data.status,
            completedDate: response.data.completedDate,
        };
    },

    getTasksByColumnId: async (columnId: string): Promise<Task[]> => {
        const response = await axios.get(`${API_BASE_URL}/tasks/column/${columnId}`);
        return response.data.map((task: TaskDTO) => ({
            id: task.id!.toString(),
            description: task.description,
            status: task.status,
            completedDate: task.completedDate,
        }));
    },
}; 