
import { MedalIcon, StarIcon, TrophyIcon, PuzzleIcon, FireIcon, ChartBarIcon, CalculatorIcon, BookOpenIcon, PaletteIcon, MusicIcon, FeatherIcon, LightBulbIcon, PencilIcon, SparklesIcon } from '../components/icons';
import type { Achievement, UserData } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first-steps',
        title: 'First Steps',
        description: 'Earn your first 50 points',
        icon: MedalIcon,
        color: 'text-yellow-400',
        check: (data: UserData) => data.totalPoints >= 50
    },
    {
        id: 'rising-star',
        title: 'Rising Star',
        description: 'Earn 250 total points',
        icon: StarIcon,
        color: 'text-yellow-300',
        check: (data: UserData) => data.totalPoints >= 250
    },
    {
        id: 'learning-legend',
        title: 'Learning Legend',
        description: 'Earn 1000 total points',
        icon: TrophyIcon,
        color: 'text-yellow-500',
        check: (data: UserData) => data.totalPoints >= 1000
    },
    {
        id: 'high-five',
        title: 'High Five',
        description: 'Complete 5 daily games',
        icon: PuzzleIcon,
        color: 'text-blue-500',
        check: (data: UserData) => {
            const today = new Date().toISOString().split('T')[0];
            const progress = data.progressHistory.find(d => d.date === today);
            return progress ? progress.gamesPlayed >= 5 : false;
        }
    },
    {
        id: 'game-enthusiast',
        title: 'Game Enthusiast',
        description: 'Play a total of 50 games',
        icon: PuzzleIcon,
        color: 'text-blue-600',
        check: (data: UserData) => data.progressHistory.reduce((sum, d) => sum + d.gamesPlayed, 0) >= 50
    },
    {
        id: 'streak-master',
        title: 'Streak Master',
        description: 'Maintain a 3-day learning streak',
        icon: FireIcon,
        color: 'text-orange-500',
        check: (data: UserData) => {
            if (data.progressHistory.length < 3) return false;
            const sorted = [...data.progressHistory].sort((a, b) => b.date.localeCompare(a.date));
            let streak = 0;
            let checkDate = new Date();
            for (const entry of sorted) {
                const entryDate = new Date(entry.date + 'T12:00:00Z');
                const diffDays = Math.floor((checkDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays <= 1) {
                    streak++;
                    checkDate = entryDate;
                } else break;
            }
            return streak >= 3;
        }
    },
    {
        id: 'week-warrior',
        title: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        icon: FireIcon,
        color: 'text-red-500',
        check: (data: UserData) => {
            if (data.progressHistory.length < 7) return false;
            const sorted = [...data.progressHistory].sort((a, b) => b.date.localeCompare(a.date));
            let streak = 0;
            let checkDate = new Date();
            for (const entry of sorted) {
                const entryDate = new Date(entry.date + 'T12:00:00Z');
                const diffDays = Math.floor((checkDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays <= 1) {
                    streak++;
                    checkDate = entryDate;
                } else break;
            }
            return streak >= 7;
        }
    },
    {
        id: 'marathon-learner',
        title: 'Marathon Learner',
        description: 'Learn for a total of 100 minutes',
        icon: ChartBarIcon,
        color: 'text-purple-500',
        check: (data: UserData) => data.progressHistory.reduce((sum, d) => sum + d.minutesPlayed, 0) >= 100
    },
    {
        id: 'math-whiz',
        title: 'Math Whiz',
        description: 'Earn 100 points in Math',
        icon: CalculatorIcon,
        color: 'text-indigo-500',
        check: (data: UserData) => data.skillStats.math >= 100
    },
    {
        id: 'word-wizard',
        title: 'Word Wizard',
        description: 'Earn 100 points in Vocabulary',
        icon: BookOpenIcon,
        color: 'text-emerald-500',
        check: (data: UserData) => data.skillStats.vocabulary >= 100
    },
    {
        id: 'artistic-soul',
        title: 'Artistic Soul',
        description: 'Earn 100 points in Creativity',
        icon: PaletteIcon,
        color: 'text-pink-500',
        check: (data: UserData) => data.skillStats.creativity >= 100
    },
    {
        id: 'phonetics-pro',
        title: 'Phonetics Pro',
        description: 'Earn 100 points in Phonetics',
        icon: MusicIcon,
        color: 'text-cyan-500',
        check: (data: UserData) => data.skillStats.phonetics >= 100
    },
    {
        id: 'grammar-guru',
        title: 'Grammar Guru',
        description: 'Earn 100 points in Grammar',
        icon: FeatherIcon,
        color: 'text-amber-600',
        check: (data: UserData) => data.skillStats.grammar >= 100
    },
    {
        id: 'logic-master',
        title: 'Logic Master',
        description: 'Earn 100 points in Logic',
        icon: LightBulbIcon,
        color: 'text-yellow-600',
        check: (data: UserData) => data.skillStats.logic >= 100
    },
    {
        id: 'spelling-bee',
        title: 'Spelling Bee',
        description: 'Earn 100 points in Spelling',
        icon: PencilIcon,
        color: 'text-rose-500',
        check: (data: UserData) => data.skillStats.spelling >= 100
    },
    {
        id: 'century-club',
        title: 'Century Club',
        description: 'Earn 5000 total points',
        icon: TrophyIcon,
        color: 'text-yellow-600',
        check: (data: UserData) => data.totalPoints >= 5000
    },
    {
        id: 'fortnight-finisher',
        title: 'Fortnight Finisher',
        description: 'Maintain a 14-day learning streak',
        icon: FireIcon,
        color: 'text-red-600',
        check: (data: UserData) => {
            if (data.progressHistory.length < 14) return false;
            const sorted = [...data.progressHistory].sort((a, b) => b.date.localeCompare(a.date));
            let streak = 0;
            let checkDate = new Date();
            for (const entry of sorted) {
                const entryDate = new Date(entry.date + 'T12:00:00Z');
                const diffDays = Math.floor((checkDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays <= 1) {
                    streak++;
                    checkDate = entryDate;
                } else break;
            }
            return streak >= 14;
        }
    },
    {
        id: 'dedicated-student',
        title: 'Dedicated Student',
        description: 'Learn for a total of 500 minutes',
        icon: ChartBarIcon,
        color: 'text-purple-600',
        check: (data: UserData) => data.progressHistory.reduce((sum, d) => sum + d.minutesPlayed, 0) >= 500
    },
    {
        id: 'skill-specialist',
        title: 'Skill Specialist',
        description: 'Reach 500 points in any single skill',
        icon: SparklesIcon,
        color: 'text-indigo-600',
        check: (data: UserData) => Object.values(data.skillStats).some(val => val >= 500)
    }
];
