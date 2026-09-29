'use client';

import { useState, FormEvent } from 'react';

interface ContactFormProps {
  recipientName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ContactForm({ recipientName, onSuccess, onCancel }: ContactFormProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // Simulate API request / backend latency
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
      setMessage('');
      if (onSuccess) onSuccess();
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="py-10 text-center space-y-3">
        <div className="w-12 h-12 bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          ✓
        </div>
        <p className="text-sm font-semibold text-foreground">Message sent to {recipientName}!</p>
        <p className="text-xs text-muted">Your dummy transmission was successfully queued.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-foreground mb-1">Your Email</label>
        <input 
          type="email" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-foreground mb-1">Message</label>
        <textarea 
          required 
          rows={4} 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Write your note to ${recipientName}...`}
          className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted resize-none"
        ></textarea>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-muted hover:bg-border rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
        <button 
          type="submit" 
          className="px-4 py-2 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          Send Message
        </button>
      </div>
    </form>
  );
}