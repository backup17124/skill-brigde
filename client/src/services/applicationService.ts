import api from './api';
import { Application, ApplicationStatus, StudentStats, RecruiterStats } from '../types';

export const applicationService = {
  applyToJob: async (jobId: string, data: { coverNote?: string; resumeUrl?: string; resumeName?: string }) => {
    const response = await api.post<{ success: boolean; data: Application }>(
      `/applications/jobs/${jobId}`,
      data
    );
    return response.data;
  },

  getMyApplications: async () => {
    const response = await api.get<{ success: boolean; data: Application[] }>('/applications/my');
    return response.data;
  },

  getJobApplications: async (jobId: string) => {
    const response = await api.get<{ success: boolean; data: Application[] }>(
      `/applications/jobs/${jobId}`
    );
    return response.data;
  },

  getRecruiterApplications: async () => {
    const response = await api.get<{ success: boolean; data: Application[] }>(
      '/applications/recruiter'
    );
    return response.data;
  },

  updateStatus: async (applicationId: string, status: ApplicationStatus) => {
    const response = await api.patch<{ success: boolean; data: Application }>(
      `/applications/${applicationId}/status`,
      { status }
    );
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<{ success: boolean; data: StudentStats | RecruiterStats }>(
      '/applications/stats'
    );
    return response.data;
  },
};

