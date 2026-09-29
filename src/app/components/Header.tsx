'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Dropdown from './Dropdown';
import ThemeToggleItem from './forms/ThemeToggleItem';
import { useCart } from '../context/CartContext'; // Import the context hook

export default function Header(){
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { cartCount } = useCart(); // Pull cartCount directly from global context

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

                    {/* Preferences Dropdown */}
                    <Dropdown triggerLabel="Settings">
                        <div className="px-4 py-2 border-b border-border">
                            <p className="text-[10px] font-semibold tracking-wider text-muted uppercase">Preferences</p>
                        </div>
                        <ThemeToggleItem 
                            isDarkMode={isDarkMode} 
                            onToggle={handleToggle} 
                        />
                    </Dropdown>
                </nav>
            </div>
        </header>
    );
}