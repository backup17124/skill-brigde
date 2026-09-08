import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { JobFilters as FilterTypes } from '../../types';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';

interface JobFiltersProps {
  filters: FilterTypes;
  onFilterChange: (filters: FilterTypes) => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({ filters, onFilterChange }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleChange = (key: keyof FilterTypes, value: any) => {
    onFilterChange({ ...filters, [key]: value, page: 1 });
  };

  const handleClear = () => {
    onFilterChange({
      search: '',
      jobType: '',
      workplaceType: '',
      experienceLevel: '',
      page: 1,
    });
  };

  const hasActiveFilters = filters.search || filters.jobType || filters.workplaceType || filters.experienceLevel;

  const FilterContent = () => (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="flex-grow">
        <Input
          placeholder="Search jobs, skills, or companies..."
          icon={Search}
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          className="bg-surface-700/50 border border-surface-500 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 min-w-[140px]"
          value={filters.jobType || ''}
          onChange={(e) => handleChange('jobType', e.target.value)}
        >
          <option value="">All Job Types</option>
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERNSHIP">Internship</option>
        </select>

        <select
          className="bg-surface-700/50 border border-surface-500 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 min-w-[140px]"
          value={filters.workplaceType || ''}
          onChange={(e) => handleChange('workplaceType', e.target.value)}
        >
          <option value="">All Workplaces</option>
          <option value="REMOTE">Remote</option>
          <option value="HYBRID">Hybrid</option>
          <option value="ON_SITE">On-site</option>
        </select>

        <select
          className="bg-surface-700/50 border border-surface-500 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 min-w-[140px]"
          value={filters.experienceLevel || ''}
          onChange={(e) => handleChange('experienceLevel', e.target.value)}
        >
          <option value="">All Experience</option>
          <option value="Intern">Intern</option>
          <option value="Entry Level">Entry Level</option>
          <option value="Mid Level">Mid Level</option>
          <option value="Senior Level">Senior Level</option>
        </select>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" onClick={handleClear} className="whitespace-nowrap px-2">
          <X size={18} className="mr-1" /> Clear
        </Button>
      )}
    </div>
  );

  return (
    <div className="mb-8 relative z-30">
      {/* Mobile toggle */}
      <div className="md:hidden mb-4">
        <Button 
          variant="secondary" 
          fullWidth 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <Filter size={18} className="mr-2" />
          {isMobileOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <Card glass className="p-4">
          <FilterContent />
        </Card>
      </div>

      {/* Mobile view */}
      {isMobileOpen && (
        <div className="md:hidden animate-slide-up">
          <Card glass className="p-4">
            <FilterContent />
          </Card>
        </div>
      )}
    </div>
  );
};

export default JobFilters;
