'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

type AuthMode = 'login' | 'register';

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const success = await login(username, password);
        if (success) {
          setStatusMessage({ text: 'Successfully logged in! Redirecting...', isError: false });
          setTimeout(() => router.push('/'), 800);
        } else {
          setStatusMessage({ text: 'Invalid username or password.', isError: true });
        }
      } else {
        const success = await register(username, password);
        if (success) {
          await login(username, password);
          setStatusMessage({ text: 'Account created successfully! Redirecting...', isError: false });
          setTimeout(() => router.push('/'), 800);
        } else {
          setStatusMessage({ text: 'Registration failed. Username may already be taken.', isError: true });
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setStatusMessage({ text: 'A network error occurred while connecting to the server.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col gap-6">
          
          {/* Header Tabs */}
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {mode === 'login' 
                ? 'Log in to access your saved simulation history and configurations.' 
                : 'Register to persist your maritime mesh and satellite telemetry setups.'}
            </p>

            <div className="flex bg-background p-1 rounded-lg border border-border mt-4">
              <button
                type="button"
                onClick={() => { setMode('login'); setStatusMessage(null); }}
                className={`flex-1 py-2 text-xs font-medium rounded-md transition ${
                  mode === 'login' ? 'bg-cyan-600 text-white shadow' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setStatusMessage(null); }}
                className={`flex-1 py-2 text-xs font-medium rounded-md transition ${
                  mode === 'register' ? 'bg-cyan-600 text-white shadow' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. QualitySushi"
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {statusMessage && (
              <div className={`text-xs p-3 rounded-lg border text-center font-medium ${
                statusMessage.isError 
                  ? 'bg-red-950/50 border-red-900 text-red-300' 
                  : 'bg-emerald-950/50 border-emerald-900 text-emerald-300'
              }`}>
                {statusMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm rounded-lg transition shadow disabled:opacity-50"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}