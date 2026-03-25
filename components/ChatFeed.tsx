
import React, { useRef, useEffect } from 'react';
import { Message, DyslexiaSettings } from '../types';
import { MessageBubble } from './MessageBubble';
import { RefreshIcon } from '../constants';

interface ChatFeedProps {
  messages: Message[];
  voiceURI: string | null;
  onRegenerate: () => void;
  isLoading: boolean;
  speakingMessageId: string | null;
  isSpeechPaused: boolean;
  dyslexiaSettings: DyslexiaSettings;
  onSpeak: (text: string, id: string) => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const ChatFeed: React.FC<ChatFeedProps> = ({ 
    messages, 
    voiceURI, 
    onRegenerate, 
    isLoading,
    speakingMessageId,
    isSpeechPaused,
    dyslexiaSettings,
    onSpeak,
    onPause,
    onResume,
    onStop
}) => {
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedRef.current) {
        // Use instant scrolling instead of smooth for a more responsive feel
        feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={feedRef} className="flex-1 w-full max-w-3xl mx-auto p-4 overflow-y-auto">
        {messages.map((msg, index) => (
            <MessageBubble 
                key={msg.id} 
                message={msg} 
                voiceURI={voiceURI} 
                onRegenerate={onRegenerate}
                isLoading={isLoading}
                isSpeaking={speakingMessageId === msg.id}
                isPaused={isSpeechPaused}
                dyslexiaSettings={dyslexiaSettings}
                onSpeak={() => onSpeak(msg.content, msg.id)}
                onPause={onPause}
                onResume={onResume}
                onStop={onStop}
            />
        ))}
        
        {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && !messages[messages.length - 1].isLoading && !isLoading && (
            <div className="flex justify-center my-4 animate-fade-in">
                <button 
                    onClick={onRegenerate}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-all shadow-sm text-sm font-medium"
                >
                    <RefreshIcon className="h-4 w-4" />
                    Regenerate Response
                </button>
            </div>
        )}
    </div>
  );
};
