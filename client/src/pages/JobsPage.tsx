import React from 'react';
import { useSearchParams } from 'react-router-dom';
import useJobs from '../hooks/useJobs';
import JobFilters from '../components/jobs/JobFilters';
import JobList from '../components/jobs/JobList';
import Pagination from '../components/common/Pagination';

const JobsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const { jobs, isLoading, filters, setFilters, pagination } = useJobs({
    search: initialSearch,
    limit: 9,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Explore Opportunities</h1>
        <p className="text-text-secondary">Find the perfect role to kickstart your career.</p>
      </div>

      <JobFilters filters={filters} onFilterChange={setFilters} />

      <div className="mb-6 flex justify-between items-center text-sm text-text-secondary">
        <span>
          Showing {jobs.length > 0 ? (pagination.page - 1) * 9 + 1 : 0} - {Math.min(pagination.page * 9, pagination.total)} of {pagination.total} jobs
        </span>
      </div>

      <JobList jobs={jobs} isLoading={isLoading} />

      {!isLoading && jobs.length > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setFilters({ ...filters, page })}
        />
      )}
    </div>
  );
};

export default JobsPage;
