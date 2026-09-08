import api from './api';
import { User } from '../types';

export const userService = {
  getProfile: async () => {
    const response = await api.get<{ success: boolean; data: User }>('/users/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.put<{ success: boolean; data: User }>('/users/profile', data);
    return response.data;
  },

  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post<{ success: boolean; data: User }>(
      '/users/profile/resume',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};

