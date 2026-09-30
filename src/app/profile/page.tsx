'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ProfilePage() {
  const { loggedIn, user } = useAuth();
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (!loggedIn) return;

    fetch('/api/v1/history', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.history) {
          setHistoryItems(data.history);
        }
      })
      .catch((err) => console.error('Failed to load history:', err))
      .finally(() => setLoadingHistory(false));
  }, [loggedIn]);

  return (
    <div className="page-container min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="grow max-w-4xl w-full mx-auto px-6 py-10 flex flex-col gap-6">
        {!loggedIn ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center my-auto bg-card border border-border rounded-xl shadow-sm p-8">
            <h3 className="text-xl font-semibold text-foreground mb-2">Access Restricted</h3>
            <p className="text-sm text-muted-foreground mb-4">Please log in to view your user profile and history.</p>
            <a href="/auth" className="px-4 py-2 bg-cyan-600 text-white text-xs font-medium rounded-lg hover:bg-cyan-500 transition">
              Go to Login
            </a>
          </div>
        ) : (
          <>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-foreground">User Profile</h2>
              <div className="text-sm text-slate-300 flex items-center gap-2">
                <span>Logged in user:</span>
                <strong className="text-cyan-400 font-mono text-base">{user}</strong>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}