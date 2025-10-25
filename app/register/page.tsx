'use client';

import { useState, useContext } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios'; 

// Definimos la interfaz para los errores de validación de Laravel
interface LaravelValidationData {
  message: string;
  errors: Record<string, string[]>;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/register', formData);
      
      const token = response.data.access_token;
      // Guardar el token en el estado global
      register(token, { id: 0, name: formData.name, email: formData.email }); 
      
      router.push('/tasks'); 
      
    } catch (err: unknown) { 
      const axiosError = err as AxiosError; 
      let message = 'Error al registrar. Inténtalo de nuevo.';
      
      // Manejo de errores de validación de la API
      if (axiosError.response && axiosError.response.data) {
        
        const responseData = axiosError.response.data as LaravelValidationData; 
        
        if (responseData.errors) {
            const validationErrors = responseData.errors; 
            message = Object.values(validationErrors).flat().join(' ');
        } else if (responseData.message) {
             message = responseData.message;
        }
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  
  // Muestra spinner si el AuthContext está verificando la sesión o si el usuario ya está autenticado.
  if (isLoading || isAuthenticated) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
        </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Registro de Usuario</h1>
        
        {error && <p className="text-red-600 mb-4 p-3 bg-red-100 rounded-lg border border-red-300">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password_confirmation">Confirmar Contraseña</label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : 'Registrarse'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta? <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline transition duration-150">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
}
