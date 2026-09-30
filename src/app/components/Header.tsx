'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Dropdown from './Dropdown';
import ThemeToggleItem from './forms/ThemeToggleItem';
import { useCart } from '../context/CartContext';
import { useAuth } from '@/app/context/AuthContext';

export default function Header(){
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { cartCount } = useCart(); 
    const { loggedIn, user, logout } = useAuth();

    // On mount, check local storage or system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    // Toggle handler
    const handleToggle = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm transition-colors">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    Website Template & Component Demo
                </h2>

                {/* Navigation & Controls */}
                <nav className="flex items-center gap-3">
                    <Link 
                        href="/" 
                        className="px-3.5 py-2 text-sm font-medium text-foreground bg-border rounded-lg hover:opacity-80 transition-opacity">
                        Home
                    </Link>
                    <Link 
                        href="/details" 
                        className="px-3.5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                        Details
                    </Link>

                    {/* Cart */}
                    <Link 
                        href="/cart" 
                        className="relative flex items-center px-3 py-2 text-sm font-medium bg-border rounded-lg text-foreground hover:bg-border/80 transition-colors"
                        aria-label="View Cart"
                    >
                        <span>🛒</span>
                        <span className="ml-1.5 text-xs font-bold">{cartCount}</span>
                    </Link>

                    {/* Preferences & Account Dropdown */}
                    <Dropdown triggerLabel="Settings">
                        <div className="px-4 py-2 border-b border-border">
                            <p className="text-[10px] font-semibold tracking-wider text-muted uppercase">Preferences</p>
                        </div>
                        <ThemeToggleItem 
                            isDarkMode={isDarkMode} 
                            onToggle={handleToggle} 
                        />

                        {/* Authentication Options in Dropdown */}
                        <div className="px-4 py-2 border-t border-b border-border mt-1">
                            <p className="text-[10px] font-semibold tracking-wider text-muted uppercase">Account</p>
                        </div>

                        {loggedIn ? (
                            <>
                                <div className="px-4 py-2 text-xs text-foreground font-mono truncate">
                                    User: <strong className="text-cyan-500">{user}</strong>
                                </div>
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-xs text-foreground hover:bg-border/55 transition-colors"
                                >
                                    View Profile
                                </Link>
                                <Link
                                    href="/history"
                                    className="block px-4 py-2 text-xs text-foreground hover:bg-border/55 transition-colors"
                                >
                                    Simulation History
                                </Link>
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-border/55 transition-colors"
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth"
                                className="block px-4 py-2 text-xs font-medium text-cyan-500 hover:bg-border/55 transition-colors"
                            >
                                Log In / Register
                            </Link>
                        )}
                    </Dropdown>
                </nav>
            </div>
        </header>
    );
}