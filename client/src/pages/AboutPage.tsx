import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import {
  Target,
  Sparkles,
  Compass,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Award,
} from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-fade-in space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-400 border border-primary-500/20">
          <Sparkles size={14} /> Empowering Future Professionals
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Bridging the Gap Between{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">
            Education & Career
          </span>
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed">
          SkillBridge is built specifically for students, freshers, and early-career seekers. We
          eliminate the noise of cluttered job portals by providing transparent application tracking,
          verified internships, and intuitive career management tools.
        </p>
      </div>

      {/* The Problem & Our Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 border-error/20 bg-surface-800/40">
          <div className="w-12 h-12 rounded-xl bg-error/10 text-error flex items-center justify-center mb-4">
            <Compass size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">The Problem We Solve</h3>
          <p className="text-text-secondary leading-relaxed text-sm">
            Traditional job boards are overloaded with sponsored clutter, lack clear entry-level
            distinctions, and leave applicants in the dark with zero visibility into whether their
            resume was ever reviewed. For freshers, entering the industry feels overwhelming and
            opaque.
          </p>
        </Card>

        <Card className="p-8 border-success/20 bg-surface-800/40">
          <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center mb-4">
            <Target size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Our Transparent Solution</h3>
          <p className="text-text-secondary leading-relaxed text-sm">
            SkillBridge provides a unified, distraction-free platform where candidates explore
            curated jobs and internships, upload their resumes, and watch their application progress
            step-by-step through real-time status stages (Pending, Reviewing, Shortlisted, Accepted).
          </p>
        </Card>
      </div>

      {/* Core Pillars */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Why Choose SkillBridge</h2>
          <p className="text-text-secondary text-sm">Designed from the ground up for modern campus hiring.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="p-3 bg-primary-500/10 text-primary-400 rounded-xl w-fit mb-4">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Verified Roles</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Every job and internship is reviewed to ensure authentic opportunities for junior talent.
            </p>
          </Card>

          <Card className="p-6">
            <div className="p-3 bg-accent-500/10 text-accent-400 rounded-xl w-fit mb-4">
              <TrendingUp size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Live Application Tracker</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              No more guessing. Get live notifications as your resume moves through recruiter review stages.
            </p>
          </Card>

          <Card className="p-6">
            <div className="p-3 bg-warning/10 text-warning rounded-xl w-fit mb-4">
              <Award size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Resume & Skills First</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Highlight projects, skills tags, and upload verified resumes directly to your profile.
            </p>
          </Card>

          <Card className="p-6">
            <div className="p-3 bg-success/10 text-success rounded-xl w-fit mb-4">
              <ShieldCheck size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Zero Spam Guarantee</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Clean, distraction-free environment with no sponsored redirects or misleading postings.
            </p>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <Card glass className="p-8 sm:p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-accent-400 to-primary-500" />
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Accelerate Your Career?</h2>
        <p className="text-text-secondary max-w-xl mx-auto mb-8 text-sm sm:text-base">
          Join thousands of students and fresh graduates exploring internships and full-time opportunities.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/jobs">
            <Button variant="primary" size="lg">
              Explore Available Jobs
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg">
              Create Free Account
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AboutPage;

