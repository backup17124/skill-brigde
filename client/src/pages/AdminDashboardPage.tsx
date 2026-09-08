import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import { jobService } from '../services/jobService';
import { AdminStats, Role, Job } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';
import Pagination from '../components/common/Pagination';
import {
  Users,
  Briefcase,
  FileCheck,
  Trash2,
  Search,
  Clock,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Users state
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Jobs moderation state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobSearch, setJobSearch] = useState('');
  const [jobPage, setJobPage] = useState(1);
  const [jobTotalPages, setJobTotalPages] = useState(1);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  // Messages
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoadingStats(true);
      const res = await adminService.getStats();
      setStats(res.data);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to load platform analytics' });
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const res = await adminService.listUsers({
        search: userSearch || undefined,
        role: userRoleFilter === 'ALL' ? undefined : userRoleFilter,
        page: userPage,
        limit: 10,
      });
      setUsers(res.data.users);
      setUserTotalPages(res.data.totalPages || 1);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setIsLoadingJobs(true);
      const res = await jobService.getJobs({
        search: jobSearch || undefined,
        page: jobPage,
        limit: 10,
      });
      setJobs(res.data.jobs);
      setJobTotalPages(res.data.totalPages || 1);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'jobs') {
      fetchJobs();
    }
  }, [activeTab, userPage, userRoleFilter, jobPage]);

  const handleSearchUsers = (e: React.FormEvent) => {
    e.preventDefault();
    setUserPage(1);
    fetchUsers();
  };

  const handleSearchJobs = (e: React.FormEvent) => {
    e.preventDefault();
    setJobPage(1);
    fetchJobs();
  };

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      setMessage({ type: 'success', text: `User role successfully updated to ${newRole}` });
      fetchUsers();
      fetchStats();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to update role',
      });
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This cannot be undone.`)) {
      return;
    }
    try {
      await adminService.deleteUser(userId);
      setMessage({ type: 'success', text: `User "${userName}" deleted successfully` });
      fetchUsers();
      fetchStats();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to delete user',
      });
    }
  };

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!window.confirm(`Are you sure you want to remove job posting "${jobTitle}"?`)) {
      return;
    }
    try {
      await adminService.deleteJob(jobId);
      setMessage({ type: 'success', text: `Job "${jobTitle}" removed successfully` });
      fetchJobs();
      fetchStats();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to delete job',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-accent-500/10 text-accent-400">
              <ShieldCheck size={24} />
            </span>
            <h1 className="text-3xl font-bold text-white">Admin Control Center</h1>
          </div>
          <p className="text-text-secondary">
            Manage system users, moderate job postings, and review platform metrics.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-success/10 border border-success/30 text-success'
              : 'bg-error/10 border border-error/30 text-error'
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="text-xs uppercase font-bold hover:underline cursor-pointer ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-white/10 mb-8 gap-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-4 text-sm font-semibold transition-colors relative cursor-pointer ${
            activeTab === 'overview' ? 'text-primary-400' : 'text-text-secondary hover:text-white'
          }`}
        >
          Platform Overview
          {activeTab === 'overview' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-4 text-sm font-semibold transition-colors relative cursor-pointer ${
            activeTab === 'users' ? 'text-primary-400' : 'text-text-secondary hover:text-white'
          }`}
        >
          User Management
          {activeTab === 'users' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`pb-4 text-sm font-semibold transition-colors relative cursor-pointer ${
            activeTab === 'jobs' ? 'text-primary-400' : 'text-text-secondary hover:text-white'
          }`}
        >
          Job Moderation
          {activeTab === 'jobs' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400" />
          )}
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <>
          {isLoadingStats ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : stats ? (
            <div className="space-y-8">
              {/* Analytics Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-500/10 text-primary-400 rounded-xl">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-text-muted font-medium">Total Registered</p>
                      <p className="text-2xl font-bold text-white">{stats.users.total}</p>
                      <p className="text-xs text-text-secondary mt-1">
                        {stats.users.students} Students • {stats.users.recruiters} Recruiters
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent-500/10 text-accent-400 rounded-xl">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-text-muted font-medium">Platform Jobs</p>
                      <p className="text-2xl font-bold text-white">{stats.jobs.total}</p>
                      <p className="text-xs text-text-secondary mt-1">
                        {stats.jobs.active} Active • {stats.jobs.closed} Closed
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-success/10 text-success rounded-xl">
                      <FileCheck size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-text-muted font-medium">Total Applications</p>
                      <p className="text-2xl font-bold text-white">{stats.applications.total}</p>
                      <p className="text-xs text-text-secondary mt-1">
                        {stats.applications.accepted} Accepted • {stats.applications.shortlisted} Shortlisted
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-warning/10 text-warning rounded-xl">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-text-muted font-medium">Under Review</p>
                      <p className="text-2xl font-bold text-white">
                        {stats.applications.pending + stats.applications.reviewing}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        {stats.applications.pending} Pending • {stats.applications.reviewing} Reviewing
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Status Breakdown Grid */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Application Pipeline Breakdown</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div className="p-4 rounded-xl bg-surface-800 border border-white/5 text-center">
                    <p className="text-xs text-text-muted uppercase font-semibold">Pending</p>
                    <p className="text-2xl font-bold text-warning mt-1">{stats.applications.pending}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-800 border border-white/5 text-center">
                    <p className="text-xs text-text-muted uppercase font-semibold">Reviewing</p>
                    <p className="text-2xl font-bold text-accent-400 mt-1">{stats.applications.reviewing}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-800 border border-white/5 text-center">
                    <p className="text-xs text-text-muted uppercase font-semibold">Shortlisted</p>
                    <p className="text-2xl font-bold text-primary-400 mt-1">{stats.applications.shortlisted}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-800 border border-white/5 text-center">
                    <p className="text-xs text-text-muted uppercase font-semibold">Accepted</p>
                    <p className="text-2xl font-bold text-success mt-1">{stats.applications.accepted}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-800 border border-white/5 text-center">
                    <p className="text-xs text-text-muted uppercase font-semibold">Rejected</p>
                    <p className="text-2xl font-bold text-error mt-1">{stats.applications.rejected}</p>
                  </div>
                </div>
              </Card>

              {/* Recent Platform Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Users size={18} className="text-primary-400" /> Recent Signups
                  </h3>
                  <div className="divide-y divide-white/5">
                    {stats.recentUsers.map((u) => (
                      <div key={u.id} className="py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">{u.name}</p>
                          <p className="text-xs text-text-muted">{u.email}</p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                              u.role === 'ADMIN'
                                ? 'bg-accent-500/20 text-accent-300'
                                : u.role === 'RECRUITER'
                                ? 'bg-primary-500/20 text-primary-300'
                                : 'bg-surface-700 text-text-secondary'
                            }`}
                          >
                            {u.role}
                          </span>
                          <p className="text-[11px] text-text-muted mt-1">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recent Applications */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FileCheck size={18} className="text-success" /> Recent Applications
                  </h3>
                  <div className="divide-y divide-white/5">
                    {stats.recentApplications.map((app) => (
                      <div key={app.id} className="py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">{app.student.name}</p>
                          <p className="text-xs text-text-muted">
                            applied to <span className="text-white">{app.job.title}</span> at{' '}
                            {app.job.company}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              app.status === 'ACCEPTED'
                                ? 'success'
                                : app.status === 'SHORTLISTED'
                                ? 'primary'
                                : app.status === 'REJECTED'
                                ? 'danger'
                                : 'warning'
                            }
                            size="sm"
                          >
                            {app.status}
                          </Badge>
                          <p className="text-[11px] text-text-muted mt-1">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          ) : null}
        </>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
              <form onSubmit={handleSearchUsers} className="flex gap-2 w-full md:w-80">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-3 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search by name, email, org..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-surface-700 rounded-xl text-sm text-white placeholder-text-muted border border-white/10 focus:outline-none focus:border-primary-500"
                  />
                </div>
                <Button type="submit" size="sm">
                  Search
                </Button>
              </form>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs text-text-muted whitespace-nowrap">Filter Role:</span>
                <select
                  value={userRoleFilter}
                  onChange={(e) => {
                    setUserRoleFilter(e.target.value);
                    setUserPage(1);
                  }}
                  className="bg-surface-700 text-sm text-white rounded-xl px-3 py-2 border border-white/10 focus:outline-none focus:border-primary-500"
                >
                  <option value="ALL">All Roles</option>
                  <option value="STUDENT">Student</option>
                  <option value="RECRUITER">Recruiter</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>

            {isLoadingUsers ? (
              <div className="flex justify-center py-12">
                <Spinner size="md" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-center text-text-secondary py-10">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-text-muted text-xs uppercase">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Company/Org</th>
                      <th className="py-3 px-4">Activity</th>
                      <th className="py-3 px-4">Joined</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-surface-700/50 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-medium text-white">{u.name}</p>
                          <p className="text-xs text-text-muted">{u.email}</p>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                            className="bg-surface-700 text-xs text-white rounded-lg px-2 py-1 border border-white/10 focus:outline-none cursor-pointer"
                          >
                            <option value="STUDENT">STUDENT</option>
                            <option value="RECRUITER">RECRUITER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-text-secondary">{u.company || '—'}</td>
                        <td className="py-3 px-4 text-xs text-text-muted">
                          {u._count?.jobs > 0 && `${u._count.jobs} jobs `}
                          {u._count?.applications > 0 && `${u._count.applications} applications`}
                          {u._count?.jobs === 0 && u._count?.applications === 0 && '—'}
                        </td>
                        <td className="py-3 px-4 text-xs text-text-muted">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            title="Delete User"
                            className="p-1.5 text-text-muted hover:text-error rounded-lg hover:bg-surface-600 transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {userTotalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={userPage}
                  totalPages={userTotalPages}
                  onPageChange={(page) => setUserPage(page)}
                />
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 3: JOB MODERATION */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
              <form onSubmit={handleSearchJobs} className="flex gap-2 w-full md:w-80">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-3 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search by title, company..."
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-surface-700 rounded-xl text-sm text-white placeholder-text-muted border border-white/10 focus:outline-none focus:border-primary-500"
                  />
                </div>
                <Button type="submit" size="sm">
                  Search
                </Button>
              </form>
            </div>

            {isLoadingJobs ? (
              <div className="flex justify-center py-12">
                <Spinner size="md" />
              </div>
            ) : jobs.length === 0 ? (
              <p className="text-center text-text-secondary py-10">No job postings found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-text-muted text-xs uppercase">
                      <th className="py-3 px-4">Job Title</th>
                      <th className="py-3 px-4">Company</th>
                      <th className="py-3 px-4">Location / Type</th>
                      <th className="py-3 px-4">Posted By</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {jobs.map((j) => (
                      <tr key={j.id} className="hover:bg-surface-700/50 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-medium text-white">{j.title}</p>
                          <p className="text-xs text-text-muted">
                            {j.applicationsCount ? `${j.applicationsCount} applicants` : '0 applicants'}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-text-secondary">{j.company}</td>
                        <td className="py-3 px-4 text-xs text-text-secondary">
                          {j.location} • <span className="text-primary-400">{j.jobType}</span>
                        </td>
                        <td className="py-3 px-4 text-xs text-text-muted">
                          {j.postedBy?.name || 'Recruiter'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={j.status === 'ACTIVE' ? 'success' : 'secondary'}
                            size="sm"
                          >
                            {j.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <a
                            href={`/jobs/${j.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block p-1.5 text-text-muted hover:text-white rounded-lg hover:bg-surface-600 transition-colors"
                            title="View Public Post"
                          >
                            <ExternalLink size={16} />
                          </a>
                          <button
                            onClick={() => handleDeleteJob(j.id, j.title)}
                            title="Delete Job"
                            className="p-1.5 text-text-muted hover:text-error rounded-lg hover:bg-surface-600 transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {jobTotalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={jobPage}
                  totalPages={jobTotalPages}
                  onPageChange={(page) => setJobPage(page)}
                />
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;

