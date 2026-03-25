
import React, { useRef, useState, useEffect } from 'react';
import { CloseIcon, TrashIcon, SendIcon } from '../constants';

interface DrawingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (imageData: { data: string; mimeType: string }, mode: 'alphabet' | 'object' | 'word' | 'number') => void;
}

export const DrawingModal: React.FC<DrawingModalProps> = ({ isOpen, onClose, onSend }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<'alphabet' | 'object' | 'word' | 'number'>('object');
  
  // Set up canvas context and sizing
  useEffect(() => {
    if (isOpen && canvasRef.current) {
        const canvas = canvasRef.current;
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
            
            // Default style
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = 5;
                ctx.strokeStyle = '#000000';
            }
        }
    }
  }, [isOpen, mode]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { x, y } = getCoordinates(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.beginPath();
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
        const touch = e.touches[0] || e.changedTouches[0];
        if (!touch) return { x: 0, y: 0 };
        clientX = touch.clientX;
        clientY = touch.clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }

    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSend = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary canvas to composite background and drawing
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tCtx = tempCanvas.getContext('2d');
    if (!tCtx) return;

    // Fill background white (otherwise it is transparent)
    tCtx.fillStyle = '#FFFFFF';
    tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Draw the canvas content onto the white background
    tCtx.drawImage(canvas, 0, 0);

    const dataUrl = tempCanvas.toDataURL('image/jpeg');
    const base64Data = dataUrl.split(',')[1];
    onSend({ data: base64Data, mimeType: 'image/jpeg' }, mode);
    onClose();
    clearCanvas();
  };

  if (!isOpen) return null;

  // Dynamic background style for Alphabet/Word/Number mode
  const isLined = mode === 'alphabet' || mode === 'word' || mode === 'number';
  const backgroundStyle = isLined
    ? { 
        backgroundImage: `linear-gradient(to bottom, transparent 49%, #e5e7eb 50%, transparent 51%, transparent 99%, #e5e7eb 100%)`, 
        backgroundSize: '100% 80px',
        borderTop: '1px solid #e5e7eb' 
      }
    : { backgroundColor: '#ffffff' };

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-fast"
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-xl shadow-2xl w-full max-w-3xl m-4 flex flex-col h-[80vh] animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] flex-shrink-0">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <span>Creative Canvas</span>
            </h2>
            <button onClick={onClose} className="p-1 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
                <CloseIcon />
            </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center p-2 bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
            <div className="bg-[var(--bg-primary)] rounded-lg p-1 flex flex-wrap justify-center gap-1 border border-[var(--border-color)]">
                <button 
                    onClick={() => { setMode('object'); setTimeout(clearCanvas, 10); }}
                    className={`px-2 sm:px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${mode === 'object' ? 'bg-[var(--accent-color)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}
                >
                    Objects
                </button>
                <button 
                    onClick={() => { setMode('alphabet'); setTimeout(clearCanvas, 10); }}
                    className={`px-2 sm:px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${mode === 'alphabet' ? 'bg-[var(--accent-color)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}
                >
                    Alphabets
                </button>
                <button 
                    onClick={() => { setMode('number'); setTimeout(clearCanvas, 10); }}
                    className={`px-2 sm:px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${mode === 'number' ? 'bg-[var(--accent-color)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}
                >
                    Numbers
                </button>
                <button 
                    onClick={() => { setMode('word'); setTimeout(clearCanvas, 10); }}
                    className={`px-2 sm:px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${mode === 'word' ? 'bg-[var(--accent-color)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}
                >
                    Words
                </button>
            </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-grow relative bg-white w-full overflow-hidden cursor-crosshair touch-none" style={backgroundStyle}>
             {isLined && (
                 <div className="absolute inset-0 pointer-events-none opacity-30" style={{
                     backgroundImage: 'linear-gradient(to bottom, transparent 50%, #ef4444 50%, transparent 52%)',
                     backgroundSize: '100% 80px',
                     marginTop: '40px' // Offset for the middle line
                 }}></div>
             )}
             <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="absolute inset-0"
             />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t border-[var(--border-color)] bg-[var(--bg-primary)] flex-shrink-0">
            <button 
                onClick={clearCanvas}
                className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
            >
                <TrashIcon />
                Clear
            </button>
            <p className="text-xs text-[var(--text-secondary)] hidden sm:block">
                {isLined ? 'Practice writing on the lines!' : 'Draw anything you like!'}
            </p>
            <button 
                onClick={handleSend}
                className="flex items-center gap-2 px-6 py-2 bg-[var(--accent-color)] text-white font-semibold rounded-lg hover:bg-[var(--accent-color-hover)] transition-colors"
            >
                <SendIcon />
                Send to AI
            </button>
        </div>
      </div>
    </div>
  );
};
