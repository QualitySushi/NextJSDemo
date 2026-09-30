"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    user: string | null;
    loggedIn: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    register: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        // Check active session on mount
        fetch('/api/v1/auth/session', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.loggedIn) {
                    setUser(data.username);
                    setLoggedIn(true);
                }
            })
            .catch(err => console.error('Failed to check session:', err));
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        const res = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success) {
            setUser(data.username);
            setLoggedIn(true);
            return true;
        }
        return false;
    };

    const register = async (username: string, password: string): Promise<boolean> => {
        const res = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        return data.success;
    };

    const logout = async () => {
        await fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include' });
        setUser(null);
        setLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ user, loggedIn, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}