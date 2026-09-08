import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Sun, Moon, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import Button from '../common/Button';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-white/5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">
              SkillBridge
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-text-secondary hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/jobs" className="text-text-secondary hover:text-white transition-colors">
              Jobs
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl border border-white/10 hover:bg-surface-700 text-text-secondary hover:text-white transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-warning" />
              ) : (
                <Moon size={18} className="text-primary-400" />
              )}
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium border-2 border-primary-400/30">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-white max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-primary-500/20 text-primary-300 border border-primary-500/30">
                    {user.role}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface-800 rounded-xl border border-white/10 shadow-2xl py-1 animate-fade-in z-50">
                    <div className="px-4 py-2 border-b border-white/5">
                      <p className="text-sm font-medium text-white truncate">{user.name}</p>
                      <p className="text-xs text-text-muted truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-surface-700 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-accent-400 hover:text-white hover:bg-surface-700 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Shield size={16} /> Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-surface-700 transition-colors cursor-pointer text-left"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Theme Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl border border-white/10 hover:bg-surface-700 text-text-secondary hover:text-white"
            >
              {theme === 'dark' ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-primary-400" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-secondary hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-surface-800/95 backdrop-blur-xl border-b border-white/10 animate-slide-up shadow-2xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-white hover:bg-surface-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-white hover:bg-surface-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Jobs
            </Link>

            {isAuthenticated && user ? (
              <>
                <div className="border-t border-white/10 my-2 pt-2">
                  <div className="px-3 py-2">
                    <p className="text-base font-medium text-white flex items-center gap-2">
                      {user.name}
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-primary-500/20 text-primary-300">
                        {user.role}
                      </span>
                    </p>
                    <p className="text-sm font-medium text-text-muted">{user.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-white hover:bg-surface-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 rounded-md text-base font-medium text-accent-400 hover:bg-surface-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-error hover:bg-surface-700 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-4 px-3">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="secondary" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" fullWidth>
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

