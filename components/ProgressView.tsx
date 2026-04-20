import React, { useState } from 'react';
import type { UserData, SkillStats, Challenge } from '../types';
import { 
    TrophyIcon, 
    StarIcon, 
    CHALLENGES, 
    DAILY_GAME_TARGET, 
    DAILY_MINUTES_TARGET, 
    ACHIEVEMENTS, 
    PlayIcon, 
    SKILL_DESCRIPTIONS,
    FireIcon,
    ChartBarIcon,
    SparklesIcon,
    MessageIcon
} from '../constants';
import { DAILY_GOAL_LEVELS } from '../constants';
import { ChallengeDemoModal } from './ChallengeDemoModal';
import { Tooltip } from './Tooltip';

interface ProgressViewProps {
    userData: UserData;
    onStartChallenge?: (challenge: Challenge) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; colorClass: string }> = ({ title, value, icon, colorClass }) => (
    <div className="bg-[var(--bg-primary)] p-4 rounded-2xl shadow-sm border border-[var(--border-color)] flex flex-col gap-3 transition-all hover:shadow-md hover:-translate-y-0.5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-black text-[var(--text-primary)]">{value}</p>
        </div>
    </div>
);

const ProgressBar: React.FC<{ label: string; value: number; max: number; unit?: string; description?: string; color?: string }> = ({ label, value, max, unit = '', description, color = 'bg-[var(--accent-color)]' }) => {
    const percent = Math.min(100, (value / max) * 100);
    const labelElement = (
        <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-tight cursor-help decoration-dotted underline decoration-gray-400">{label}</span>
    );

    return (
        <div className="mb-4 group">
            <div className="flex justify-between items-end mb-1.5 px-1">
                {description ? (
                    <Tooltip content={description} position="top">
                         {labelElement}
                    </Tooltip>
                ) : (
                    <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-tight">{label}</span>
                )}
                <span className="text-xs font-black text-[var(--text-primary)] tabular-nums">{value}<span className="text-[var(--text-secondary)] font-medium">/{max}{unit}</span></span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 p-0.5 border border-[var(--border-color)]">
                <div 
                    className={`h-full rounded-full transition-all duration-700 ease-out ${percent >= 100 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : `${color} shadow-sm`}`} 
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    )
}

const MiniLevelMeter: React.FC<{ points: number }> = ({ points }) => {
    const levels = DAILY_GOAL_LEVELS;
    return (
        <div className="flex items-center gap-0.5 flex-shrink-0 max-w-[80px] overflow-hidden">
            {levels.map((level, index) => {
                const prevLevel = index > 0 ? levels[index - 1] : 0;
                const isLevelComplete = points >= level;
                const segmentTotal = level - prevLevel;
                const userPointsInSegment = Math.max(0, points - prevLevel);
                const progressPercent = Math.min(100, (userPointsInSegment / segmentTotal) * 100);

                return (
                    <React.Fragment key={level}>
                        <div className="w-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                            <div
                                className="h-full bg-green-500 transition-all duration-1000"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <StarIcon
                            className={`h-3 w-3 flex-shrink-0 transition-colors duration-500 ${isLevelComplete ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300 dark:text-gray-600'}`}
                        />
                    </React.Fragment>
                );
            })}
        </div>
    );
};

const formatDate = (dateStr: string) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const date = new Date(`${dateStr}T12:00:00Z`); 

    const isToday = today.getUTCFullYear() === date.getUTCFullYear() &&
                    today.getUTCMonth() === date.getUTCMonth() &&
                    today.getUTCDate() === date.getUTCDate();
    
    const isYesterday = yesterday.getUTCFullYear() === date.getUTCFullYear() &&
                        yesterday.getUTCMonth() === date.getUTCMonth() &&
                        yesterday.getUTCDate() === date.getUTCDate();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    });
}

