import React from 'react';
import Card from '../components/common/Card';
import { Shield, Lock, Eye, Server, Database } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-fade-in space-y-8">
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-500/10 text-accent-400 border border-accent-500/20 mb-3">
          <Shield size={14} /> Trust & Transparency
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-text-secondary text-sm mt-1">
          Effective Date: September 2026 • Your privacy and data security are our top priorities.
        </p>
      </div>

      <Card className="p-8 space-y-8 text-text-secondary text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock size={18} className="text-accent-400" /> 1. Information We Collect
          </h2>
          <p>
            When you create an account, build your profile, or submit applications on SkillBridge, we
            collect:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong className="text-white">Account Details:</strong> Name, email address, password
              (hashed with bcrypt), and assigned role (Student / Recruiter).
            </li>
            <li>
              <strong className="text-white">Candidate Profile Data:</strong> Contact number, bio,
              headline, educational background, work experience, skill tags, and social/portfolio
              links.
            </li>
            <li>
              <strong className="text-white">Resume Documents:</strong> PDF, DOC, and DOCX files
              uploaded directly for job applications.
            </li>
            <li>
              <strong className="text-white">Application Records:</strong> Positions applied to, cover
              notes, review timestamps, and application statuses.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye size={18} className="text-accent-400" /> 2. How We Use Your Data
          </h2>
          <p>We use your information exclusively to provide and enhance career services:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Facilitate direct job application submissions to employers.</li>
            <li>Provide real-time application tracking milestones for candidates.</li>
            <li>Enable recruiters to review applicant qualifications and resumes.</li>
            <li>Deliver system analytics and prevent fraudulent activity.</li>
          </ul>
          <p>
            <strong className="text-white">We never sell candidate data</strong> to third-party brokers
            or advertisers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Server size={18} className="text-accent-400" /> 3. Security & Data Protection
          </h2>
          <p>
            We implement industry-standard safeguards:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong className="text-white">Password Security:</strong> Passwords are cryptographically
              hashed using bcrypt with 12 salt rounds before storage.
            </li>
            <li>
              <strong className="text-white">Token Safety:</strong> Access tokens are kept in transient
              application memory, and refresh tokens are stored in secure, HttpOnly cookies to shield
              against cross-site scripting (XSS).
            </li>
            <li>
              <strong className="text-white">Upload Restrictions:</strong> File uploads are sanitized,
              scanned for extension spoofing, and capped at 5MB.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database size={18} className="text-accent-400" /> 4. Cookies & Storage
          </h2>
          <p>
            We use minimal cookies necessary for platform operation:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>An HttpOnly refresh token cookie for keeping you logged in securely.</li>
            <li>A local storage preference (<code className="text-accent-400">skillbridge_theme</code>) to preserve your dark/light mode preference.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-white/5 pt-6">
          <h2 className="text-lg font-bold text-white">Privacy Inquiries</h2>
          <p>
            To exercise your right to access, export, or delete your personal data, reach out to{' '}
            <a href="mailto:privacy@skillbridge.dev" className="text-accent-400 hover:underline">
              privacy@skillbridge.dev
            </a>{' '}
            or contact our team at support@launched.org.in.
          </p>
        </section>
      </Card>
    </div>
  );
};

export default PrivacyPage;

