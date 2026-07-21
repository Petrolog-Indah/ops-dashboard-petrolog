import { createContext } from 'react';
import { type LoginResponse } from '../entities/api/auth';

export interface User {
  id: string;
  email?: string;
  name: string;
  role?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