export const ProgressView: React.FC<ProgressViewProps> = ({ userData, onStartChallenge }) => {
    const [activeDemo, setActiveDemo] = useState<Challenge | null>(null);
    const { totalPoints, progressHistory, skillStats, unlockedAchievements } = userData;
    
    const todayStr = new Date().toISOString().split('T')[0];
    const todayProgress = progressHistory.find(p => p.date === todayStr) || { points: 0, gamesPlayed: 0, minutesPlayed: 0 };
    
    // Calculate Streak
    let streak = 0;
    const sortedHistory = [...progressHistory].sort((a, b) => b.date.localeCompare(a.date));
    let checkDate = new Date();
    
    for (const entry of sortedHistory) {
        const entryDate = new Date(entry.date + 'T12:00:00Z');
        const diffDays = Math.floor((checkDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 1) {
            streak++;
            checkDate = entryDate;
        } else {
            break;
        }
    }

    // Use a fixed max of 500 so skill bars scale properly and don't max out at current highest
    const maxSkillPoints = 500;

    // Logic for Adaptive Learning Recommendation
    // Sort skills by points (ascending) — weakest first
    // Skip skills that are already maxed (>= 400) to keep recommendations fresh
    const skills = Object.entries(skillStats) as [keyof SkillStats, number][];
    skills.sort((a, b) => a[1] - b[1]);
    const weakestSkill = skills[0][0];
    const weakestScore = skills[0][1];
    // Find the skill that needs the most improvement relative to the best skill
    const bestScore = skills[skills.length - 1][1];
    const gap = bestScore - weakestScore;
    const recommendedChallenge = CHALLENGES.find(c => c.skill === weakestSkill)
      || CHALLENGES.find(c => c.skill === skills[1]?.[0]); // fallback to 2nd weakest

    const skillColors: Record<keyof SkillStats, string> = {
        vocabulary: 'bg-emerald-500',
        grammar: 'bg-blue-500',
        spelling: 'bg-orange-500',
        phonetics: 'bg-pink-500',
        creativity: 'bg-purple-500',
        logic: 'bg-indigo-500',
        math: 'bg-amber-500'
    };

    return (
        <div className="p-4 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="px-2">
                <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Your Progress</h2>
                <p className="text-sm text-[var(--text-secondary)] font-medium">Keep going, you're doing great!</p>
            </div>

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-2 gap-3">
                <StatCard 
                    title="Total Points" 
                    value={totalPoints} 
                    icon={<TrophyIcon className="h-6 w-6" />} 
                    colorClass="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                />
                <StatCard 
                    title="Day Streak" 
                    value={streak} 
                    icon={<FireIcon className="h-6 w-6" />} 
                    colorClass="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                />
                <div className="col-span-2 bg-[var(--bg-primary)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Today's Goals</h3>
                        <div className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-black rounded-full uppercase">
                            {todayProgress.points} pts earned
                        </div>
                    </div>
                    <div className="space-y-1">
                        <ProgressBar label="Games Played" value={todayProgress.gamesPlayed} max={DAILY_GAME_TARGET} color="bg-blue-500" />
                        <ProgressBar label="Time Learning" value={todayProgress.minutesPlayed} max={DAILY_MINUTES_TARGET} unit="m" color="bg-purple-500" />
                    </div>
                </div>
            </div>

            {/* Adaptive Recommendation - More prominent */}
            {recommendedChallenge && (
                <div 
                    className="relative overflow-hidden bg-slate-900 rounded-2xl p-5 text-white shadow-xl cursor-pointer group transition-all hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => onStartChallenge && onStartChallenge(recommendedChallenge)}
                >
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/30 blur-3xl rounded-full group-hover:bg-indigo-500/50 transition-colors"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                             <div className="p-1.5 bg-indigo-500 rounded-lg">
                                <SparklesIcon className="h-4 w-4 text-white" />
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Personalized Mission</span>
                        </div>
                        
                        <h3 className="text-lg font-bold mb-1 leading-tight capitalize">
                          Boost your {weakestSkill}!
                        </h3>
                        <p className="text-xs text-slate-400 mb-1 font-medium">
                          Your {weakestSkill} score is <span className="text-white font-bold">{weakestScore} pts</span>
                          {gap > 0 && <span> — {gap} pts behind your best skill</span>}
                        </p>
                        <p className="text-xs text-slate-500 mb-4">Practice this challenge to improve! 💪</p>
                        
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-md">
                             <div className="p-2 bg-white/10 rounded-lg flex-shrink-0">
                                <recommendedChallenge.icon className="h-7 w-7 text-white" />
                             </div>
                             <div className="flex-1 min-w-0">
                                 <p className="font-bold text-sm">{recommendedChallenge.title}</p>
                                 <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{recommendedChallenge.description}</p>
                             </div>
                             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/40 flex-shrink-0">
                                <PlayIcon className="h-4 w-4 text-white" />
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Learning Analysis - Bento Style */}
            <div className="bg-[var(--bg-primary)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                    <ChartBarIcon className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">Skill Breakdown</h3>
                </div>
                <div className="grid grid-cols-1 gap-1">
                     {Object.entries(skillStats).map(([skill, value]) => (
                         <ProgressBar 
                            key={skill} 
                            label={skill} 
                            value={value} 
                            max={maxSkillPoints} 
                            description={SKILL_DESCRIPTIONS[skill as keyof SkillStats]}
                            color={skillColors[skill as keyof SkillStats]}
                         />
                     ))}
                </div>
            </div>

            {/* Achievements Section - Grid of Badges */}
            <div className="bg-[var(--bg-primary)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                    <TrophyIcon className="h-5 w-5 text-yellow-500" />
                    <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">Achievements</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {ACHIEVEMENTS.map(achievement => {
                        const isUnlocked = unlockedAchievements.includes(achievement.id);
                        return (
                            <div 
                                key={achievement.id} 
                                className={`group relative flex flex-col items-center justify-center p-3 rounded-2xl text-center transition-all ${isUnlocked ? 'bg-white dark:bg-gray-800 border-2 border-yellow-400 shadow-md scale-105' : 'bg-gray-50 dark:bg-gray-900 border border-[var(--border-color)] opacity-40 grayscale'}`}
                            >
                                <div className={`${isUnlocked ? achievement.color : 'text-gray-400'} mb-2`}>
                                    <achievement.icon className="h-8 w-8" />
                                </div>
                                <p className="text-[9px] font-black uppercase leading-tight tracking-tighter">{achievement.title}</p>
                                
                                {isUnlocked && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Daily History - Clean List */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest">Activity Log</h3>
                    <span className="text-[10px] font-bold text-[var(--text-secondary)]">{progressHistory.length} entries</span>
                </div>
                <div className="space-y-2">
                    {progressHistory.length > 0 ? (
                        sortedHistory.map((day) => (
                            <div key={day.date} className="bg-[var(--bg-primary)] p-3 rounded-2xl border border-[var(--border-color)] flex justify-between items-center gap-2 transition-all hover:border-[var(--accent-color)] overflow-hidden">
                                <div className="min-w-0 flex-1">
                                    <p className="font-black text-[var(--text-primary)] text-sm tracking-tight truncate">{formatDate(day.date)}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] font-bold text-green-500 uppercase">{day.points} pts</span>
                                        <span className="text-[10px] text-[var(--text-secondary)]">•</span>
                                        <span className="text-[10px] font-bold text-blue-500 uppercase">{day.gamesPlayed} games</span>
                                    </div>
                                </div>
                                <MiniLevelMeter points={day.points} />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 px-6 text-[var(--text-secondary)] bg-[var(--bg-primary)] rounded-2xl border-2 border-dashed border-[var(--border-color)]">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                <MessageIcon className="h-6 w-6 opacity-20" />
                            </div>
                            <p className="font-bold text-sm">No activity yet</p>
                            <p className="text-xs mt-1 opacity-60">Complete a challenge to see your progress here!</p>
                        </div>
                    )}
                </div>
            </div>

            {activeDemo && (
                <ChallengeDemoModal 
                    isOpen={!!activeDemo} 
                    onClose={() => setActiveDemo(null)} 
                    challenge={activeDemo} 
                    onStart={() => onStartChallenge && onStartChallenge(activeDemo)}
                />
            )}
        </div>
    );
};
