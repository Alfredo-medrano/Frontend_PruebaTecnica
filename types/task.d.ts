// Define el tipo para los errores de validación de Laravel
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

// Define el tipo para una Tarea (corregido para coincidir con TaskResource.php)
export interface Task {
  id: number;
  titulo: string; // <-- CORREGIDO
  descripcion: string | null; // <-- CORREGIDO y permite null
  completada: boolean;
  creada_en: string; // <-- CORREGIDO
  actualizada_en: string; // <-- CORREGIDO
}

// Define la forma del estado de autenticación
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}