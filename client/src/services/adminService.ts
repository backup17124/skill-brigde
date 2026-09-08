import api from './api';
import { AdminStats, Role, User } from '../types';

export interface AdminUsersResponse {
  users: Array<
    User & {
      _count?: {
        jobs: number;
        applications: number;
      };
    }
  >;
  total: number;
  page: number;
  totalPages: number;
}

export const adminService = {
  getStats: async () => {
    const response = await api.get<{ success: boolean; data: AdminStats }>('/admin/stats');
    return response.data;
  },

  listUsers: async (params?: { search?: string; role?: string; page?: number; limit?: number }) => {
    const response = await api.get<{ success: boolean; data: AdminUsersResponse }>('/admin/users', {
      params,
    });
    return response.data;
  },

  updateUserRole: async (userId: string, role: Role) => {
    const response = await api.patch<{ success: boolean; data: User }>(`/admin/users/${userId}/role`, {
      role,
    });
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(`/admin/users/${userId}`);
    return response.data;
  },

  deleteJob: async (jobId: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(`/admin/jobs/${jobId}`);
    return response.data;
  },
};

