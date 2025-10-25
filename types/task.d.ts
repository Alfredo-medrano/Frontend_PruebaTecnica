// Define el tipo para los errores de validación de la API
export interface LaravelValidationData {
  message: string;
  errors: Record<string, string[]>;
}

// Define el tipo para el usuario
export interface User {
  id: number;
  name: string;
  email: string;
}

// Define el tipo para la tarea
export interface Task {
  id: number;
  titulo: string; 
  descripcion: string | null; 
  completada: boolean;
  creada_en: string; 
  actualizada_en: string; 
}

// Define la forma del estado de autenticación
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}