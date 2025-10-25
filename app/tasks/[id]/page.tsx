'use client';

// Importamos 'use' para arreglar el error de Next.js
import { useState, useEffect, useCallback, use } from 'react'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { taskService } from '@/services/taskService';
import { AuthGuard } from '@/components/AuthGuard';
import {  LaravelValidationData } from '@/types/task';
import { AxiosError } from 'axios';

interface EditTaskPageProps {
  params: {
    id: string; 
  };
}

function EditTaskContent({ params }: EditTaskPageProps) {
  const router = useRouter();
  const taskId = params.id;
  
  // CORRECCIÓN: Usamos los nombres de la API ('titulo', 'descripcion') en el estado
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    completada: false,
  });
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Cargar la Tarea
  const fetchTask = useCallback(async () => {
    try {
      const taskData = await taskService.getTask(taskId);
      
      // CORRECCIÓN: Leemos los datos de la API con los nombres correctos
      setFormData({
        titulo: taskData.titulo, // <-- CORREGIDO
        descripcion: taskData.descripcion || '', // <-- CORREGIDO
        completada: taskData.completada,
      });
    } catch (err: unknown) { 
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 401) {
             setError('No tienes permiso para ver esta tarea.');
        } else {
             setError('Error al cargar la tarea.');
        }
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, completada: e.target.checked });
  };

  // Manejar la Edición (PUT/PATCH)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // CORRECCIÓN: Al enviar, usamos los nombres que el backend espera
      await taskService.updateTask(taskId, {
        title: formData.titulo, // <-- CORREGIDO
        description: formData.descripcion, // <-- CORREGIDO
        is_completed: formData.completada, 
      });
      
      router.push('/tasks');
    } catch (err: unknown) {
        const axiosError = err as AxiosError;
        let message = 'Error al actualizar la tarea. Inténtalo de nuevo.';
        
        if (axiosError.response && axiosError.response.data) {
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
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
        <p className="ml-2">Cargando tarea...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <div className="flex items-center mb-6">
        <Link href="/tasks" className="text-indigo-600 hover:text-indigo-800 mr-4" title="Volver a la lista">
            <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Editar Tarea #{taskId}</h1>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        {error && <p className="text-red-600 mb-4 p-3 bg-red-100 rounded-lg border border-red-300">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* CORRECCIÓN: name y value ahora usan 'titulo' */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="titulo">Título</label>
            <input
              type="text"
              id="titulo"
              name="titulo" 
              value={formData.titulo} 
              onChange={handleChange}
              required
              className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* CORRECCIÓN: name y value ahora usan 'descripcion' */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleChange}
              rows={4}
              className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Checkbox de Completado */}
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="completada"
              name="completada"
              checked={formData.completada}
              onChange={handleToggleChange}
              className="mr-2 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label className="text-gray-700 text-sm font-semibold" htmlFor="completada">
                Marcar como Completada
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition flex items-center justify-center"
          >
            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}

// CORRECCIÓN: Arreglamos el 'use(params)' que vimos antes
export default function EditTaskPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  
  // Usamos 'use' para desenvolver la promesa
  const params = use(paramsPromise);

  return (
    <AuthGuard>
      <EditTaskContent params={params} />
    </AuthGuard>
  );
}