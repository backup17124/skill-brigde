import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Building, Clock, IndianRupee } from 'lucide-react';
import { Job } from '../../types';
import Card from '../common/Card';
import Badge from '../common/Badge';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const navigate = useNavigate();

  const getJobTypeBadge = (type: string) => {
    switch (type) {
      case 'FULL_TIME': return <Badge variant="primary">Full-time</Badge>;
      case 'PART_TIME': return <Badge variant="warning">Part-time</Badge>;
      case 'INTERNSHIP': return <Badge variant="accent">Internship</Badge>;
      case 'CONTRACT': return <Badge variant="default">Contract</Badge>;
      default: return null;
    }
  };

  const getWorkplaceBadge = (type: string) => {
    switch (type) {
      case 'REMOTE': return <Badge variant="success">Remote</Badge>;
      case 'HYBRID': return <Badge variant="warning">Hybrid</Badge>;
      case 'ON_SITE': return <Badge variant="default">On-site</Badge>;
      default: return null;
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (min && !max) return `₹${min.toLocaleString()}+`;
    if (!min && max) return `Up to ₹${max.toLocaleString()}`;
    return `₹${min?.toLocaleString()} - ₹${max?.toLocaleString()}`;
  };

  const getRelativeTime = (dateString: string) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const daysDifference = Math.round((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return rtf.format(daysDifference, 'day');
  };

  return (
    <Card hover glass onClick={() => navigate(`/jobs/${job.id}`)} className="h-full flex flex-col p-5 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex-grow flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-surface-600 to-surface-700 border border-white/10 flex items-center justify-center text-xl font-bold text-white shadow-lg">
              {job.company.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-sm text-text-secondary flex items-center gap-1.5">
                <Building size={14} />
                <span className="line-clamp-1">{job.company}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {getJobTypeBadge(job.jobType)}
          {getWorkplaceBadge(job.workplaceType)}
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          {job.skills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="text-xs px-2 py-1 rounded-md bg-surface-800 text-text-muted border border-white/5">
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-md bg-surface-800 text-text-muted border border-white/5">
              +{job.skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="relative z-10 pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-sm text-text-secondary">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-primary-400" />
            <span className="truncate max-w-[100px]">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IndianRupee size={14} className="text-accent-400" />
            <span className="truncate">{formatSalary(job.salaryMin, job.salaryMax)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-text-muted">
          <Clock size={12} />
          {getRelativeTime(job.createdAt)}
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
