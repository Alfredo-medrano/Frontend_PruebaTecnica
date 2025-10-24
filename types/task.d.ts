export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string;
  completada: boolean; 
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}