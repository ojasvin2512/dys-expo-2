
import React from 'react';
import { SettingsIcon, MenuIcon, TrophyIcon, StarIcon } from '../constants';
import type { UserData } from '../types';
import { DAILY_GOAL, DAILY_GOAL_LEVELS } from '../constants';
import { Logo } from './Logo';
import { Tooltip } from './Tooltip';

interface HeaderProps {
    onSettingsClick: () => void;
    onMenuClick: () => void;
    userData: UserData;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick, onMenuClick, userData }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysProgress = userData.progressHistory.find(d => d.date === todayStr);
  const userPoints = todaysProgress ? todaysProgress.points : 0;
  
  const levels = DAILY_GOAL_LEVELS;

  return (
    <header className="w-full py-3 px-4 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-primary)] sticky top-0 z-10 flex-shrink-0">
       <button onClick={onMenuClick} className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors md:hidden" aria-label="Open menu">
            <MenuIcon />
        </button>
      
      <div className="flex items-center">
        <Logo className="h-10" />
      </div>

      <div className="flex-1 flex justify-end items-center gap-4">
        <div className="flex items-center gap-4 text-[var(--text-primary)]">
            <Tooltip content="Your total points earned!" position="bottom">
                <div className="flex items-center gap-1.5 font-semibold cursor-help" aria-label={`Total points: ${userData.totalPoints}`}>
                    <TrophyIcon className="h-5 w-5 text-yellow-500" />
                    <span>{userData.totalPoints}</span>
                </div>
            </Tooltip>
            
            {/* Compact Daily Progress */}
            <Tooltip content="Daily Progress: Earn points to unlock stars!" position="bottom" className="hidden sm:inline-block">
                <div className="flex items-center gap-3 px-3 py-1.5 bg-[var(--bg-secondary)] rounded-full border border-[var(--border-color)] cursor-help transition-all hover:shadow-sm" aria-label={`Daily progress: ${userPoints} out of ${DAILY_GOAL} points`}>
                    <div className="flex -space-x-1">
                        {levels.map((level) => (
                            <StarIcon
                                key={level}
                                className={`h-4 w-4 transition-colors duration-300 ${userPoints >= level ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                            />
                        ))}
                    </div>
                    <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-green-500 transition-all duration-500 ease-out"
                            style={{ width: `${Math.min(100, (userPoints / DAILY_GOAL) * 100)}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-bold text-[var(--accent-color)] tabular-nums">{userPoints}</span>
                </div>
            </Tooltip>
        </div>

        <button onClick={onSettingsClick} className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors" aria-label="Open settings">
            <SettingsIcon />
        </button>
      </div>
    </header>
  );
};
