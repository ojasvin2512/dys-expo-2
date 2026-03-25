
import React, { useState, useRef, useEffect } from 'react';

import { SendIcon, FileIcon, CameraIcon, CloseIcon, MicrophoneIcon, BrushIcon, SparklesIcon } from '../constants';
import { LoadingSpinner } from './LoadingSpinner';
import type { FileAttachment, Language } from '../types';
import { CameraModal } from './CameraModal';
import { DrawingModal } from './DrawingModal';
import { ErrorModal } from './ErrorModal';

// --- START: Manual Type Declarations for Web Speech API ---
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }
}
// --- END: Manual Type Declarations for Web Speech API ---




interface ChatInputProps {
  onSendMessage: (message: string, attachment: FileAttachment | null) => void;
  onGenerateImage: (prompt: string) => void;
  isLoading: boolean;
  placeholder: string;
  language: Language;
  enableImageGeneration: boolean;
}

const fileToB64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

const fileToText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const pdfToText = async (file: File): Promise<string> => {
    // @ts-ignore
    const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.4.170/build/pdf.worker.min.mjs`;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let textContent = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        // Fix: Extract 'str' property instead of 'text'
        textContent += text.items.map((item: any) => 'str' in item ? item.str : '').join(' ') + '\n';
    }
    return textContent;
};


export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onGenerateImage, isLoading, placeholder, language, enableImageGeneration }) => {
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDrawingOpen, setIsDrawingOpen] = useState(false);
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; title: string; message: string; suggestion?: string }>({
    isOpen: false,
    title: '',
    message: '',
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      
      let baseText = '';

      recognition.onstart = () => {
        baseText = textareaRef.current?.value || '';
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setInput(baseText ? baseText + ' ' + transcript : transcript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error, event.message);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current = recognition;
    } else {
        setIsSpeechSupported(false);
    }
    
    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }
  }, [language]);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput && !attachment) return;

    if (trimmedInput.toLowerCase().startsWith('/image ')) {
        const prompt = trimmedInput.slice(7).trim();
        if (prompt) {
            onGenerateImage(prompt);
            setInput('');
            return;
        }
    } else if (trimmedInput.toLowerCase() === '/image') {
        handleGenerateVisualAid();
        return;
    }

    if (trimmedInput || attachment) {
      onSendMessage(trimmedInput, attachment);
      setInput('');
      setAttachment(null);
    }
  };

  const handleGenerateVisualAid = () => {
    if (input.trim() && !isLoading) {
        onGenerateImage(input.trim());
        setInput('');
    } else if (!isLoading) {
        setErrorModal({
            isOpen: true,
            title: 'No Description',
            message: "Please type what you'd like to see in the box first!",
            suggestion: "Example: 'A diagram of a flower' or 'A cute robot learning'."
        });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Guard against excessively large files
    const MAX_SIZE_MB = 20;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setErrorModal({
            isOpen: true,
            title: 'File Too Large',
            message: `The file "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)} MB).`,
            suggestion: `Please use a file smaller than ${MAX_SIZE_MB} MB.`
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
    }

    setIsProcessingFile(true);
    try {
        if (file.type.startsWith('image/')) {
            const content = await fileToB64(file);
            setAttachment({ name: file.name, type: 'image', content, mimeType: file.type });
        } else if (file.type === 'application/pdf') {
            const content = await pdfToText(file);
            setAttachment({ name: file.name, type: 'text', content });
        } else if (file.type === 'text/plain') {
            const content = await fileToText(file);
            setAttachment({ name: file.name, type: 'text', content });
        } else {
            setErrorModal({
                isOpen: true,
                title: 'Unsupported File',
                message: `The file "${file.name}" has a type (${file.type || 'unknown'}) that we don't support yet.`,
                suggestion: 'Please try uploading an image (PNG, JPG), a PDF, or a plain text file.'
            });
        }
    } catch (error: any) {
        console.error("Error processing file:", error);
        let message = "We couldn't read your file correctly.";
        let suggestion = "Try refreshing the page or using a different file.";
        
        if (error.message?.includes('PDF')) {
            message = "There was a problem reading this PDF document.";
            suggestion = "The PDF might be password-protected or corrupted. Try converting it to a text file first.";
        }

        setErrorModal({
            isOpen: true,
            title: 'Upload Failed',
            message,
            suggestion
        });
    } finally {
        setIsProcessingFile(false);
        if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCapture = (imageData: { data: string; mimeType: string }) => {
      setAttachment({
          name: `capture-${new Date().toISOString()}.jpg`,
          type: 'image',
          content: imageData.data,
          mimeType: imageData.mimeType,
      });
      setIsCameraOpen(false);

      if (!input.trim()) {
          setInput("Can you explain what's in this photo?");
          setTimeout(() => textareaRef.current?.focus(), 100);
      }
  };

  const handleDrawingSubmit = (imageData: { data: string; mimeType: string }, mode: 'alphabet' | 'object' | 'word' | 'number') => {
      setAttachment({
          name: `drawing-${mode}-${new Date().toISOString()}.jpg`,
          type: 'image',
          content: imageData.data,
          mimeType: imageData.mimeType,
      });
      
      // Add context to the input if it's empty
      if (!input.trim()) {
          let suggestion = "";
          if (mode === 'alphabet') {
              suggestion = "Did I write this letter correctly?";
          } else if (mode === 'number') {
              suggestion = "Is this number written correctly?";
          } else if (mode === 'word') {
              suggestion = "Did I spell this word right?";
          } else {
              suggestion = "Can you guess what I drew? Did I miss anything?";
          }
          setInput(suggestion);
          setTimeout(() => textareaRef.current?.focus(), 100);
      }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [input, attachment]);

  return (
    <>
    <div className="w-full bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)] to-transparent pt-4 pb-4 flex-shrink-0"> 
      <div className="w-full max-w-3xl mx-auto px-4 chat-input-container">
        {isProcessingFile && (
             <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
                <LoadingSpinner />
                <span>Processing file...</span>
            </div>
        )}
        {attachment && !isProcessingFile && (
            <div className="relative bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-2 mb-2 flex items-center gap-3 animate-fade-in-fast shadow-sm">
                {attachment.type === 'image' ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-[var(--border-color)] bg-black/5 flex-shrink-0">
                        <img 
                            src={attachment.content} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                ) : (
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${attachment.name.toLowerCase().endsWith('.pdf') ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        <span className="text-[10px] font-black">{attachment.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'TXT'}</span>
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">{attachment.name}</p>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase font-medium tracking-wider">
                        {attachment.type === 'image' ? 'Image Ready' : 'Document Loaded'}
                    </p>
                </div>
                <button onClick={() => setAttachment(null)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)] transition-colors" aria-label="Remove attachment">
                    <CloseIcon className="h-4 w-4" />
                </button>
            </div>
        )}
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-end bg-[var(--bg-input)] p-1 rounded-2xl shadow-lg border border-[var(--border-color)]">
          <div className="flex items-center flex-wrap sm:flex-nowrap">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/png, image/jpeg, application/pdf, text/plain"
            />
            <button onClick={() => fileInputRef.current?.click()} disabled={isLoading || isProcessingFile} className="p-2 sm:p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50" title="Upload File">
              <FileIcon />
            </button>
            <button onClick={() => setIsCameraOpen(true)} disabled={isLoading || isProcessingFile} className="p-2 sm:p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50" title="Take Photo">
              <CameraIcon />
            </button>
            <button onClick={() => setIsDrawingOpen(true)} disabled={isLoading || isProcessingFile} className="p-2 sm:p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50" title="Draw">
              <BrushIcon />
            </button>
            <button onClick={handleGenerateVisualAid} disabled={isLoading || isProcessingFile} className="p-2 sm:p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50" title="Generate Visual Aid">
              <SparklesIcon />
            </button>
            {isSpeechSupported && (
              <button
                onClick={handleMicClick}
                disabled={isLoading || isProcessingFile}
                className={`p-2 sm:p-2.5 disabled:opacity-50 transition-colors ${
                  isRecording
                    ? 'text-red-500 animate-pulse-mic'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                title="Voice Input"
              >
                <MicrophoneIcon />
              </button>
            )}
          </div>
          <div className="relative flex-grow flex items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-grow bg-transparent pl-2 pr-12 py-2.5 text-base text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] resize-none border-none outline-none max-h-52 overflow-y-auto"
              rows={1}
              disabled={isLoading || isProcessingFile || isRecording}
            />
              {enableImageGeneration && (
                <div className="absolute left-2 -top-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md px-2 py-1 text-[10px] text-[var(--text-secondary)] shadow-sm animate-fade-in-fast whitespace-nowrap">
                  Tip: You can now just say "Draw a cat" or "Show me a diagram of a cell"!
                </div>
              )}
            <button
              onClick={handleSend}
              disabled={isLoading || isProcessingFile || (!input.trim() && !attachment)}
              className="absolute right-2 bottom-2 p-2 rounded-lg transition-colors duration-200 text-white bg-[var(--accent-color)] disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-[var(--accent-color-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              aria-label="Send message"
            >
              {isLoading || isProcessingFile ? (
                <div className="w-5 h-5">
                  <LoadingSpinner />
                </div>
              ) : (
                <SendIcon />
              )}
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-[var(--text-secondary)] pt-2">
          Dyslearn AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
    <CameraModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleCapture} />
    <DrawingModal isOpen={isDrawingOpen} onClose={() => setIsDrawingOpen(false)} onSend={handleDrawingSubmit} />
    <ErrorModal 
        isOpen={errorModal.isOpen} 
        onClose={() => setErrorModal(prev => ({ ...prev, isOpen: false }))}
        title={errorModal.title}
        message={errorModal.message}
        suggestion={errorModal.suggestion}
    />
    </>
  );
};
