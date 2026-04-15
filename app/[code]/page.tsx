import React from "react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { AlertCircle, Users, Settings } from "lucide-react";
import { AblyProvider } from "@/app/context/AblyContext";
import HostView from "./components/HostView";
import ParticipantView from "./components/ParticipantView";

export default async function RoomPage({ params }: { params: Promise<{ code: string }> }) {
  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase();

  // 1. Validate Code Format early (XXX-XXX-XXX)
  const isValidFormat = /^[A-Z]{3}-[A-Z]{3}-[A-Z]{3}$/.test(code);

  if (!isValidFormat) {
    return <InvalidRoom code={code} reason="Invalid format. Example: AKD-KWB-WUG" />;
  }

  // 2. Fetch Room from Database
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", code)
    .single();

  if (roomError || !room) {
    // If room is not found, maybe due to RLS or it doesn't exist
    return <InvalidRoom code={code} reason="Room not found or no longer active." />;
  }

  // 3. Determine if current user is Host
  const { data: { user } } = await supabase.auth.getUser();
  const isHost = user && user.id === room.host_id;

  return (
    <div className="min-h-screen relative overflow-hidden bg-black flex flex-col">
      {/* Background Decorative Blobs */}
      <div
        className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full -z-10 opacity-20 animate-pulse-glow"
        style={{ background: 'var(--accent-glow)', filter: 'blur(150px)' }}
      />
      <div
        className="fixed bottom-[-5%] left-[-5%] w-[500px] h-[500px] rounded-full -z-10 opacity-10 animate-pulse-glow"
        style={{ background: 'rgba(56, 189, 248, 0.2)', filter: 'blur(120px)', animationDelay: '-3s' }}
      />

      <nav className="w-full glass border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-display text-xl tracking-tight text-white hover:text-accent-primary transition-colors">
            SUMA
          </Link>
          <div className="h-4 w-[1px] bg-white/20" />
          <span className="font-mono bg-white/10 px-3 py-1 rounded-md text-sm tracking-widest text-accent-primary border border-white/5">
            {code}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isHost ? (
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-primary/20 border border-accent-primary/30 text-accent-primary text-xs font-bold uppercase tracking-wider">
               <Settings className="w-3 h-3" />
               Host
             </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-bold uppercase tracking-wider">
              <Users className="w-3 h-3" />
              Participant
            </div>
          )}
        </div>
      </nav>

      <AblyProvider>
        <main className="flex-1 flex flex-col items-center justify-center p-8 z-10">
          {isHost ? <HostView roomCode={code} /> : <ParticipantView roomCode={code} />}
        </main>
      </AblyProvider>

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

// Subcomponents

function InvalidRoom({ code, reason }: { code: string, reason: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-black">
      <div className="glass p-12 rounded-3xl text-center max-w-lg animate-slide-up border border-white/5">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-3xl font-display mb-4">Room {code} Not Found</h1>
        <p className="text-text-secondary mb-8">{reason}</p>
        <Link href="/" className="btn btn-primary w-full py-4 text-center block">
          Return Home
        </Link>
      </div>
    </div>
  );
}

