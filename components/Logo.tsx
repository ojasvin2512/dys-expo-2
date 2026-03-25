
import React from 'react';

export const Logo = ({ className = "h-10" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <svg viewBox="0 0 120 120" className="h-full w-auto overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Headphones Band */}
        <path d="M30 50V40C30 23.4315 43.4315 10 60 10C76.5685 10 90 23.4315 90 40V50" stroke="currentColor" className="text-[#003366] dark:text-blue-400" strokeWidth="8" strokeLinecap="round"/>
        {/* Earcup Left */}
        <rect x="22" y="45" width="16" height="25" rx="6" fill="currentColor" className="text-[#003366] dark:text-blue-400"/>
        {/* Earcup Right */}
        <rect x="82" y="45" width="16" height="25" rx="6" fill="currentColor" className="text-[#003366] dark:text-blue-400"/>

        {/* Face Circle */}
        <circle cx="60" cy="55" r="25" fill="var(--bg-primary)" stroke="currentColor" className="text-[#003366] dark:text-blue-400" strokeWidth="3"/>
        
        {/* Eyes */}
        <circle cx="50" cy="52" r="3" fill="currentColor" className="text-[#003366] dark:text-blue-400"/>
        <circle cx="70" cy="52" r="3" fill="currentColor" className="text-[#003366] dark:text-blue-400"/>
        
        {/* Smile */}
        <path d="M50 65Q60 72 70 65" stroke="currentColor" className="text-[#003366] dark:text-blue-400" strokeWidth="3" strokeLinecap="round"/>

        {/* Brain (Orange) */}
        <path d="M82 22C88 18 98 18 102 26C106 34 102 40 96 44" stroke="#F97316" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M85 26C88 26 91 28 91 33" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>
        <path d="M94 22C94 22 98 24 98 30" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>

        {/* Book */}
        <path d="M35 85C35 85 45 90 60 90C75 90 85 85 85 85V105C85 105 75 110 60 110C45 110 35 105 35 105V85Z" fill="currentColor" className="text-[#003366] dark:text-blue-400"/>
        <path d="M60 90V110" stroke="var(--bg-primary)" strokeWidth="2"/>

        {/* Controller */}
        <g transform="translate(80, 85) rotate(-15)">
            <rect x="0" y="0" width="34" height="22" rx="6" fill="#F97316" stroke="var(--bg-primary)" strokeWidth="2"/>
            <path d="M8 7V15M4 11H12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="22" cy="8" r="2" fill="white"/>
            <circle cx="26" cy="11" r="2" fill="white"/>
            <circle cx="22" cy="14" r="2" fill="white"/>
            <circle cx="18" cy="11" r="2" fill="white"/>
        </g>
      </svg>
      <div className="flex flex-col justify-center hidden md:flex">
          <div className="flex items-baseline">
             <span className="font-bold text-[#003366] dark:text-blue-400 text-2xl tracking-tight leading-none">DysLearn</span>
             <span className="font-bold text-[#F97316] text-2xl ml-1 leading-none">AI</span>
          </div>
      </div>
    </div>
  );
};
