
import React, { useState, useRef, useEffect } from 'react';
import { Challenge } from '../types';
import { CloseIcon, PlayIcon, PauseIcon, StopIcon, UserIcon, AssistantIcon } from '../constants';

interface ChallengeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: Challenge;
  onStart: () => void;
}

export const ChallengeDemoModal: React.FC<ChallengeDemoModalProps> = ({ isOpen, onClose, challenge, onStart }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!isOpen) {
      handleStop();
    }
    return () => {
        handleStop();
    };
  }, [isOpen]);

  const handlePlay = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      if (!challenge.demoScript) return;
      
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(challenge.demoScript);
      
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(true); // Still technically playing, just paused
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    utteranceRef.current = null;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-fast"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-xl shadow-2xl w-full max-w-xl m-4 flex flex-col max-h-[90vh] animate-slide-in-up border border-[var(--border-color)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] flex-shrink-0 bg-[var(--bg-secondary)] rounded-t-xl">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                    <challenge.icon className="h-6 w-6 text-[var(--accent-color)]" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">{challenge.title}</h2>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 uppercase tracking-wide">Demo Preview</span>
                </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                <CloseIcon />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
            {/* Voiceover Control */}
            <div className="bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 p-4 rounded-lg flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">Hear about this challenge</p>
                    <p className="text-xs text-[var(--text-secondary)]">Listen to the assistant explain how to play.</p>
                </div>
                <div className="flex items-center gap-2 bg-[var(--bg-primary)] p-1.5 rounded-full shadow-sm border border-[var(--border-color)]">
                    {!isPlaying || isPaused ? (
                        <button onClick={handlePlay} className="p-2 rounded-full bg-[var(--accent-color)] text-white hover:opacity-90 transition-opacity" title="Play Demo Audio">
                            <PlayIcon className="h-5 w-5" />
                        </button>
                    ) : (
                        <button onClick={handlePause} className="p-2 rounded-full bg-[var(--accent-color)] text-white hover:opacity-90 transition-opacity" title="Pause Demo Audio">
                            <PauseIcon className="h-5 w-5" />
                        </button>
                    )}
                    <button onClick={handleStop} className="p-2 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Stop Audio">
                        <StopIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Description */}
            <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">What is it?</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{challenge.description}</p>
            </div>

            {/* Chat Preview */}
            {challenge.demoChat && (
                <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">Example Conversation</h3>
                    <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] space-y-3 max-h-60 overflow-y-auto">
                        {challenge.demoChat.map((msg, idx) => (
                            <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className="flex-shrink-0 mt-0.5">
                                    {msg.role === 'user' ? <UserIcon /> : <AssistantIcon />}
                                </div>
                                <div className={`px-3 py-2 rounded-lg text-xs sm:text-sm max-w-[85%] ${
                                    msg.role === 'user' 
                                    ? 'bg-[var(--user-bubble-bg)] text-[var(--user-bubble-text)]' 
                                    : 'bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-sm'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-primary)] rounded-b-xl flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
            >
                Close
            </button>
            <button 
                onClick={() => { handleStop(); onStart(); onClose(); }}
                className="px-6 py-2 text-sm font-bold text-white bg-[var(--accent-color)] hover:bg-[var(--accent-color-hover)] rounded-lg shadow-md transition-colors"
            >
                Start Challenge
            </button>
        </div>
      </div>
    </div>
  );
};
