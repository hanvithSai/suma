import React from "react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft, Zap, Tv } from "lucide-react";
import Link from "next/link";
import { CreateRoomButton } from "./CreateRoomButton";

export default async function HostDashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Authenticate user on the server
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/host/dashboard");
  }

  // Fetch their latest rooms
  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .eq("host_id", user.id)
    .order("created_at", { ascending: false });

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
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-accent-primary/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-accent-primary" fill="currentColor" />
            </div>
            <div>
              <h2 className="text-xl font-display mb-2">Initialize Session</h2>
              <p className="text-sm text-text-secondary font-light">
                Create a new live room. Once initialized, you can invite participants by sharing the unique code.
              </p>
            </div>
            
            <CreateRoomButton />

          </div>
        </div>

        <div className="md:col-span-2 glass p-8 rounded-3xl animate-slide-up border border-white/5" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-display mb-6">Recent Sessions</h2>
          
          {rooms && rooms.length > 0 ? (
            <div className="flex flex-col gap-4">
              {rooms.map((room) => (
                <div key={room.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border border-white/10 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent-secondary/20 flex items-center justify-center border border-accent-secondary/30">
                      <Tv className="w-5 h-5 text-accent-secondary" />
                    </div>
                    <div>
                      <div className="text-lg font-mono tracking-widest text-white">{room.code}</div>
                      <div className="text-sm text-text-secondary font-light">
                        {new Date(room.created_at).toLocaleDateString()} at {new Date(room.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <Link href={`/${room.code}`} className="btn btn-secondary px-6 py-2 text-sm mt-4 md:mt-0">
                    Rejoin Room
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
              <p className="text-text-secondary font-light">No recent sessions found.</p>
              <p className="text-sm text-text-secondary/60 mt-2">Create your first room to start engaging.</p>
            </div>
          )}
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
