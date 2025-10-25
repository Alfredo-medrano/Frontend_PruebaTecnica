'use client';

import { useState, useContext } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useContext(AuthContext);
  // NOTA: Eliminamos el useEffect que estaba aquí para evitar conflictos.

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      const response = await api.post('/login', formData);
      
      const token = response.data.access_token;
      login(token, { id: 0, name: 'Usuario', email: formData.email }); 
      
      // La redirección DEBE ocurrir después de que el estado local y global se actualicen
      router.push('/tasks'); 

    } catch (err: unknown) { 
      const axiosError = err as AxiosError;
      
      const status = axiosError.response?.status;
      const message = status === 401 ? 'Credenciales incorrectas.' : 'Error de conexión o servidor.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  
  // Si el usuario está cargando o ya autenticado (por si accedió desde otra página),
  // se remite al AuthGuard de /tasks que manejará la redirección final.
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
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Iniciar Sesión</h1>
        
        {error && <p className="text-red-600 mb-4 p-3 bg-red-100 rounded-lg border border-red-300">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
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

          {/* Password */}
          <div className="mb-6">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : 'Iniciar Sesión'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta? <Link href="/register" className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline transition duration-150">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
