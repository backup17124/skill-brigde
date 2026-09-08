import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Sparkles, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-800/90 border-t border-white/10 pt-14 pb-8 mt-auto backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">
              <Sparkles size={22} className="text-primary-400" />
              SkillBridge
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              Your Premier Career Launchpad. Empowering students, freshers, and early-career
              professionals with transparent application tracking and verified job opportunities.
            </p>

            <div className="pt-2 space-y-2 text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-primary-400 shrink-0" />
                <span>Enzyme Office Space, Sector 7, HSR Layout, Bengaluru</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-accent-400 shrink-0" />
                <a href="tel:08062178600" className="hover:text-primary-400 transition-colors">
                  08062178600 (Support Toll-free)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-success shrink-0" />
                <a href="mailto:support@launched.org.in" className="hover:text-primary-400 transition-colors">
                  support@launched.org.in
                </a>
              </div>
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">
              For Candidates
            </h4>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li>
                <Link to="/jobs" className="hover:text-primary-400 transition-colors">
                  Explore Jobs & Internships
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary-400 transition-colors">
                  Track Applications
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary-400 transition-colors">
                  Saved Opportunities
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary-400 transition-colors">
                  Manage Profile & Resume
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">
              For Employers
            </h4>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li>
                <Link to="/dashboard" className="hover:text-primary-400 transition-colors">
                  Post a Job Opening
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary-400 transition-colors">
                  Review Candidate Resumes
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary-400 transition-colors">
                  Recruiter Portal
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary-400 transition-colors">
                  Register as Employer
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text-muted">
          <p>&copy; {new Date().getFullYear()} SkillBridge Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart size={14} className="text-error fill-error" /> for students & job seekers across India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

