import React from 'react';
import { Job } from '../../types';
import JobCard from './JobCard';
import Card from '../common/Card';
import { SearchX } from 'lucide-react';

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  emptyMessage?: string;
}

const JobList: React.FC<JobListProps> = ({ 
  jobs, 
  isLoading, 
  emptyMessage = "No jobs found matching your criteria." 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-5 h-[280px] flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl animate-shimmer bg-surface-600" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-5 bg-surface-600 rounded animate-shimmer w-3/4" />
                <div className="h-4 bg-surface-600 rounded animate-shimmer w-1/2" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-surface-600 rounded-full animate-shimmer" />
              <div className="h-6 w-20 bg-surface-600 rounded-full animate-shimmer" />
            </div>
            <div className="flex gap-2 mt-auto">
              <div className="h-6 w-16 bg-surface-600 rounded-md animate-shimmer" />
              <div className="h-6 w-16 bg-surface-600 rounded-md animate-shimmer" />
              <div className="h-6 w-16 bg-surface-600 rounded-md animate-shimmer" />
            </div>
            <div className="pt-4 mt-4 border-t border-white/10 flex justify-between">
              <div className="h-4 w-24 bg-surface-600 rounded animate-shimmer" />
              <div className="h-4 w-24 bg-surface-600 rounded animate-shimmer" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-20 h-20 bg-surface-800 rounded-full flex items-center justify-center mb-6 shadow-lg border border-white/5">
          <SearchX size={32} className="text-text-muted" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
        <p className="text-text-secondary max-w-md">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job, index) => (
        <div 
          key={job.id} 
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms`, opacity: 0, animationFillMode: 'forwards' }}
        >
          <JobCard job={job} />
        </div>
      ))}
    </div>
  );
};

export default JobList;
