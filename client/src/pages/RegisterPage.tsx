import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400 mb-2">
            SkillBridge
          </Link>
          <h2 className="text-3xl font-bold text-white tracking-tight">Create an account</h2>
          <p className="mt-2 text-text-secondary">Join the premium network for students and recruiters</p>
        </div>

        <div className="glass-strong rounded-2xl p-8 shadow-2xl">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
