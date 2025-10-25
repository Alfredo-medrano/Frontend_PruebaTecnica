import api from '@/lib/axios';
import { Task } from '@/types/task';

interface TaskPayload {
  title: string;
  // --- CORRECCIÓN AQUÍ ---
  description?: string | null; // <-- Añadimos '| null'
  is_completed?: boolean;
}

export const taskService = {
  // El resto del archivo queda exactamente igual...

  async getTasks(): Promise<Task[]> {
    const response = await api.get('/tasks');
    return response.data.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data;
  },

  async createTask(payload: { title: string; description: string }): Promise<Task> {
    const response = await api.post('/tasks', payload);
    return response.data.data;
  },

  async updateTask(id: string, payload: TaskPayload): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, payload);
    return response.data.data;
  },

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};