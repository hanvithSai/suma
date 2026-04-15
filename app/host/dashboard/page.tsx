"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { createRoomAction } from "@/app/actions/room";
import { Plus, ArrowLeft, Loader2, Zap } from "lucide-react";
import Link from "next/link";

export default function HostDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !user) {
      router.push("/login?next=/host/dashboard");
    }
  }, [user, authLoading, router]);

  const handleCreateRoom = async () => {
    setIsCreating(true);
    setError(null);
    try {
      const result = await createRoomAction();
      if (result.error) {
        setError(result.error);
        setIsCreating(false);
      } else if (result.code) {
        // Redirect to the newly created room
        router.push(`/${result.code}`);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
      setIsCreating(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative p-8 md:p-16 overflow-hidden">
      {/* Background Decorative Blobs */}
      <div
        className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full -z-10 opacity-20 animate-pulse-glow"
        style={{ background: 'var(--accent-glow)', filter: 'blur(150px)' }}
      />
      <div
        className="fixed bottom-[-5%] left-[-5%] w-[500px] h-[500px] rounded-full -z-10 opacity-10 animate-pulse-glow"
        style={{ background: 'rgba(56, 189, 248, 0.2)', filter: 'blur(120px)', animationDelay: '-3s' }}
      />

      <nav className="max-w-6xl mx-auto flex items-center justify-between mb-16 animate-fade-in">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group">
            <ArrowLeft className="w-4 h-4 text-text-secondary group-hover:text-white transition-colors" />
          </Link>
          <h1 className="text-2xl font-display">Host Dashboard</h1>
        </div>
        <div className="px-4 py-2 rounded-full glass border border-white/5 text-sm text-text-secondary flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {user.email}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="glass p-8 rounded-3xl animate-slide-up flex flex-col gap-6 relative overflow-hidden group border border-white/5 hover:border-accent-primary/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-2xl bg-accent-primary/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-accent-primary" fill="currentColor" />
            </div>
            <div>
              <h2 className="text-xl font-display mb-2">Initialize Session</h2>
              <p className="text-sm text-text-secondary font-light">
                Create a new live room. Once initialized, you can invite participants by sharing the unique code.
              </p>
            </div>
            
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}

            <button 
              onClick={handleCreateRoom}
              disabled={isCreating}
              className="btn btn-primary py-4 mt-4 w-full flex justify-center items-center gap-2 group-hover:shadow-[0_0_20px_rgba(0,255,136,0.2)]"
            >
              {isCreating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Create Room</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="md:col-span-2 glass p-8 rounded-3xl animate-slide-up border border-white/5" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-display mb-6">Recent Sessions</h2>
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
            <p className="text-text-secondary font-light">No recent sessions found.</p>
            <p className="text-sm text-text-secondary/60 mt-2">Create your first room to start engaging.</p>
          </div>
        </div>
      </main>

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
