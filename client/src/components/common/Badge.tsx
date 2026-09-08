import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'accent' | 'danger' | 'secondary';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = ''
}) => {
  const variants = {
    default: 'bg-surface-600 text-text-secondary border-surface-500',
    primary: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    accent: 'bg-accent-500/10 text-accent-400 border-accent-500/20',
    danger: 'bg-error/10 text-error border-error/20',
    secondary: 'bg-surface-700 text-text-secondary border-white/10',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
