'use client';

import { useState, useEffect, useCallback, useContext } from 'react';
import { taskService } from '@/services/taskService';
import { Task } from '@/types/task';
import { AuthGuard } from '@/components/AuthGuard';
import { LogOut, PlusCircle, CheckCircle, Circle, Trash2, Edit, Loader2 } from 'lucide-react';
import { AuthContext } from '@/context/AuthContext';
import Link from 'next/link';

function TaskListContent() {
  const { logout, isAuthenticated, isLoading: isAuthLoading } = useContext(AuthContext); 
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false); 
  const [error, setError] = useState('');

  // Carga de Tareas
  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true);
    setError('');
    try {
      // Intentar cargar las tareas
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks.sort((a, b) => (a.completada === b.completada ? 0 : a.completada ? 1 : -1)));
    } catch { 
      // NOTA: El interceptor de Axios ya limpia el token si es 401. 
      // El AuthContext detectará que el token se fue y redirigirá a /login.
      setError('Error al cargar las tareas. Tu sesión puede haber expirado.');
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  // CLAVE: Activación de la carga. Solo ocurre cuando:
  // 1. El chequeo inicial de AuthContext ha terminado (`!isAuthLoading`).
  // 2. Estamos autenticados (`isAuthenticated`).
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
        fetchTasks();
    }
    // NOTA: Si !isAuthLoading && !isAuthenticated, el AuthGuard redirige.
    
  }, [isAuthenticated, isAuthLoading, fetchTasks]); 

  // Manejar el toggle de completado (No modificado)
  const handleToggleCompleted = async (task: Task) => {
    try {
      await taskService.updateTask(String(task.id), { 
        is_completed: !task.completada,
        title: task.titulo,
        description: task.descripcion,
      });
      setTasks(prevTasks => {
          const updatedTasks = prevTasks.map(t => 
              t.id === task.id ? { ...t, completada: !t.completada } : t
          );
          return updatedTasks.sort((a, b) => (a.completada === b.completada ? 0 : a.completada ? 1 : -1));
      });
    } catch { 
      setError('Error al actualizar la tarea.');
    }
  };

  // Manejar eliminación (No modificado)
  const handleDelete = async (taskId: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch { 
      setError('Error al eliminar la tarea.');
    }
  };

  // 1. Mostrar el spinner si la autenticación está en proceso de chequeo (AuthContext).
  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
        <p className="ml-2">Verificando sesión...</p>
      </div>
    );
  }
  
  // 2. Si ya pasó el chequeo de autenticación, pero la lista de tareas está cargando.
  if (loadingTasks) {
     return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
        <p className="ml-2">Cargando tus tareas...</p>
      </div>
    );
  }

  // 3. Muestra el contenido.

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-lg border-t-4 border-indigo-600">
        <h1 className="text-3xl font-extrabold text-gray-800">Mi Gestor de Tareas</h1>
        <div className="flex space-x-3">
          <Link 
            href="/tasks/new"
            className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-md"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Nueva
          </Link>
          <button
            onClick={logout}
            className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-md"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Salir
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 mb-4 p-3 bg-red-100 rounded-lg border border-red-300">{error}</p>}

      {tasks.length === 0 ? (
        <div className="text-center p-12 border-4 border-dashed border-indigo-200 rounded-xl bg-white shadow-inner">
            <p className="text-2xl text-gray-500 font-light">¡No tienes tareas! Es un buen momento para empezar.</p>
            <Link href="/tasks/new" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                <PlusCircle className="w-5 h-5 mr-1" /> Crear Tarea
            </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li 
              key={task.id} 
              className={`bg-white p-5 rounded-lg shadow-lg transition duration-300 border-l-6 flex justify-between items-center ${task.completada ? 'border-l-green-500 opacity-85' : 'border-l-indigo-600'}`}
            >
              <div className="flex items-start flex-1 mr-4">
                  <button
                    onClick={() => handleToggleCompleted(task)}
                    className="p-1 rounded-full mr-4 mt-1 transition duration-150"
                    title={task.completada ? 'Marcar como pendiente' : 'Marcar como completada'}
                  >
                    {task.completada ? <CheckCircle className="w-6 h-6 fill-green-500 text-white" /> : <Circle className="w-6 h-6 stroke-indigo-600 fill-white" />}
                  </button>
                <div className="flex-1">
                  <h2 
                    className={`text-xl font-bold ${task.completada ? 'line-through text-gray-500' : 'text-gray-800'}`}
                  >
                    {task.titulo}
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm">{task.descripcion}</p>
                </div>
              </div>
                
              <div className="flex space-x-2 items-center">
                <Link
                  href={`/tasks/${task.id}`}
                  className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition duration-150"
                  title="Editar tarea"
                >
                  <Edit className="w-5 h-5" />
                </Link>

                <button
                  onClick={() => handleDelete(task.id)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-full transition duration-150"
                  title="Eliminar tarea"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Envuelve la vista con el AuthGuard
export default function TasksPage() {
    return (
        <AuthGuard>
            <TaskListContent />
        </AuthGuard>
    )
}
