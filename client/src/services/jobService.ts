import api from './api';
import { JobFilters, JobResponse, JobsResponse } from '../types';

export const jobService = {
  getJobs: async (filters: JobFilters): Promise<JobsResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    const { data } = await api.get<JobsResponse>(`/jobs?${params.toString()}`);
    return data;
  },

  getJobById: async (id: string): Promise<JobResponse> => {
    const { data } = await api.get<JobResponse>(`/jobs/${id}`);
    return data;
  },

  createJob: async (jobData: any): Promise<JobResponse> => {
    const { data } = await api.post<JobResponse>('/jobs', jobData);
    return data;
  },

  updateJob: async (id: string, jobData: any): Promise<JobResponse> => {
    const { data } = await api.put<JobResponse>(`/jobs/${id}`, jobData);
    return data;
  },

  deleteJob: async (id: string): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  }
};
