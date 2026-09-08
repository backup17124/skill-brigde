import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-surface-800 rounded-2xl border border-white/10 shadow-2xl animate-slide-up overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-surface-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
