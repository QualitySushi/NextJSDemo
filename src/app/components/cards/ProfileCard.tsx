'use client';

import { useState } from 'react';
import Modal from '../Modal';
import ContactForm from '../forms/ContactForm';

interface ProfileCardProps {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export default function ProfileCard({ 
  name, 
  role, 
  bio, 
  avatarUrl,
  email = "sarah.jenkins@example.com",
  githubUrl = "https://github.com",
  linkedinUrl = "https://linkedin.com"
}: ProfileCardProps) {
  const [activeModal, setActiveModal] = useState<'none' | 'message' | 'connect'>('none');
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm text-center flex flex-col items-center h-full">
        {/* Centered Content Area */}
        <div className="my-auto flex flex-col items-center py-4">
          <img 
            src={avatarUrl} 
            alt={name} 
            className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-border shadow"
          />
          <h3 className="text-base font-bold text-foreground">{name}</h3>
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">{role}</p>
          <p className="text-xs text-muted max-w-xs">{bio}</p>
        </div>

        {/* Action Buttons Anchored to Bottom */}
        <div className="flex gap-2 w-full mt-auto pt-4 border-t border-border">
          <button 
            onClick={() => setActiveModal('message')}
            className="flex-1 py-2 bg-border text-foreground text-xs font-semibold rounded-lg hover:opacity-80 transition-opacity"
          >
            Message
          </button>
          <button 
            onClick={() => setActiveModal('connect')}
            className="flex-1 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Connect
          </button>
        </div>
      </div>

      {/* Reused Global Modal for Messaging */}
      <Modal 
        isOpen={activeModal === 'message'} 
        onClose={() => setActiveModal('none')} 
        title={`Send Message to ${name}`}
      >
        <ContactForm 
          recipientName={name} 
          onSuccess={() => setActiveModal('none')}
          onCancel={() => setActiveModal('none')}
        />
      </Modal>

      {/* Reused Global Modal for Connecting */}
      <Modal 
        isOpen={activeModal === 'connect'} 
        onClose={() => setActiveModal('none')} 
        title={`Connect with ${name}`}
      >
        <div className="space-y-3 py-2">
          <button 
            onClick={copyEmail}
            className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-border transition-colors text-left text-xs font-medium text-foreground"
          >
            <span>📧 {email}</span>
            <span className="text-blue-600 dark:text-blue-400">{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <a 
            href={linkedinUrl} 
            target="_blank" 
            rel="noreferrer"
            className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-border transition-colors text-left text-xs font-medium text-foreground"
          >
            <span>💼 LinkedIn Profile</span>
            <span className="text-muted">↗</span>
          </a>

          <a 
            href={githubUrl} 
            target="_blank" 
            rel="noreferrer"
            className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-border transition-colors text-left text-xs font-medium text-foreground"
          >
            <span>🐙 GitHub Portfolio</span>
            <span className="text-muted">↗</span>
          </a>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            onClick={() => setActiveModal('none')}
            className="w-full py-2 text-xs font-medium bg-border text-foreground rounded-lg hover:opacity-80 transition-opacity"
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}