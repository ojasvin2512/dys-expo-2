import React, { useState, useEffect } from 'react';

export const ReadingRuler = () => {
  const [top, setTop] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTop(e.clientY);
      setIsVisible(true);
    };
    
    const handleMouseLeave = () => {
        setIsVisible(false);
    }

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed left-0 w-full h-10 pointer-events-none z-[100] transition-top duration-75 ease-out"
      style={{ 
          top: top - 20, // Center the 40px bar on the cursor
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.15)', // Dims the rest of the screen
          backgroundColor: 'rgba(255, 255, 0, 0.15)', // Slight yellow tint in the active area
          borderTop: '2px solid rgba(255, 200, 0, 0.5)',
          borderBottom: '2px solid rgba(255, 200, 0, 0.5)'
      }} 
    />
  );
};