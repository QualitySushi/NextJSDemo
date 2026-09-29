'use client';

import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Close modal on pressing the 'Escape' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Modal Box with explicit solid background color */}
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 dark:border-gray-800 text-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <button
              onClick={onClose}
              className="text-muted hover:text-foreground transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}