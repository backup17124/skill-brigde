import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  ArrowLeft,
  Send,
  Bookmark,
  CheckCircle,
  FileText,
  Upload,
} from 'lucide-react';
import { Job } from '../../types';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';
import Modal from '../common/Modal';
import { useAuth } from '../../hooks/useAuth';
import { applicationService } from '../../services/applicationService';
import { savedJobService } from '../../services/savedJobService';
import { jobService } from '../../services/jobService';
import { userService } from '../../services/userService';

interface JobDetailProps {
  job: Job;
  isOwner?: boolean;
}

const JobDetail: React.FC<JobDetailProps> = ({ job, isOwner }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?.role === 'STUDENT') {
      // Check if job is saved
      savedJobService
        .getSavedJobIds()
        .then((res) => {
          if (res.data?.includes(job.id)) {
            setIsSaved(true);
          }
        })
        .catch(console.error);

      // Check if already applied
      applicationService
        .getMyApplications()
        .then((res) => {
          const applied = res.data?.some((app) => app.jobId === job.id);
          if (applied) {
            setHasApplied(true);
          }
        })
        .catch(console.error);
    }
  }, [isAuthenticated, job.id, user]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await savedJobService.toggleSave(job.id);
      setIsSaved(res.data.saved);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      let resumeUrl = user?.resumeUrl;
      let resumeName = user?.resumeName;

      // If a new resume file is selected, upload it first
      if (selectedFile) {
        const uploadRes = await userService.uploadResume(selectedFile);
        resumeUrl = uploadRes.data.resumeUrl;
        resumeName = uploadRes.data.resumeName;
      }

      await applicationService.applyToJob(job.id, {
        coverNote,
        resumeUrl: resumeUrl || undefined,
        resumeName: resumeName || undefined,
      });

      setHasApplied(true);
      setSuccessMsg('Your application was submitted successfully!');
      setTimeout(() => {
        setIsApplyModalOpen(false);
        setSuccessMsg('');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!window.confirm(`Are you sure you want to delete "${job.title}"?`)) return;
    try {
      await jobService.deleteJob(job.id);
      navigate('/jobs');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to delete job');
    }
  };

  const getJobTypeString = (type: string) => {
    switch (type) {
      case 'FULL_TIME':
        return 'Full-time';
      case 'PART_TIME':
        return 'Part-time';
      case 'INTERNSHIP':
        return 'Internship';
      case 'CONTRACT':
        return 'Contract';
      default:
        return type;
    }
  };

  const getWorkplaceString = (type: string) => {
    switch (type) {
      case 'REMOTE':
        return 'Remote';
      case 'HYBRID':
        return 'Hybrid';
      case 'ON_SITE':
        return 'On-site';
      default:
        return type;
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (min && !max) return `₹${min.toLocaleString()}+`;
    if (!min && max) return `Up to ₹${max.toLocaleString()}`;
    return `₹${min?.toLocaleString()} - ₹${max?.toLocaleString()}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-text-secondary hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft size={20} className="mr-2" /> Back to jobs
      </button>

      <Card glass className="p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-accent-400 to-primary-500" />

        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-surface-600 to-surface-700 border border-white/10 flex items-center justify-center text-3xl font-bold text-white shadow-xl flex-shrink-0">
              {job.company.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-text-secondary text-sm">
                <div className="flex items-center gap-1.5">
                  <Building size={16} />
                  <span className="font-medium text-white">{job.company}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} />
                  {job.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Bookmark button for students / guests */}
            {(!user || user.role === 'STUDENT') && (
              <button
                onClick={handleToggleSave}
                title={isSaved ? 'Remove from saved' : 'Save opportunity'}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-accent-500/20 text-accent-400 border-accent-400/40'
                    : 'border-white/10 text-text-secondary hover:text-white hover:bg-surface-700'
                }`}
              >
                <Bookmark size={20} className={isSaved ? 'fill-accent-400' : ''} />
              </button>
            )}

            {isOwner ? (
              <div className="flex gap-2 w-full md:w-auto">
                <Button variant="danger" onClick={handleDeleteJob} className="flex-1 md:flex-none">
                  Delete
                </Button>
              </div>
            ) : hasApplied ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-success/10 text-success border border-success/30 font-medium text-sm">
                <CheckCircle size={18} />
                <span>Applied</span>
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="md:w-auto"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                  } else {
                    setIsApplyModalOpen(true);
                  }
                }}
              >
                <Send size={18} className="mr-2" /> Apply Now
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
          <div className="bg-surface-800/50 rounded-xl p-4 border border-white/5">
            <p className="text-text-muted text-xs uppercase font-semibold mb-1">Job Type</p>
            <p className="text-white font-medium flex items-center gap-2">
              <Briefcase size={16} className="text-primary-400" />
              {getJobTypeString(job.jobType)}
            </p>
          </div>
          <div className="bg-surface-800/50 rounded-xl p-4 border border-white/5">
            <p className="text-text-muted text-xs uppercase font-semibold mb-1">Workplace</p>
            <p className="text-white font-medium flex items-center gap-2">
              <Building size={16} className="text-accent-400" />
              {getWorkplaceString(job.workplaceType)}
            </p>
          </div>
          <div className="bg-surface-800/50 rounded-xl p-4 border border-white/5">
            <p className="text-text-muted text-xs uppercase font-semibold mb-1">Experience</p>
            <p className="text-white font-medium flex items-center gap-2">
              <Clock size={16} className="text-success" />
              {job.experienceLevel}
            </p>
          </div>
          <div className="bg-surface-800/50 rounded-xl p-4 border border-white/5">
            <p className="text-text-muted text-xs uppercase font-semibold mb-1">Salary</p>
            <p className="text-white font-medium flex items-center gap-2">
              <IndianRupee size={16} className="text-warning" />
              {formatSalary(job.salaryMin, job.salaryMax)}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card className="p-6 md:p-8">
            <h3 className="text-xl font-bold text-white mb-6">Job Description</h3>
            <div className="prose prose-invert max-w-none text-text-secondary whitespace-pre-wrap leading-relaxed">
              {job.description}
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, idx) => (
                <Badge key={idx} variant="primary" size="md">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">About the Company</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-surface-600 flex items-center justify-center text-lg font-bold text-white">
                {job.company.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-white">{job.company}</p>
                <p className="text-xs text-text-muted">{job.location}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
      >
        <form onSubmit={handleApply} className="space-y-6">
          {errorMsg && (
            <div className="p-3 bg-error/10 border border-error/30 text-error text-sm rounded-xl">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-success/10 border border-success/30 text-success text-sm rounded-xl">
              {successMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Cover Note / Why are you a good fit?
            </label>
            <textarea
              rows={4}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Highlight relevant projects, skills, or your passion for this role..."
              className="w-full px-4 py-3 bg-surface-700 rounded-xl text-white placeholder-text-muted border border-white/10 focus:outline-none focus:border-primary-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Resume Document
            </label>
            {user?.resumeUrl && !selectedFile ? (
              <div className="p-4 rounded-xl bg-surface-700/50 border border-white/10 flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <FileText className="text-primary-400" size={20} />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {user.resumeName || 'Default Profile Resume.pdf'}
                    </p>
                    <p className="text-xs text-text-muted">Attached from your profile</p>
                  </div>
                </div>
                <label className="text-xs text-primary-400 hover:underline cursor-pointer">
                  Replace file
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            ) : (
              <div className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-primary-500/50 transition-colors">
                <Upload className="mx-auto text-text-muted mb-2" size={24} />
                <label className="text-sm font-medium text-primary-400 hover:underline cursor-pointer block">
                  {selectedFile ? selectedFile.name : 'Upload your resume (PDF/DOCX)'}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                </label>
                <p className="text-xs text-text-muted mt-1">Maximum file size: 5MB</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsApplyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default JobDetail;

