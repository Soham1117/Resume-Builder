import { createContext } from 'react';
import type { AuthResponse } from '../types/auth';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthResponse['user'] | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (response: AuthResponse) => void;
  logout: () => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined); 