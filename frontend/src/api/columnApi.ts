import axios from 'axios';
import { Column } from '../kanban/types';

const API_BASE_URL = 'http://localhost:8080/api';

interface ColumnDTO {
    id: string;
    title: string;
    order: number;
}

const convertToColumn = (dto: ColumnDTO): Column => ({
    id: dto.id,
    title: dto.title,
    tasks: []
});

export const columnApi = {
    getAllColumns: async (): Promise<Column[]> => {
        const response = await axios.get<ColumnDTO[]>(`${API_BASE_URL}/columns`);
        return response.data.map(convertToColumn);
    },

    createColumn: async (column: { id: string; title: string; order: number }): Promise<Column> => {
        const dto: ColumnDTO = {
            id: column.id,
            title: column.title,
            order: column.order
        };
        const response = await axios.post<ColumnDTO>(`${API_BASE_URL}/columns`, dto);
        return convertToColumn(response.data);
    },

    updateColumn: async (id: string, updates: { title: string }): Promise<void> => {
        const response = await axios.get<ColumnDTO[]>(`${API_BASE_URL}/columns`);
        const currentColumn = response.data.find(col => col.id === id);
        if (!currentColumn) {
            throw new Error('Column not found');
        }
        
        const dto: ColumnDTO = {
            id: id,
            title: updates.title,
            order: currentColumn.order
        };
        await axios.put(`${API_BASE_URL}/columns/${id}`, dto);
    },

    deleteColumn: async (id: string): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/columns/${id}`);
    }
}; 