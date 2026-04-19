"use client";

import React, { useEffect, useState } from "react";
import { useAbly } from "@/app/context/AblyContext";
import { useAuth } from "@/app/context/AuthContext";
import { generateAlias } from "@/utils/names";
import { Presentation, Loader2, Info } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import PDFViewer
const PDFViewer = dynamic(() => import("./PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] glass rounded-3xl flex items-center justify-center animate-pulse">
      <div className="text-text-secondary font-display">Initializing Viewer...</div>
    </div>
  ),
});

interface ParticipantViewProps {
  roomCode: string;
  initialRoom: any;
}

export default function ParticipantView({ roomCode, initialRoom }: ParticipantViewProps) {
  const { client, connectionStatus } = useAbly();
  const { user, loading: authLoading } = useAuth();
  const [alias, setAlias] = useState("");
  
  // PDF State
  const [pdfUrl, setPdfUrl] = useState<string | null>(initialRoom?.current_pdf_url || null);
  const [currentPage, setCurrentPage] = useState<number>(initialRoom?.current_pdf_page || 1);

  // Generate alias once on mount
  useEffect(() => {
    if (authLoading) return;

    let seed = "";
    if (user) {
      seed = `${user.id}-${roomCode}`;
    } else {
      const storageKey = `suma-guest-seed-${roomCode}`;
      let guestSeed = localStorage.getItem(storageKey);
      if (!guestSeed) {
        guestSeed = Math.random().toString(36).substring(2);
        localStorage.setItem(storageKey, guestSeed);
      }
      seed = guestSeed;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAlias(generateAlias(seed));
  }, [user, authLoading, roomCode]);
  
  useEffect(() => {
    if (!client || connectionStatus !== "connected" || !alias) return;

    const channel = client.channels.get(`room:${roomCode}`);
    
    // Join presence
    channel.presence.enter({ name: alias });

    // Listen for PDF updates from host
    channel.subscribe("pdf-update", (message) => {
      const { url, page } = message.data;
      setPdfUrl(url);
      setCurrentPage(page || 1);
    });

    // Listen for page sync from host
    channel.subscribe("page-sync", (message) => {
      const { page } = message.data;
      setCurrentPage(page);
    });

    return () => {
      channel.presence.leave();
      channel.unsubscribe();
    };
  }, [client, connectionStatus, roomCode, alias]);

  return (
    <div className="max-w-6xl w-full flex flex-col items-center gap-12 animate-fade-in pb-20">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-display mb-4 tracking-tight">
          Welcome, <span className="text-accent-primary">{alias}</span>
        </h2>
        
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-xs font-mono text-text-secondary uppercase tracking-widest">
            <div className={`w-2 h-2 rounded-full ${connectionStatus === "connected" ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`} />
            {connectionStatus === "connected" ? "Real-time Sync Active" : "Connecting..."}
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="text-xs font-mono text-text-secondary uppercase tracking-widest">
            Room: {roomCode}
          </div>
        </div>
      </div>
      
      {pdfUrl ? (
        <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
           <div className="flex items-center justify-between px-6 glass py-3 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <Presentation className="w-5 h-5 text-accent-primary" />
                <span className="text-sm font-semibold text-white/90">Host is presenting</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-[10px] font-bold uppercase tracking-widest">
                Locked to Host
              </div>
           </div>

           <PDFViewer 
             fileUrl={pdfUrl} 
             currentPage={currentPage}
             isHost={false}
           />
        </div>
      ) : (
        <div className="max-w-2xl w-full glass p-12 rounded-[3.5rem] border border-white/5 text-center flex flex-col items-center gap-8">
          <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center relative">
            <Loader2 className="w-12 h-12 text-white/20 animate-spin absolute" />
            <Presentation className="w-10 h-10 text-white/40" />
          </div>
          
          <div>
            <h3 className="text-2xl font-display text-white mb-3">Waiting for Presentation</h3>
            <p className="text-text-secondary font-light leading-relaxed">
              The host hasn't shared a presentation yet. Relax and get ready—the session will begin shortly.
            </p>
          </div>

          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/5 text-text-secondary text-xs">
            <Info className="w-4 h-4 text-accent-secondary" />
            Your view will automatically update when the host starts.
          </div>
        </div>
      )}
    </div>
  );
}
