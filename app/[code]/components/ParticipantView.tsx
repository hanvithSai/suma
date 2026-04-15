"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAbly } from "@/app/context/AblyContext";
import { generateAlias } from "@/utils/names";

export default function ParticipantView({ roomCode }: { roomCode: string }) {
  const { client, connectionStatus } = useAbly();
  const [alias] = useState(() => generateAlias());
  
  useEffect(() => {
    if (!client || connectionStatus !== "connected") return;

    const channel = client.channels.get(`room:${roomCode}`);
    
    // Join presence
    channel.presence.enter({ name: alias });

    return () => {
      channel.presence.leave();
    };
  }, [client, connectionStatus, roomCode, alias]);

  return (
    <div className="max-w-2xl w-full text-center animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-display mb-6">Connected Successfully</h2>
      <p className="text-lg text-text-secondary font-light mb-12">
        You are in the room as <span className="text-accent-primary font-semibold">{alias}</span>. 
        Waiting for the host to begin the session.
      </p>
      
      <div className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-accent-primary/5 to-transparent group-hover:from-accent-primary/10 transition-colors" />
        <div className="flex flex-col justify-center items-center h-48 gap-8">
          <div className="flex gap-2">
             <div className="w-3 h-3 rounded-full bg-accent-primary animate-bounce" style={{ animationDelay: '0ms' }} />
             <div className="w-3 h-3 rounded-full bg-accent-primary animate-bounce" style={{ animationDelay: '150ms' }} />
             <div className="w-3 h-3 rounded-full bg-accent-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-xs font-mono text-text-secondary uppercase tracking-widest">
            <div className={`w-2 h-2 rounded-full ${connectionStatus === "connected" ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`} />
            {connectionStatus === "connected" ? "Real-time Sync Active" : "Connecting..."}
          </div>
        </div>
      </div>
    </div>
  );
}
