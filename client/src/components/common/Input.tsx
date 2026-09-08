import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-surface-700/50 border rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted
            focus:outline-none focus:ring-2 transition-all
            ${Icon ? 'pl-10' : ''}
            ${error 
              ? 'border-error focus:border-error focus:ring-error/20' 
              : 'border-surface-500 focus:border-primary-500 focus:ring-primary-500/20'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-error mt-0.5">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
