import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  glass = false,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-xl border border-white/5
        ${glass ? 'glass' : 'bg-surface-700/50'}
        ${hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:border-white/10 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
