"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface PDFUploadZoneProps {
  roomCode: string;
  onUploadSuccess: (url: string) => void;
}

export default function PDFUploadZone({ roomCode, onUploadSuccess }: PDFUploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleUpload = async (file: File) => {
    if (!file.type.includes("pdf")) {
      setError("Please upload a PDF file.");
      return;
    }

    // Limit to 20MB
    if (file.size > 20 * 1024 * 1024) {
      setError("File size exceeds 20MB limit.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const fileName = `${roomCode}/${Date.now()}-${file.name}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from("room-assets")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("room-assets")
        .getPublicUrl(data.path);

      onUploadSuccess(publicUrl);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "Upload failed. Does 'room-assets' bucket exist?");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative glass border-2 border-dashed rounded-[2.5rem] p-12 transition-all duration-300 flex flex-col items-center justify-center text-center gap-6
          ${dragActive ? 'border-accent-primary bg-accent-primary/10 scale-[1.02]' : 'border-white/10 hover:border-white/20'}
          ${isUploading ? 'pointer-events-none opacity-80' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleChange}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-accent-primary animate-spin" />
              <Upload className="w-6 h-6 text-accent-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <h4 className="text-xl font-display text-white mb-2">Uploading Presentation...</h4>
              <p className="text-text-secondary text-sm">Magic is happening in the background.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 rounded-3xl bg-accent-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Upload className="w-10 h-10 text-accent-primary" />
            </div>
            
            <div>
              <h4 className="text-2xl font-display text-white mb-2">Upload your PDF</h4>
              <p className="text-text-secondary font-light">
                Drag and drop your slides here, or click to browse.<br/>
                <span className="text-xs opacity-50 uppercase tracking-widest mt-2 block">Max Size: 20MB</span>
              </p>
            </div>
          </>
        )}

        {error && (
          <div className="absolute -bottom-16 left-0 right-0 animate-slide-up">
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
