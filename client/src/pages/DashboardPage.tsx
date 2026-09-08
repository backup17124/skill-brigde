import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { applicationService } from '../services/applicationService';
import { savedJobService } from '../services/savedJobService';
import { jobService } from '../services/jobService';
import { userService } from '../services/userService';
import {
  Application,
  SavedJob,
  Job,
  StudentStats,
  RecruiterStats,
  ApplicationStatus,
} from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import PostJobForm from '../components/jobs/PostJobForm';
import {
  Plus,
  Briefcase,
  Bookmark,
  FileText,
  Clock,
  CheckCircle2,
  ExternalLink,
  Trash2,
  Upload,
  Phone,
  Mail,
  GraduationCap,
  Globe,
  Github,
  Linkedin,
  Filter,
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>('applications');

  // Stats
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);
  const [recruiterStats, setRecruiterStats] = useState<RecruiterStats | null>(null);

  // Student data
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [isLoadingStudentData, setIsLoadingStudentData] = useState(false);

  // Student profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    education: user?.education || '',
    experience: user?.experience || '',
    githubUrl: user?.githubUrl || '',
    linkedinUrl: user?.linkedinUrl || '',
    portfolioUrl: user?.portfolioUrl || '',
  });
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Recruiter data
  const [recruiterJobs, setRecruiterJobs] = useState<Job[]>([]);
  const [recruiterApplications, setRecruiterApplications] = useState<Application[]>([]);
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('ALL');
  const [isLoadingRecruiterData, setIsLoadingRecruiterData] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);

  // Notification message
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // Initial Data Fetch
  const loadData = async () => {
    if (!user) return;

    try {
      // Load stats
      const statsRes = await applicationService.getStats();
      if (user.role === 'STUDENT') {
        setStudentStats(statsRes.data as StudentStats);
      } else if (user.role === 'RECRUITER' || user.role === 'ADMIN') {
        setRecruiterStats(statsRes.data as RecruiterStats);
      }
    } catch (err) {
      console.error(err);
    }

    if (user.role === 'STUDENT') {
      setIsLoadingStudentData(true);
      try {
        const [appRes, savedRes, profileRes] = await Promise.all([
          applicationService.getMyApplications(),
          savedJobService.getSavedJobs(),
          userService.getProfile(),
        ]);
        setApplications(appRes.data);
        setSavedJobs(savedRes.data);

        const prof = profileRes.data;
        setProfileForm({
          name: prof.name || '',
          headline: prof.headline || '',
          bio: prof.bio || '',
          phone: prof.phone || '',
          education: prof.education || '',
          experience: prof.experience || '',
          githubUrl: prof.githubUrl || '',
          linkedinUrl: prof.linkedinUrl || '',
          portfolioUrl: prof.portfolioUrl || '',
        });
        setSkillsList(prof.skills || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingStudentData(false);
      }
    } else if (user.role === 'RECRUITER' || user.role === 'ADMIN') {
      setIsLoadingRecruiterData(true);
      try {
        const [jobsRes, appsRes] = await Promise.all([
          jobService.getJobs({ postedById: user.id, status: 'ALL' }),
          applicationService.getRecruiterApplications(),
        ]);
        setRecruiterJobs(jobsRes.data.jobs);
        setRecruiterApplications(appsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingRecruiterData(false);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Handle student profile update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileSuccessMsg('');

    try {
      // 1. Upload resume if new file chosen
      if (resumeFile) {
        await userService.uploadResume(resumeFile);
        setResumeFile(null);
      }

      // 2. Update profile fields
      await userService.updateProfile({
        ...profileForm,
        skills: skillsList,
      });

      setProfileSuccessMsg('Profile updated successfully!');
      setTimeout(() => setProfileSuccessMsg(''), 3000);
      loadData();
    } catch (err: any) {
      setNotification({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to update profile',
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && newSkillInput.trim()) {
      e.preventDefault();
      const skill = newSkillInput.trim().replace(/,/g, '');
      if (skill && !skillsList.includes(skill)) {
        setSkillsList([...skillsList, skill]);
      }
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  // Handle Remove Saved Job
  const handleRemoveSavedJob = async (jobId: string) => {
    try {
      await savedJobService.toggleSave(jobId);
      setSavedJobs(savedJobs.filter((s) => s.job.id !== jobId));
      if (studentStats) {
        setStudentStats({ ...studentStats, savedJobs: Math.max(0, studentStats.savedJobs - 1) });
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  // Handle Post New Job (Recruiter)
  const handlePostJob = async (jobData: any) => {
    try {
      await jobService.createJob(jobData);
      setIsPostJobModalOpen(false);
      setNotification({ type: 'success', text: 'Job posted successfully!' });
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to post job');
    }
  };

  // Handle Delete Job (Recruiter)
  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete job "${jobTitle}"?`)) return;
    try {
      await jobService.deleteJob(jobId);
      setNotification({ type: 'success', text: 'Job deleted successfully' });
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to delete job');
    }
  };

  // Handle Update Candidate Application Status (Recruiter)
  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      await applicationService.updateStatus(applicationId, newStatus);
      setRecruiterApplications(
        recruiterApplications.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      setNotification({
        type: 'success',
        text: `Applicant status updated to ${newStatus}`,
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">Pending</Badge>;
      case 'REVIEWING':
        return <Badge variant="secondary">Reviewing</Badge>;
      case 'SHORTLISTED':
        return <Badge variant="primary">Shortlisted</Badge>;
      case 'ACCEPTED':
        return <Badge variant="success">Accepted</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (!user) return null;

  // Filter recruiter applications by selected job
  const filteredRecruiterApps =
    selectedJobFilter === 'ALL'
      ? recruiterApplications
      : recruiterApplications.filter((a) => a.jobId === selectedJobFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.name}</h1>
          <p className="text-text-secondary">
            {user.role === 'STUDENT'
              ? 'Track your career applications, saved opportunities, and professional profile.'
              : 'Manage job postings, review applicant profiles, and track hiring pipelines.'}
          </p>
        </div>

        {user.role === 'RECRUITER' && (
          <Button onClick={() => setIsPostJobModalOpen(true)} className="md:self-start">
            <Plus size={18} className="mr-2" /> Post a New Job
          </Button>
        )}
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-success/10 border border-success/30 text-success'
              : 'bg-error/10 border border-error/30 text-error'
          }`}
        >
          <span>{notification.text}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-xs uppercase font-bold hover:underline cursor-pointer ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* -------------------- STUDENT DASHBOARD -------------------- */}
      {user.role === 'STUDENT' && (
        <div className="space-y-8">
          {/* Student Analytics Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-500/10 text-primary-400 rounded-xl">
                  <Briefcase size={22} />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase font-semibold">Applications</p>
                  <p className="text-2xl font-bold text-white">
                    {studentStats ? studentStats.totalApplications : applications.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-warning/10 text-warning rounded-xl">
                  <Clock size={22} />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase font-semibold">Under Review</p>
                  <p className="text-2xl font-bold text-white">
                    {studentStats
                      ? studentStats.pending + studentStats.reviewing
                      : applications.filter((a) => a.status === 'PENDING' || a.status === 'REVIEWING')
                          .length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-success/10 text-success rounded-xl">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase font-semibold">Shortlisted</p>
                  <p className="text-2xl font-bold text-white">
                    {studentStats
                      ? studentStats.shortlisted + studentStats.accepted
                      : applications.filter(
                          (a) => a.status === 'SHORTLISTED' || a.status === 'ACCEPTED'
                        ).length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent-500/10 text-accent-400 rounded-xl">
                  <Bookmark size={22} />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase font-semibold">Saved Jobs</p>
                  <p className="text-2xl font-bold text-white">
                    {studentStats ? studentStats.savedJobs : savedJobs.length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Student Tabs */}
          <div className="flex border-b border-white/10 gap-6">
            <button
              onClick={() => setActiveTab('applications')}
              className={`pb-4 text-sm font-semibold transition-colors relative cursor-pointer ${
                activeTab === 'applications'
                  ? 'text-primary-400'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              My Applications ({applications.length})
              {activeTab === 'applications' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-4 text-sm font-semibold transition-colors relative cursor-pointer ${
                activeTab === 'saved' ? 'text-primary-400' : 'text-text-secondary hover:text-white'
              }`}
            >
              Saved Opportunities ({savedJobs.length})
              {activeTab === 'saved' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-4 text-sm font-semibold transition-colors relative cursor-pointer ${
                activeTab === 'profile' ? 'text-primary-400' : 'text-text-secondary hover:text-white'
              }`}
            >
              Profile & Resume
              {activeTab === 'profile' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400" />
              )}
            </button>
          </div>

          {/* TAB: APPLICATIONS */}
          {activeTab === 'applications' && (
            <div>
              {isLoadingStudentData ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : applications.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                  <Briefcase size={36} className="mx-auto text-text-muted mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-1">No Applications Yet</h3>
                  <p className="text-text-secondary mb-4">
                    Explore available positions and submit your first application.
                  </p>
                  <Link to="/jobs">
                    <Button variant="primary">Browse Jobs</Button>
                  </Link>
                </Card>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <Card key={app.id} className="p-5 hover:border-white/20 transition-all">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-bold text-white">{app.job?.title}</h3>
                            {getStatusBadge(app.status)}
                          </div>
                          <p className="text-sm text-text-secondary font-medium">
                            {app.job?.company} • {app.job?.location} • {app.job?.jobType}
                          </p>
                          {app.coverNote && (
                            <p className="text-xs text-text-muted mt-2 line-clamp-2 bg-surface-700/50 p-2.5 rounded-lg border border-white/5">
                              "{app.coverNote}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-right self-end md:self-auto">
                          <div className="text-xs text-text-muted hidden sm:block">
                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                          </div>
                          <Link to={`/jobs/${app.jobId}`}>
                            <Button variant="secondary" size="sm">
                              View Job <ExternalLink size={14} className="ml-1.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SAVED JOBS */}
          {activeTab === 'saved' && (
            <div>
              {isLoadingStudentData ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : savedJobs.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                  <Bookmark size={36} className="mx-auto text-text-muted mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-1">No Saved Jobs</h3>
                  <p className="text-text-secondary mb-4">
                    Bookmark interesting opportunities so you can apply later.
                  </p>
                  <Link to="/jobs">
                    <Button variant="primary">Explore Jobs</Button>
                  </Link>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedJobs.map((item) => (
                    <Card key={item.id} className="p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-white">{item.job.title}</h3>
                          <button
                            onClick={() => handleRemoveSavedJob(item.job.id)}
                            title="Remove from saved"
                            className="text-text-muted hover:text-error p-1 transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-text-secondary mb-3">
                          {item.job.company} • {item.job.location}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {item.job.skills.slice(0, 4).map((skill, idx) => (
                            <Badge key={idx} variant="secondary" size="sm">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                        <span className="text-xs text-text-muted">
                          Saved {new Date(item.savedAt).toLocaleDateString()}
                        </span>
                        <Link to={`/jobs/${item.job.id}`}>
                          <Button variant="primary" size="sm">
                            View & Apply
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PROFILE & RESUME */}
          {activeTab === 'profile' && (
            <Card className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-2">Profile & Resume Management</h2>
              <p className="text-text-secondary text-sm mb-6">
                Keep your details updated so recruiters can evaluate your background effectively.
              </p>

              {profileSuccessMsg && (
                <div className="mb-6 p-4 rounded-xl bg-success/10 border border-success/30 text-success text-sm">
                  {profileSuccessMsg}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-700 rounded-xl text-white border border-white/10 text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="+91 9876543210"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-700 rounded-xl text-white border border-white/10 text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Final-year CS student | Frontend Developer (React, TypeScript)"
                    value={profileForm.headline}
                    onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-700 rounded-xl text-white border border-white/10 text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Bio</label>
                  <textarea
                    rows={3}
                    placeholder="Tell recruiters about yourself, your interests, and career goals..."
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-700 rounded-xl text-white border border-white/10 text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Education
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech Computer Science, 2025"
                      value={profileForm.education}
                      onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-700 rounded-xl text-white border border-white/10 text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Experience / Internships
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Web Developer Intern at Company (6 months)"
                      value={profileForm.experience}
                      onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-700 rounded-xl text-white border border-white/10 text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Skills tags */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Skills (Type skill and press Enter)
                  </label>
                  <div className="flex flex-wrap gap-2 p-2 bg-surface-700 rounded-xl border border-white/10 mb-2">
                    {skillsList.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-600/30 border border-primary-500/40 text-primary-300 rounded-lg text-xs font-medium"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-white cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Add skill (e.g. React)..."
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                      className="flex-1 min-w-[120px] bg-transparent text-sm text-white focus:outline-none px-2 py-0.5"
                    />
                  </div>
                </div>

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={profileForm.githubUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-700 rounded-xl text-white border border-white/10 text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={profileForm.linkedinUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-700 rounded-xl text-white border border-white/10 text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Portfolio / Website
                    </label>
                    <input
                      type="url"
                      placeholder="https://myportfolio.dev"
                      value={profileForm.portfolioUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, portfolioUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-700 rounded-xl text-white border border-white/10 text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Resume Upload section */}
                <div className="pt-4 border-t border-white/10">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Resume Document
                  </label>
                  {user.resumeUrl && (
                    <div className="mb-3 p-3 bg-surface-700/50 rounded-xl border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-primary-400" />
                        <div>
                          <p className="text-sm font-medium text-white">
                            {user.resumeName || 'Default Resume'}
                          </p>
                          <a
                            href={user.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary-400 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            Preview current resume <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-primary-500/50 transition-colors">
                    <Upload className="mx-auto text-text-muted mb-1" size={24} />
                    <label className="text-sm font-medium text-primary-400 hover:underline cursor-pointer block">
                      {resumeFile ? resumeFile.name : 'Upload updated resume (PDF/DOCX)'}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      />
                    </label>
                    <p className="text-xs text-text-muted mt-1">Files supported: PDF, DOC, DOCX up to 5MB</p>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" variant="primary" disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      )}

      {/* -------------------- RECRUITER DASHBOARD -------------------- */}
      {(user.role === 'RECRUITER' || user.role === 'ADMIN') && (
        <div className="space-y-8">
          {/* Recruiter Analytics Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-500/10 text-primary-400 rounded-xl">
                  <Briefcase size={22} />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase font-semibold">Active Jobs</p>
                  <p className="text-2xl font-bold text-white">
                    {recruiterStats ? recruiterStats.activeJobs : recruiterJobs.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent-500/10 text-accent-400 rounded-xl">
                  <FileText size={22} />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase font-semibold">Total Applicants</p>
                  <p className="text-2xl font-bold text-white">
                    {recruiterStats ? recruiterStats.totalApplicants : recruiterApplications.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-warning/10 text-warning rounded-xl">
                  <Clock size={22} />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase font-semibold">Under Review</p>
                  <p className="text-2xl font-bold text-white">
                    {recruiterStats
                      ? recruiterStats.reviewing
                      : recruiterApplications.filter((a) => a.status === 'REVIEWING').length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-success/10 text-success rounded-xl">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase font-semibold">Shortlisted</p>
                  <p className="text-2xl font-bold text-white">
                    {recruiterStats
                      ? recruiterStats.shortlisted
                      : recruiterApplications.filter((a) => a.status === 'SHORTLISTED').length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Recruiter Tabs */}
          <div className="flex border-b border-white/10 gap-6">
            <button
              onClick={() => setActiveTab('applications')}
              className={`pb-4 text-sm font-semibold transition-colors relative cursor-pointer ${
                activeTab === 'applications'
                  ? 'text-primary-400'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Applicant Review Portal ({recruiterApplications.length})
              {activeTab === 'applications' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`pb-4 text-sm font-semibold transition-colors relative cursor-pointer ${
                activeTab === 'jobs' ? 'text-primary-400' : 'text-text-secondary hover:text-white'
              }`}
            >
              My Job Postings ({recruiterJobs.length})
              {activeTab === 'jobs' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400" />
              )}
            </button>
          </div>

          {/* TAB: RECRUITER APPLICANT REVIEW PORTAL */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              {/* Filter by job */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-800 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Filter size={16} />
                  <span>Filter by job posting:</span>
                </div>
                <select
                  value={selectedJobFilter}
                  onChange={(e) => setSelectedJobFilter(e.target.value)}
                  className="bg-surface-700 text-sm text-white rounded-xl px-3 py-2 border border-white/10 focus:outline-none focus:border-primary-500"
                >
                  <option value="ALL">All Postings ({recruiterApplications.length})</option>
                  {recruiterJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({recruiterApplications.filter((a) => a.jobId === j.id).length})
                    </option>
                  ))}
                </select>
              </div>

              {isLoadingRecruiterData ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : filteredRecruiterApps.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                  <FileText size={36} className="mx-auto text-text-muted mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-1">No Applications Found</h3>
                  <p className="text-text-secondary">
                    Applications submitted by students will appear here for review.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredRecruiterApps.map((app) => (
                    <Card key={app.id} className="p-6">
                      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-white">{app.student?.name}</h3>
                            <span className="text-xs text-text-muted">
                              applied for <span className="text-primary-400 font-medium">{app.job?.title}</span>
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted mt-1.5">
                            {app.student?.email && (
                              <span className="flex items-center gap-1">
                                <Mail size={13} /> {app.student.email}
                              </span>
                            )}
                            {app.student?.phone && (
                              <span className="flex items-center gap-1">
                                <Phone size={13} /> {app.student.phone}
                              </span>
                            )}
                            {app.student?.education && (
                              <span className="flex items-center gap-1">
                                <GraduationCap size={13} /> {app.student.education}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-text-muted">Status:</span>
                          <select
                            value={app.status}
                            onChange={(e) =>
                              handleStatusChange(app.id, e.target.value as ApplicationStatus)
                            }
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                              app.status === 'ACCEPTED'
                                ? 'bg-success/20 text-success border-success/30'
                                : app.status === 'SHORTLISTED'
                                ? 'bg-primary-500/20 text-primary-300 border-primary-500/40'
                                : app.status === 'REJECTED'
                                ? 'bg-error/20 text-error border-error/30'
                                : 'bg-warning/20 text-warning border-warning/30'
                            }`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="REVIEWING">REVIEWING</option>
                            <option value="SHORTLISTED">SHORTLISTED</option>
                            <option value="ACCEPTED">ACCEPTED</option>
                            <option value="REJECTED">REJECTED</option>
                          </select>
                        </div>
                      </div>

                      {/* Cover note */}
                      {app.coverNote && (
                        <div className="bg-surface-700/40 rounded-xl p-3 mb-4 text-xs text-text-secondary leading-relaxed border border-white/5">
                          <span className="font-semibold text-white block mb-1">Cover Note:</span>
                          {app.coverNote}
                        </div>
                      )}

                      {/* Candidate Skills */}
                      {app.student?.skills && app.student.skills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mb-4">
                          <span className="text-xs text-text-muted mr-1">Skills:</span>
                          {app.student.skills.map((s, idx) => (
                            <Badge key={idx} variant="secondary" size="sm">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Resume link & External profiles */}
                      <div className="pt-3 border-t border-white/5 flex flex-wrap justify-between items-center gap-3">
                        <div className="flex items-center gap-3">
                          {app.resumeUrl || app.student?.resumeUrl ? (
                            <a
                              href={app.resumeUrl || app.student?.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-700 hover:bg-surface-600 text-primary-300 text-xs font-medium transition-colors"
                            >
                              <FileText size={14} /> View Candidate Resume <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span className="text-xs text-text-muted">No resume attached</span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-text-secondary text-xs">
                          {app.student?.githubUrl && (
                            <a
                              href={app.student.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-white"
                            >
                              <Github size={15} />
                            </a>
                          )}
                          {app.student?.linkedinUrl && (
                            <a
                              href={app.student.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-white"
                            >
                              <Linkedin size={15} />
                            </a>
                          )}
                          {app.student?.portfolioUrl && (
                            <a
                              href={app.student.portfolioUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-white"
                            >
                              <Globe size={15} />
                            </a>
                          )}
                          <span className="text-text-muted ml-2">
                            Applied {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: MY JOB POSTINGS */}
          {activeTab === 'jobs' && (
            <div>
              {isLoadingRecruiterData ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : recruiterJobs.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                  <Briefcase size={36} className="mx-auto text-text-muted mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-1">No Active Postings</h3>
                  <p className="text-text-secondary mb-4">
                    Create a new job posting to attract qualified candidates.
                  </p>
                  <Button variant="primary" onClick={() => setIsPostJobModalOpen(true)}>
                    <Plus size={16} className="mr-2" /> Post a Job
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {recruiterJobs.map((j) => (
                    <Card key={j.id} className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-white">{j.title}</h3>
                          <Badge variant={j.status === 'ACTIVE' ? 'success' : 'secondary'} size="sm">
                            {j.status}
                          </Badge>
                          <Badge variant="primary" size="sm">
                            {j.applicationsCount || 0} applicants
                          </Badge>
                        </div>
                        <p className="text-sm text-text-secondary">
                          {j.location} • {j.jobType} • {j.workplaceType} • Posted{' '}
                          {new Date(j.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-auto">
                        <Link to={`/jobs/${j.id}`}>
                          <Button variant="secondary" size="sm">
                            View <ExternalLink size={14} className="ml-1" />
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteJob(j.id, j.title)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Post Job Modal */}
      <Modal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        title="Post a New Job Opportunity"
      >
        <PostJobForm onSubmit={handlePostJob} />
      </Modal>
    </div>
  );
};

export default DashboardPage;

