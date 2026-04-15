"use client";

import React, { useEffect, useState } from "react";
import { useAbly } from "@/app/context/AblyContext";
import { Users, Tv } from "lucide-react";

export default function HostView({ roomCode }: { roomCode: string }) {
  const { client, connectionStatus } = useAbly();
  const [participants, setParticipants] = useState<{ id: string, name: string }[]>([]);

  useEffect(() => {
    if (!client || connectionStatus !== "connected") return;

    const channel = client.channels.get(`room:${roomCode}`);

    const updatePresence = async () => {
      const members = await channel.presence.get();
      const list = members.map(m => {
        const data = m.data as { name?: string };
        return {
          id: m.clientId || m.connectionId,
          name: data?.name || "Anonymous"
        };
      });
      setParticipants(list);
    };

    // Initial fetch
    updatePresence();

    // Subscribe to presence changes
    channel.presence.subscribe("enter", updatePresence);
    channel.presence.subscribe("leave", updatePresence);
    channel.presence.subscribe("update", updatePresence);

    return () => {
      channel.presence.unsubscribe();
    };
  }, [client, connectionStatus, roomCode]);

  return (
    <div className="max-w-4xl w-full flex flex-col items-center gap-12 animate-fade-in">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-display mb-6">Host Control Room</h2>
        <p className="text-lg text-text-secondary font-light">
          Manage your session and monitor audience engagement in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {/* Presence Stats */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent-primary/20 flex items-center justify-center">
              <Users className="w-8 h-8 text-accent-primary" />
            </div>
            <div>
              <div className="text-5xl font-display text-white">{participants.length}</div>
              <div className="text-xs text-text-secondary uppercase tracking-widest font-semibold mt-2">Active Participants</div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 text-sm font-light text-text-secondary leading-relaxed">
            <div className="flex items-center gap-2 mb-3 text-accent-secondary font-semibold">
              <Tv className="w-4 h-4" />
              Live Sync Info
            </div>
            Participant names are generated anonymously. Use these for engagement and quiz leaderboards.
          </div>
        </div>

        {/* Participant List */}
        <div className="md:col-span-2 glass p-8 rounded-3xl border border-white/5 flex flex-col gap-6">
          <h3 className="text-xl font-display flex items-center gap-3">
            Audience Overview
            {participants.length > 0 && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
          </h3>

          <div className="max-h-[300px] overflow-y-auto pr-4 flex flex-wrap gap-4">
            {participants.length > 0 ? (
              participants.map((p) => (
                <div key={p.id} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/90 animate-slide-up">
                   {p.name}
                </div>
              ))
            ) : (
              <div className="w-full py-12 border border-dashed border-white/10 rounded-2xl text-center text-text-secondary font-light">
                Waiting for the first participant to join...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
