import React from 'react';
import Card from '../components/common/Card';
import { FileText, CheckCircle } from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-fade-in space-y-8">
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-3">
          <FileText size={14} /> Legal Documentation
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Terms and Conditions</h1>
        <p className="text-text-secondary text-sm mt-1">
          Last updated: September 2026 • Please read these terms carefully before using SkillBridge.
        </p>
      </div>

      <Card className="p-8 space-y-8 text-text-secondary text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle size={18} className="text-primary-400" /> 1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the SkillBridge platform (the "Service"), you agree to be bound by
            these Terms and Conditions and our Privacy Policy. If you do not agree with any part of
            these terms, you must not access or use the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle size={18} className="text-primary-400" /> 2. User Accounts & Eligibility
          </h2>
          <p>
            To access certain features of the platform, you must register for an account. You agree to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Provide true, accurate, current, and complete information during registration.</li>
            <li>Maintain the security and confidentiality of your credentials.</li>
            <li>Promptly notify us of any unauthorized use of your account.</li>
          </ul>
          <p>
            SkillBridge supports distinct account roles: <strong className="text-white">Students</strong>,{' '}
            <strong className="text-white">Recruiters</strong>, and{' '}
            <strong className="text-white">Administrators</strong>. You may not misrepresent your identity or credentials.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle size={18} className="text-primary-400" /> 3. Candidate & Student Conduct
          </h2>
          <p>
            Students utilizing the Service agree that all resumes, contact details, educational history,
            and cover notes submitted through the platform reflect authentic background and qualifications.
            Submission of falsified academic records or fraudulent documents may result in immediate
            account termination.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle size={18} className="text-primary-400" /> 4. Recruiter & Job Posting Policies
          </h2>
          <p>
            Employers and recruiters posting opportunities on SkillBridge agree that:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>All job and internship postings represent genuine, active hiring requirements.</li>
            <li>Compensation details (INR) and workplace expectations (Remote, Hybrid, On-site) are transparent and accurate.</li>
            <li>Postings comply with all applicable employment and labor regulations.</li>
            <li>Applicant data (including resumes and phone numbers) is used solely for legitimate recruitment evaluations.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle size={18} className="text-primary-400" /> 5. Prohibited Activities
          </h2>
          <p>When using the Service, you agree not to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Scrape, spider, or harvest candidate or job data without written authorization.</li>
            <li>Transmit any spam, chain letters, or unsolicited advertising.</li>
            <li>Upload malicious scripts, viruses, or corrupt document files.</li>
            <li>Attempt to bypass access controls or breach platform security.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle size={18} className="text-primary-400" /> 6. Intellectual Property
          </h2>
          <p>
            The SkillBridge brand, design system, code, and platform architecture are the exclusive
            property of SkillBridge. Candidates retain all ownership rights to their uploaded resumes
            and portfolio content.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle size={18} className="text-primary-400" /> 7. Limitation of Liability
          </h2>
          <p>
            SkillBridge facilitates connections between candidates and employers but does not guarantee
            employment offers or the hiring outcomes of any application. The Service is provided on an
            "as is" and "as available" basis.
          </p>
        </section>

        <section className="space-y-3 border-t border-white/5 pt-6">
          <h2 className="text-lg font-bold text-white">Contact Regarding Terms</h2>
          <p>
            Questions regarding these Terms should be sent to{' '}
            <a href="mailto:legal@skillbridge.dev" className="text-primary-400 hover:underline">
              legal@skillbridge.dev
            </a>{' '}
            or support@launched.org.in.
          </p>
        </section>
      </Card>
    </div>
  );
};

export default TermsPage;

