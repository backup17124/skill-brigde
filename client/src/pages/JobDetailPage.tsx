import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { Job } from '../types';
import JobDetail from '../components/jobs/JobDetail';
import Spinner from '../components/common/Spinner';
import { useAuth } from '../hooks/useAuth';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!id) return;
        const { data } = await jobService.getJobById(id);
        setJob(data);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-2">Job Not Found</h2>
        <p className="text-text-secondary mb-6">{error || "The job you're looking for doesn't exist or has been removed."}</p>
      </div>
    );
  }

  const isOwner = user?.id === job.postedById;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 w-full">
      <JobDetail job={job} isOwner={isOwner} />
    </div>
  );
};

export default JobDetailPage;
