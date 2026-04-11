"use client";

import React, { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Zap, LogOut, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-8 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass px-8 py-4 rounded-2xl relative">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-accent-primary" fill="currentColor" />
          <span className="font-display font-bold text-xl tracking-tighter">SUMA</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          <Link href="/#features" className="text-sm font-medium hover:text-accent-primary transition-colors">Features</Link>
          <Link href="/#about" className="text-sm font-medium hover:text-accent-primary transition-colors">About</Link>
          <Link href="/#action" className="text-sm font-medium hover:text-accent-primary transition-colors">Join Class</Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {loading ? (
            <div className="w-10 h-10 rounded-full glass animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-white/5 transition-colors group"
              >
                {user.user_metadata?.avatar_url ? (
                  <Image 
                    src={user.user_metadata.avatar_url} 
                    alt="Avatar" 
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border border-white/20"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center text-white text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <ChevronDown className={`w-4 h-4 text-text-secondary group-hover:text-text-primary transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 glass rounded-2xl shadow-2xl p-2 border-glass-border animate-fade-in">
                  <div className="px-4 py-3 border-b border-glass-border mb-2">
                    {user.user_metadata?.full_name && (
                      <p className="text-sm font-bold text-text-primary truncate">{user.user_metadata.full_name}</p>
                    )}
                    <p className="text-[10px] text-text-secondary truncate mt-0.5">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className="hidden sm:inline-flex px-6 py-2 rounded-xl bg-accent-primary text-white text-sm font-semibold hover:brightness-110 transition-all shadow-lg"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
