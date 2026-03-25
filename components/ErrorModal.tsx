
import React from 'react';
import { CloseIcon } from '../constants';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  suggestion?: string;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, title, message, suggestion }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-fast"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-xl shadow-2xl w-full max-w-md m-4 flex flex-col animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <h2 className="text-lg font-bold text-red-500 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {title}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--bg-secondary)] transition-colors">
            <CloseIcon />
          </button>
        </div>
        <div className="p-6">
          <p className="text-[var(--text-primary)]">{message}</p>
          {suggestion && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">Try this:</p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">{suggestion}</p>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-[var(--border-color)] flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-[var(--accent-color)] text-white font-semibold rounded-lg hover:bg-[var(--accent-color-hover)] transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
