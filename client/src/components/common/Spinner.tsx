import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div 
        className={`
          ${sizes[size]}
          rounded-full
          border-surface-600
          border-t-primary-500
          animate-spin
        `}
      />
    </div>
  );
};

export default Spinner;
