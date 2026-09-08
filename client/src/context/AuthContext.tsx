import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '../types';
import { authService } from '../services/authService';
import { setAccessToken } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_LOADING'; payload: boolean };

interface AuthContextType extends AuthState {
  login: (data: AuthResponse) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case 'CLEAR_USER':
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { accessToken } = await authService.refreshToken();
        setAccessToken(accessToken);
        const { data } = await authService.getMe();
        dispatch({ type: 'SET_USER', payload: data });
      } catch (error) {
        dispatch({ type: 'CLEAR_USER' });
      }
    };
    initAuth();
  }, []);

  const login = (data: AuthResponse) => {
    setAccessToken(data.data.accessToken);
    dispatch({ type: 'SET_USER', payload: data.data.user });
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setAccessToken(null);
      dispatch({ type: 'CLEAR_USER' });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
