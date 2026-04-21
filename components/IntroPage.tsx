import React, { useState, useEffect } from 'react';

interface IntroPageProps {
  onEnter: () => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPrompt(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isExiting) {
        handleEnter();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isExiting]);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 1200);
  };

  return (
    <div className={`intro-page-pixel ${isExiting ? 'exiting' : ''}`}>
      {/* Animated Background */}
      <div className="pixel-bg">
        <div className="pixel-buildings"></div>
        <div className="pixel-clouds"></div>
        <div className="pixel-stars"></div>
      </div>

      {/* Floating Platforms */}
      <div className="floating-platform platform-1"></div>
      <div className="floating-platform platform-2"></div>
      <div className="floating-platform platform-3"></div>

      {/* Pixel Characters */}
      <div className="pixel-character char-1"></div>
      <div className="pixel-character char-2"></div>
      <div className="pixel-character char-3"></div>

      {/* Floating UI Elements */}
      <div className="floating-ui ui-1">
        <div className="ui-icon">📚</div>
      </div>
      <div className="floating-ui ui-2">
        <div className="ui-icon">✨</div>
      </div>
      <div className="floating-ui ui-3">
        <div className="ui-icon">🎮</div>
      </div>

      {/* Main Content */}
      <div className="intro-content-pixel">
        <div className="pixel-frame">
          <div className="frame-corner tl"></div>
          <div className="frame-corner tr"></div>
          <div className="frame-corner bl"></div>
          <div className="frame-corner br"></div>
          
          <div className="pixel-title-container">
            <h1 className="pixel-title">
              <span className="pixel-glow">DYSLEARN AI</span>
            </h1>
            <p className="pixel-subtitle">LEARNING ADVENTURE AWAITS!</p>
          </div>

          {showPrompt && (
            <div className="pixel-prompt">
              <button 
                className="pixel-button"
                onClick={handleEnter}
              >
                <span className="button-text">START ADVENTURE</span>
                <span className="button-arrow">▶</span>
              </button>
              <p className="press-enter-pixel">PRESS ENTER TO BEGIN</p>
            </div>
          )}
        </div>
      </div>

      {/* Pixel Particles */}
      <div className="pixel-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="pixel-particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}></div>
        ))}
      </div>

      {/* Transition Overlay */}
      <div className="transition-overlay"></div>
    </div>
  );
};
