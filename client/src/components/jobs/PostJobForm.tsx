import React, { useState } from 'react';
import { Briefcase, Building, MapPin, IndianRupee, Tag } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

interface PostJobFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

const PostJobForm: React.FC<PostJobFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    company: initialData?.company || '',
    location: initialData?.location || '',
    workplaceType: initialData?.workplaceType || 'ON_SITE',
    jobType: initialData?.jobType || 'FULL_TIME',
    experienceLevel: initialData?.experienceLevel || 'Entry Level',
    salaryMin: initialData?.salaryMin || '',
    salaryMax: initialData?.salaryMax || '',
    skills: initialData?.skills?.join(', ') || '',
    description: initialData?.description || ''
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        ...formData,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined,
        skills: formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      };
      
      await onSubmit(payload);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to save job');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Job Title *"
          name="title"
          placeholder="e.g. Frontend Developer"
          icon={Briefcase}
          value={formData.title}
          onChange={handleChange}
          required
        />
        <Input
          label="Company Name *"
          name="company"
          placeholder="e.g. Tech Corp"
          icon={Building}
          value={formData.company}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Location *"
          name="location"
          placeholder="e.g. Bangalore"
          icon={MapPin}
          value={formData.location}
          onChange={handleChange}
          required
        />
        
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">Workplace Type *</label>
          <select 
            name="workplaceType" 
            value={formData.workplaceType} 
            onChange={handleChange}
            className="w-full bg-surface-700/50 border border-surface-500 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 h-[42px]"
          >
            <option value="ON_SITE">On-site</option>
            <option value="HYBRID">Hybrid</option>
            <option value="REMOTE">Remote</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">Job Type *</label>
          <select 
            name="jobType" 
            value={formData.jobType} 
            onChange={handleChange}
            className="w-full bg-surface-700/50 border border-surface-500 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 h-[42px]"
          >
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">Experience Level *</label>
          <select 
            name="experienceLevel" 
            value={formData.experienceLevel} 
            onChange={handleChange}
            className="w-full bg-surface-700/50 border border-surface-500 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 h-[42px]"
          >
            <option value="Intern">Intern</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
          </select>
        </div>
        
        <Input
          label="Min Salary (₹)"
          name="salaryMin"
          type="number"
          placeholder="e.g. 500000"
          icon={IndianRupee}
          value={formData.salaryMin}
          onChange={handleChange}
        />
        
        <Input
          label="Max Salary (₹)"
          name="salaryMax"
          type="number"
          placeholder="e.g. 800000"
          icon={IndianRupee}
          value={formData.salaryMax}
          onChange={handleChange}
        />
      </div>

      <Input
        label="Required Skills (comma separated) *"
        name="skills"
        placeholder="React, TypeScript, Node.js"
        icon={Tag}
        value={formData.skills}
        onChange={handleChange}
        required
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-secondary">Job Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={8}
          className="w-full bg-surface-700/50 border border-surface-500 rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
          placeholder="Describe the role, responsibilities, and requirements..."
          required
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
          {initialData ? 'Update Job' : 'Post Job'}
        </Button>
      </div>
    </form>
  );
};

export default PostJobForm;
