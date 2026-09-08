import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to login');
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
        Login
      </Button>

      <p className="text-center text-sm text-text-secondary">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
          Register
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
