import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', category: 'general', message: '' });
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-fade-in space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-400 border border-primary-500/20">
          <Sparkles size={14} /> Here For You
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Get in Touch with{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">
            SkillBridge
          </span>
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed">
          Have a question about applications, recruiter hiring, or platform features? Our dedicated
          support team is ready to assist you.
        </p>
      </div>

      {/* Main Grid: Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-8 space-y-6 bg-surface-800/60 border-white/5">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="text-primary-400" size={24} />
              Contact Details
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Reach out through any of our official channels or visit our Bengaluru headquarters.
            </p>

            <div className="space-y-5 pt-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center shrink-0 mt-1">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Registered & Operating Office</h4>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    Enzyme Office Space, Backside of Star Bazaar,<br />
                    Sector 7, HSR Layout, Bengaluru,<br />
                    Karnataka - 560102, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent-500/10 text-accent-400 flex items-center justify-center shrink-0 mt-1">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Telephone Support</h4>
                  <a
                    href="tel:08062178600"
                    className="text-xs text-primary-400 hover:text-primary-300 font-mono mt-1 block"
                  >
                    08062178600
                  </a>
                  <span className="text-[11px] text-text-muted">Toll-free across India</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0 mt-1">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Email Inquiries</h4>
                  <a
                    href="mailto:support@launched.org.in"
                    className="text-xs text-primary-400 hover:text-primary-300 mt-1 block"
                  >
                    support@launched.org.in
                  </a>
                  <span className="text-[11px] text-text-muted">Average response time: &lt; 24 business hours</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center shrink-0 mt-1">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Operating Hours</h4>
                  <p className="text-xs text-text-secondary mt-1">
                    Monday – Friday: 9:00 AM – 6:00 PM IST<br />
                    Closed on National Holidays
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Notice */}
          <div className="p-4 rounded-xl border border-primary-500/20 bg-primary-500/5 text-xs text-text-secondary leading-relaxed">
            <strong className="text-primary-400 block mb-1">Looking to post open roles?</strong>
            Recruiters can register directly with a company profile and publish job openings
            instantly from their dashboard without any setup fees.
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7">
          <Card className="p-8 bg-surface-800/60 border-white/5">
            <h2 className="text-2xl font-bold text-white mb-2">Send Us a Message</h2>
            <p className="text-sm text-text-secondary mb-6">
              Fill out the form below and our candidate & employer support representatives will get
              back to you shortly.
            </p>

            {submitted ? (
              <div className="p-6 rounded-xl bg-success/10 border border-success/20 text-center space-y-4 my-8">
                <CheckCircle2 className="mx-auto text-success" size={48} />
                <h3 className="text-lg font-bold text-white">Message Delivered Successfully!</h3>
                <p className="text-sm text-text-secondary max-w-md mx-auto">
                  Thank you for contacting SkillBridge. We have logged your request and our support
                  team will email you at the address provided within 1 business day.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name *"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Your Email *"
                    type="email"
                    required
                    placeholder="e.g. rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-secondary">Topic Category</label>
                    <select
                      className="w-full bg-surface-700/50 border border-surface-500 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500/20"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="student">Student / Application Support</option>
                      <option value="recruiter">Recruiter / Employer Partnership</option>
                      <option value="technical">Technical Bug Report</option>
                      <option value="feedback">Feedback & Suggestions</option>
                    </select>
                  </div>
                  <Input
                    label="Subject *"
                    required
                    placeholder="Brief summary of inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-secondary">Your Message *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Describe your inquiry, issue, or feedback in detail..."
                    className="w-full bg-surface-700/50 border border-surface-500 rounded-lg p-3 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500/20 transition-all resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto flex items-center gap-2">
                    <Send size={16} className="mr-1.5" />
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-6 pt-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <HelpCircle className="text-accent-400" size={24} />
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Quick answers to common questions about SkillBridge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-surface-800/40">
            <h3 className="font-semibold text-white text-base mb-2">How do I track my submitted applications?</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Navigate to your Student Dashboard and select the <strong>Applications</strong> tab. You will see
              live status badges indicating whether your application is Pending, Reviewing, Shortlisted,
              Accepted, or Rejected.
            </p>
          </Card>

          <Card className="p-6 bg-surface-800/40">
            <h3 className="font-semibold text-white text-base mb-2">Is SkillBridge free for student applicants?</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Yes, SkillBridge is completely free for students and job seekers. You can browse, bookmark,
              upload your resume, and submit unlimited applications with zero fees.
            </p>
          </Card>

          <Card className="p-6 bg-surface-800/40">
            <h3 className="font-semibold text-white text-base mb-2">How does an employer post new jobs?</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Sign up or log in with a <strong>Recruiter</strong> account. From your Recruiter Dashboard, click
              "Post New Job", enter salary, requirements, and deadlines, and your listing will be published.
            </p>
          </Card>

          <Card className="p-6 bg-surface-800/40">
            <h3 className="font-semibold text-white text-base mb-2">What file formats are accepted for resumes?</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Our system accepts PDF, DOC, and DOCX files up to 5MB. You can upload your primary resume
              in your Profile or attach an updated copy directly when applying for a position.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
