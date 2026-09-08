import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, GraduationCap, Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'RECRUITER'>('STUDENT');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.register(name, email, password, role);
      login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm text-center">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            className={`
              flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
              ${role === 'STUDENT' 
                ? 'border-primary-500 bg-primary-500/10 text-white' 
                : 'border-surface-600 bg-surface-700/50 text-text-muted hover:border-surface-500'}
            `}
          >
            <GraduationCap size={24} className="mb-2" />
            <span className="text-sm font-medium">Student</span>
          </button>
          
          <button
            type="button"
            onClick={() => setRole('RECRUITER')}
            className={`
              flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
              ${role === 'RECRUITER' 
                ? 'border-accent-500 bg-accent-500/10 text-white' 
                : 'border-surface-600 bg-surface-700/50 text-text-muted hover:border-surface-500'}
            `}
          >
            <Building2 size={24} className="mb-2" />
            <span className="text-sm font-medium">Recruiter</span>
          </button>
        </div>

        <Input
          type="text"
          label="Full Name"
          placeholder="John Doe"
          icon={UserIcon}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button type="submit" fullWidth isLoading={isLoading}>
        Create Account
      </Button>

      <p className="text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
          Login
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
