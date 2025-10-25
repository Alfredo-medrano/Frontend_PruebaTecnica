'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { taskService } from '@/services/taskService';
import { AuthGuard } from '@/components/AuthGuard';
import { AxiosError } from 'axios';
import { LaravelValidationData } from '@/types/task'; // IMPORTANTE: Importamos la nueva interfaz

function CreateTaskContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await taskService.createTask(formData);
      router.push('/tasks');
    } catch (err: unknown) { 
      const axiosError = err as AxiosError;
      
      let message = 'Error al crear la tarea. Inténtalo de nuevo.';
      
      if (axiosError.response && axiosError.response.data) {
        // CORRECCIÓN: Afirmamos la estructura de los datos de respuesta
        const responseData = axiosError.response.data as LaravelValidationData;

        if (responseData.errors) {
          const messages = Object.values(responseData.errors).flat().join(' ');
          message = `Error de validación: ${messages}`;
        } else if (responseData.message) {
          message = responseData.message;
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <div className="flex items-center mb-6">
        <Link href="/tasks" className="text-indigo-600 hover:text-indigo-800 mr-4" title="Volver a la lista">
            <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Crear Nueva Tarea</h1>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        {error && <p className="text-red-600 mb-4 p-3 bg-red-100 rounded-lg border border-red-300">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Campo Título (A11y corregido) */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="title">Título</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Campo Descripción (A11y corregido) */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="description">Descripción (Opcional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : 'Crear Tarea'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CreateTaskPage() {
    return (
        <AuthGuard>
            <CreateTaskContent />
        </AuthGuard>
    )
}