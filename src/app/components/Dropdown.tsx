'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

interface DropdownProps {
  triggerLabel: string;
  children: ReactNode;
  align?: 'left' | 'right';
}

export default function Dropdown({ triggerLabel, children, align = 'right' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground bg-card border border-border rounded-lg shadow-sm hover:bg-border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span>{triggerLabel}</span>
        <svg 
          className={`w-3.5 h-3.5 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-56 bg-card border border-border rounded-xl shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-100`}>
          {children}
        </div>
      )}
    </div>
  );
}