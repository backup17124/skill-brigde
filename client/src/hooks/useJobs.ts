import { useState, useEffect, useCallback } from 'react';
import { Job, JobFilters } from '../types';
import { jobService } from '../services/jobService';

interface PaginationState {
  total: number;
  page: number;
  totalPages: number;
}

export const useJobs = (initialFilters: JobFilters = {}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<JobFilters>({ page: 1, limit: 10, ...initialFilters });
  const [pagination, setPagination] = useState<PaginationState>({ total: 0, page: 1, totalPages: 1 });

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await jobService.getJobs(filters);
      setJobs(data.data.jobs);
      setPagination({
        total: data.data.total,
        page: data.data.page,
        totalPages: data.data.totalPages,
      });
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, isLoading, error, filters, setFilters, pagination, refetch: fetchJobs };
};

export default useJobs;
