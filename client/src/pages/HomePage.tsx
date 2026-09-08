import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Briefcase, GraduationCap, Building2, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { jobService } from '../services/jobService';
import { Job } from '../types';
import JobCard from '../components/jobs/JobCard';
import Spinner from '../components/common/Spinner';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getJobs({ limit: 6, page: 1 });
        setRecentJobs(data.data.jobs);
      } catch (error) {
        console.error('Failed to fetch jobs', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/jobs');
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 blur-[100px] rounded-full mix-blend-screen" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-800 border border-white/10 mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
            <span className="text-sm font-medium text-text-secondary">Over 500+ opportunities waiting for you</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Launch Your Career with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
              SkillBridge
            </span>
          </h1>
          
          <p className="mt-4 text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
            The premium platform connecting ambitious students with top-tier companies. Find internships, entry-level roles, and start your journey today.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="relative flex items-center p-2 bg-surface-800/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl focus-within:border-primary-500/50 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
              <Search className="absolute left-6 text-text-muted" size={24} />
              <input
                type="text"
                placeholder="Job title, skills, or company..."
                className="w-full pl-16 pr-32 py-4 bg-transparent text-white placeholder:text-text-muted focus:outline-none text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" size="lg" className="absolute right-2 px-8">
                Search
              </Button>
            </div>
          </form>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-text-secondary animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">500+</span>
              <span>Active Jobs</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">200+</span>
              <span>Top Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">10K+</span>
              <span>Students Hired</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How SkillBridge Works</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Your journey from student to professional in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center" hover glass>
              <div className="w-16 h-16 mx-auto bg-primary-500/10 rounded-2xl flex items-center justify-center mb-6">
                <GraduationCap size={32} className="text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Create Profile</h3>
              <p className="text-text-secondary">Build a standout profile highlighting your skills, education, and projects.</p>
            </Card>

            <Card className="p-8 text-center" hover glass>
              <div className="w-16 h-16 mx-auto bg-accent-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase size={32} className="text-accent-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. Find Jobs</h3>
              <p className="text-text-secondary">Explore internships and entry-level roles tailored to your skills.</p>
            </Card>

            <Card className="p-8 text-center" hover glass>
              <div className="w-16 h-16 mx-auto bg-success/10 rounded-2xl flex items-center justify-center mb-6">
                <Building2 size={32} className="text-success" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. Get Hired</h3>
              <p className="text-text-secondary">Apply with one click, interview with top companies, and launch your career.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Latest Opportunities</h2>
              <p className="text-text-secondary">Discover the most recent job postings from our partners.</p>
            </div>
            <Link to="/jobs" className="hidden md:flex items-center text-primary-400 hover:text-primary-300 font-medium transition-colors">
              View all jobs <ArrowRight size={20} className="ml-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" onClick={() => navigate('/jobs')} fullWidth>
              View All Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-900/20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to start your journey?</h2>
          <p className="text-xl text-text-secondary mb-10">Join thousands of students who have already found their dream roles through SkillBridge.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/register')} className="px-8">
              Create an Account
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/jobs')} className="px-8">
              Browse Jobs
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
