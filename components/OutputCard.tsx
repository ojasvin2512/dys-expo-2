
import React from 'react';
import type { ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface OutputCardProps {
  title: string;
  isLoading: boolean;
  children: ReactNode;
}

export const OutputCard: React.FC<OutputCardProps> = ({ title, isLoading, children }) => {
  return (
    <div className="bg-white/60 p-6 rounded-2xl shadow-sm border border-gray-200 animate-fade-in">
      <h2 className="text-xl font-semibold text-[#073642] mb-4 flex items-center gap-3">
        {title}
        {isLoading && <LoadingSpinner />}
      </h2>
      <div className="prose prose-lg max-w-none text-[#586E75]">
        {children}
      </div>
    </div>
  );
};

// Add keyframes for a simple fade-in animation to tailwind.config.js if you had one.
// Since we are using CDN, let's just add it to a style tag in index.html, or accept no animation.
// A simple CSS class will suffice here for demonstration.
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);
