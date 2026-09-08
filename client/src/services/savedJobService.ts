import api from './api';
import { SavedJob } from '../types';

export const savedJobService = {
  toggleSave: async (jobId: string) => {
    const response = await api.post<{ success: boolean; data: { saved: boolean; message: string } }>(
      `/saved-jobs/${jobId}`
    );
    return response.data;
  },

  getSavedJobs: async () => {
    const response = await api.get<{ success: boolean; data: SavedJob[] }>('/saved-jobs');
    return response.data;
  },

  getSavedJobIds: async () => {
    const response = await api.get<{ success: boolean; data: string[] }>('/saved-jobs/ids');
    return response.data;
  },
};

