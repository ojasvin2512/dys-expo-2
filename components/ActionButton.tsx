
import React from 'react';
import type { ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  icon: ReactNode;
  text: string;
  fullWidth?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, disabled, isLoading, icon, text, fullWidth = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        flex items-center justify-center gap-2 px-6 py-3 font-semibold text-base
        rounded-lg shadow-sm transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-4
        ${fullWidth ? 'w-full' : ''}
        ${
          disabled || isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#268BD2] text-white hover:bg-[#2074AF] focus:ring-[#268BD2]/40'
        }
      `}
    >
      {isLoading ? <LoadingSpinner /> : icon}
      <span className="truncate">{text}</span>
    </button>
  );
};
