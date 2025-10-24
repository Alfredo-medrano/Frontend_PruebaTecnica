import api from '@/lib/axios';
import { Task } from '@/types/task';

interface TaskPayload {
  title: string;
  description?: string;
  is_completed?: boolean;
}

export const taskService = {
  async getTasks(id?: string): Promise<Task[]> {
    const endpoint = id ? `/tasks?id=${id}` : '/tasks';
    const response = await api.get(endpoint);
    return response.data.data;
  },

  async getTask(id: string): Promise<Task> {
    const tasks = await this.getTasks(id);
    if (!tasks || tasks.length === 0) {
        throw new Error('Tarea no encontrada o no autorizada.');
    }
    return tasks[0];
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