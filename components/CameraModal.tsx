import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  // The callback provides the base64 encoded data and its mime type
  onCapture: (imageData: { data: string; mimeType: string }) => void;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Function to stop the media stream tracks
  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraReady(false);
    }
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      setError(null);
      setIsCameraReady(false);
      try {
        let stream: MediaStream;
        try {
          // Prefer the back camera
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        } catch (e) {
          // Fallback to any available camera
          console.log("Could not get environment camera, falling back to default");
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
        
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

      } catch (err: any) {
        console.error("Camera access error:", err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setError("Camera permission denied. Please click the lock icon in your browser's address bar and allow camera access for this site.");
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            setError("No camera found on this device. If you're on a computer, make sure your webcam is plugged in.");
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            setError("Your camera is being used by another application (like Zoom or Teams). Please close other apps and try again.");
        } else {
            setError("We couldn't start your camera. Try refreshing the page or checking your device settings.");
        }
      }
    };

    if (isOpen) {
      startCamera();
    } else {
      cleanupStream();
    }

    // Cleanup on unmount
    return () => {
      cleanupStream();
    };
  }, [isOpen, cleanupStream]);

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const width = video.videoWidth || video.clientWidth;
    const height = video.videoHeight || video.clientHeight;
    if (!width || !height) {
        setError("Camera isn't ready yet. Please wait a moment and try again.");
        return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (context) {
        if (streamRef.current?.getVideoTracks()[0]?.getSettings().facingMode !== 'environment') {
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
        }
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64Data = dataUrl.split(',')[1];
        if (base64Data) {
            onCapture({ data: base64Data, mimeType: 'image/jpeg' });
            onClose();
        } else {
            setError("Failed to capture image. Please try again.");
        }
    }
  };
  
  const handleCanPlay = () => {
    setIsCameraReady(true);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-fast"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-xl shadow-2xl w-full max-w-2xl m-4 flex flex-col max-h-[90vh] animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] flex-shrink-0">
          <h2 className="text-xl font-semibold">Take a Photo</h2>
          <button onClick={onClose} className="p-1 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors" aria-label="Close camera">
            <CloseIcon />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 bg-[var(--bg-secondary)] flex-grow flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="text-center text-[var(--text-secondary)] p-8">
              <p className="font-semibold text-lg">Camera Error</p>
              <p className="mt-2">{error}</p>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain rounded-lg"
                onCanPlay={handleCanPlay}
              />
               {!isCameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                  <p>Starting camera...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-center p-4 border-t border-[var(--border-color)] bg-[var(--bg-primary)] flex-shrink-0">
          <button
            onClick={handleCapture}
            disabled={!isCameraReady || !!error}
            className="px-8 py-3 bg-[var(--accent-color)] text-white font-semibold rounded-lg shadow-md hover:bg-[var(--accent-color-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <CameraIcon />
            <span>Capture</span>
          </button>
        </div>
      </div>
    </div>
  );
};