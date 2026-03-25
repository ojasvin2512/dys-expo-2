import React, { useState } from 'react';
import { LightBulbIcon, SparklesIcon, SettingsIcon, IMAGE_PROVIDERS, GEMINI_IMAGE_MODELS } from '../constants';
import { ImageProvider } from '../types';

interface ConceptExplainerProps {
  onExplain: (concept: string) => void;
  isLoading: boolean;
  selectedImageProvider: ImageProvider;
  onImageProviderChange: (provider: ImageProvider) => void;
  selectedImageModel: string;
  onImageModelChange: (modelId: string) => void;
}

export const ConceptExplainer: React.FC<ConceptExplainerProps> = ({ 
  onExplain, 
  isLoading,
  selectedImageProvider,
  onImageProviderChange,
  selectedImageModel,
  onImageModelChange
}) => {
  const [concept, setConcept] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (concept.trim() && !isLoading) {
      onExplain(concept.trim());
      setConcept('');
    }
  };

  const suggestions = [
    "Photosynthesis",
    "Gravity",
    "Metaphor",
    "Prime Numbers",
    "The Water Cycle",
    "Democracy"
  ];

  return (
    <div className="p-4 space-y-6 animate-fade-in-fast">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400 mb-2">
          <LightBulbIcon className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Concept Explainer</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Struggling with a complex term? I'll break it down into simple, dyslexia-friendly language with visual analogies.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="concept-input" className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 px-1 flex justify-between items-center">
            What should I explain?
            <button 
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1 rounded-md transition-colors ${showSettings ? 'bg-[var(--accent-color)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}
              title="Image Model Settings"
            >
              <SettingsIcon className="h-4 w-4" />
            </button>
          </label>
          <div className="relative">
            <input
              id="concept-input"
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g. Quantum Physics, Ecosystem..."
              className="w-full p-4 pr-12 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] outline-none transition-all shadow-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!concept.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-color-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <SparklesIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider px-1">Image Generation Settings</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1.5 px-1">
                  Provider
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {IMAGE_PROVIDERS.map((provider) => (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={() => onImageProviderChange(provider.id as ImageProvider)}
                      className={`w-full p-3 text-left rounded-lg border transition-all ${
                        selectedImageProvider === provider.id
                          ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5 text-[var(--accent-color)] font-medium ring-1 ring-[var(--accent-color)]'
                          : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]'
                      }`}
                    >
                      <div className="text-sm">{provider.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedImageProvider === 'gemini' && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1.5 px-1">
                    Gemini Model
                  </label>
                  <select
                    value={selectedImageModel}
                    onChange={(e) => onImageModelChange(e.target.value)}
                    className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-color)] outline-none"
                  >
                    {GEMINI_IMAGE_MODELS.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] leading-tight px-1 italic">
              * These settings will also affect other images generated until changed.
            </p>
          </div>
        )}
      </form>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider px-1">
          Try these suggestions:
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setConcept(s)}
              className="px-3 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full text-sm text-[var(--text-secondary)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
        <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-2">
          <SparklesIcon className="h-4 w-4" />
          How it works
        </h3>
        <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
          I use simple words, bullet points, and relate complex ideas to things you already know. I'll also generate a visual aid to help you "see" the concept!
        </p>
      </div>
    </div>
  );
};
