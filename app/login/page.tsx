"use client";

import React from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Zap, Globe, ArrowLeft } from "lucide-react";
import Link from "next/link";

/**
 * app/login/page.tsx
 * 
 * Premium login page for SUMA.
 * Provides a clean, focused exit point from the landing page to authenticate.
 */

export default function LoginPage() {
  const { signInWithGoogle, loading, user } = useAuth();

  // If user is already logged in, show a simple message or redirect
  // Note: Redirection is usually handled in useEffect, but for simplicity we show a state here
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="glass p-12 rounded-3xl text-center max-w-md animate-fade-in">
          <h1 className="text-3xl font-display mb-4">Already Signed In</h1>
          <p className="text-text-secondary mb-8">You are already signed in as {user.email}.</p>
          <Link href="/" className="btn btn-primary w-full">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-8 overflow-hidden">
      {/* Background Decorative Blobs */}
      <div
        className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full -z-10 opacity-30 animate-pulse-glow"
        style={{ background: 'var(--accent-glow)', filter: 'blur(150px)' }}
      />
      <div
        className="fixed bottom-[-5%] left-[-5%] w-[500px] h-[500px] rounded-full -z-10 opacity-20 animate-pulse-glow"
        style={{ background: 'rgba(56, 189, 248, 0.2)', filter: 'blur(120px)', animationDelay: '-3s' }}
      />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </Link>

      <div className="max-w-md w-full glass p-10 md:p-12 rounded-[2.5rem] shadow-2xl animate-slide-up relative z-10">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 flex items-center justify-center mb-6 border border-accent-primary/20">
            <Zap className="w-8 h-8 text-accent-primary" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-display mb-4 tracking-tight">Welcome Back</h1>
          <p className="text-text-secondary font-light">
            Sign in to your SUMA account to start hosting seamless interactive sessions.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 bg-white text-black hover:bg-white/90 transition-all py-4 px-6 rounded-2xl font-semibold shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Globe className="w-5 h-5" />
            <span>{loading ? "Connecting..." : "Continue with Google"}</span>
          </button>
        </div>

        <p className="mt-10 text-center text-xs text-text-secondary">
          By continuing, you agree to SUMA&apos;s <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 -z-20 opacity-[0.02] pointer-events-none">
        <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] absolute inset-0">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-text-primary" />
          ))}
        </div>
      </div>
    </div>
  );
}
