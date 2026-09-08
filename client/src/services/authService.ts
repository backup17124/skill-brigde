import api from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },
  
  register: async (name: string, email: string, password: string, role: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password, role });
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const { data } = await api.post('/auth/refresh');
    return data.data;
  },

  getMe: async (): Promise<{ data: User }> => {
    const { data } = await api.get('/auth/me');
    return data;
  }
};
