"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAbly } from "@/app/context/AblyContext";
import { Users, Tv, Presentation, X, Settings2 } from "lucide-react";
import PDFUploadZone from "./PDFUploadZone";
import dynamic from "next/dynamic";
import { updateRoomPDFAction, updateRoomPageAction } from "@/app/actions/room";

// Dynamically import PDFViewer to avoid SSR issues with react-pdf
const PDFViewer = dynamic(() => import("./PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] glass rounded-3xl flex items-center justify-center animate-pulse">
      <div className="text-text-secondary font-display">Initializing Viewer...</div>
    </div>
  ),
});

interface HostViewProps {
  roomCode: string;
  initialRoom: any;
}

export default function HostView({ roomCode, initialRoom }: HostViewProps) {
  const { client, connectionStatus } = useAbly();
  const [participants, setParticipants] = useState<{ id: string, name: string }[]>([]);
  
  // PDF State
  const [pdfUrl, setPdfUrl] = useState<string | null>(initialRoom?.current_pdf_url || null);
  const [currentPage, setCurrentPage] = useState<number>(initialRoom?.current_pdf_page || 1);
  const [isViewing, setIsViewing] = useState(!!initialRoom?.current_pdf_url);

  const channel = client?.channels.get(`room:${roomCode}`);

  useEffect(() => {
    if (!client || connectionStatus !== "connected") return;

    const updatePresence = async () => {
      const members = await channel?.presence.get();
      const list = members?.map(m => {
        const data = m.data as { name?: string };
        return {
          id: m.clientId || m.connectionId,
          name: data?.name || "Anonymous"
        };
      }) || [];
      setParticipants(list);
    };

    updatePresence();
    channel?.presence.subscribe("enter", updatePresence);
    channel?.presence.subscribe("leave", updatePresence);
    channel?.presence.subscribe("update", updatePresence);

    return () => {
      channel?.presence.unsubscribe();
    };
  }, [client, connectionStatus, roomCode, channel]);

  const handleUploadSuccess = useCallback(async (url: string) => {
    setPdfUrl(url);
    setCurrentPage(1);
    setIsViewing(true);
    
    // Update DB
    await updateRoomPDFAction(roomCode, url);
    
    // Broadcast to Ably
    channel?.publish("pdf-update", { url, page: 1 });
  }, [roomCode, channel]);

  const handlePageChange = useCallback(async (page: number) => {
    setCurrentPage(page);
    
    // Update DB (debounce this in a real app, but for now simple)
    await updateRoomPageAction(roomCode, page);
    
    // Broadcast to Ably
    channel?.publish("page-sync", { page });
  }, [roomCode, channel]);

  const resetPresentation = async () => {
    setPdfUrl(null);
    setIsViewing(false);
    await updateRoomPDFAction(roomCode, null);
    channel?.publish("pdf-update", { url: null, page: 1 });
  };

  return (
    <div className="max-w-6xl w-full flex flex-col items-center gap-12 animate-fade-in pb-20">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-bold uppercase tracking-[0.2em] mb-6">
          <Presentation className="w-4 h-4" />
          Live Presentation Mode
        </div>
        <h2 className="text-4xl md:text-6xl font-display mb-6 tracking-tight">Host Control Room</h2>
        <p className="text-lg text-text-secondary font-light max-w-2xl mx-auto">
          Manage your session, upload slides, and lead your audience in real-time.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="w-full flex flex-col gap-8">
        {!isViewing ? (
          <div className="glass p-12 rounded-[3.5rem] border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
            <PDFUploadZone roomCode={roomCode} onUploadSuccess={handleUploadSuccess} />
          </div>
        ) : (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-accent-primary/20 border border-accent-primary/30">
                  <Presentation className="w-6 h-6 text-accent-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-display text-white">Active Presentation</h3>
                  <p className="text-sm text-text-secondary">Broadcasting to {participants.length} participants</p>
                </div>
              </div>
              <button 
                onClick={resetPresentation}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all font-semibold text-sm"
              >
                <X className="w-4 h-4" />
                End Presentation
              </button>
            </div>

            <PDFViewer 
              fileUrl={pdfUrl!} 
              currentPage={currentPage} 
              onPageChange={handlePageChange}
              isHost={true}
            />
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          {/* Presence Stats */}
          <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center gap-4 text-center group hover:border-accent-primary/30 transition-colors">
            <div className="w-20 h-20 rounded-[2.5rem] bg-accent-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Users className="w-10 h-10 text-accent-primary" />
            </div>
            <div>
              <div className="text-6xl font-display text-white">{participants.length}</div>
              <div className="text-xs text-text-secondary uppercase tracking-[0.2em] font-bold mt-2">Live Audience</div>
            </div>
          </div>

          {/* Participant Grid */}
          <div className="lg:col-span-2 glass p-8 rounded-3xl border border-white/5 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display flex items-center gap-3">
                Current Participants
                {participants.length > 0 && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
              </h3>
              <Settings2 className="w-5 h-5 text-text-secondary hover:text-white cursor-pointer transition-colors" />
            </div>

            <div className="max-h-[160px] overflow-y-auto pr-2 custom-scrollbar flex flex-wrap gap-3">
              {participants.length > 0 ? (
                participants.map((p) => (
                  <div key={p.id} className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-white/70 hover:border-white/20 hover:bg-white/[0.05] transition-all whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-accent-secondary inline-block mr-2" />
                    {p.name}
                  </div>
                ))
              ) : (
                <div className="w-full py-10 border border-dashed border-white/10 rounded-2xl text-center text-text-secondary font-light italic">
                  Waiting for your audience to arrive...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
