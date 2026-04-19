"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Loader2 } from "lucide-react";

// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
  currentPage: number;
  onPageChange?: (page: number) => void;
  onLoadSuccess?: (numPages: number) => void;
  isHost?: boolean;
}

export default function PDFViewer({
  fileUrl,
  currentPage,
  onPageChange,
  onLoadSuccess,
  isHost = false,
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.2);
  const [isFullscreen, setIsFullscreen] = useState(false);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    onLoadSuccess?.(numPages);
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className={`flex flex-col items-center w-full gap-4 transition-all duration-500 ${isFullscreen ? 'bg-black p-8' : ''}`}>
      {/* Viewer Container */}
      <div className="relative group w-full flex justify-center glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center justify-center h-[500px] w-full gap-4">
              <Loader2 className="w-12 h-12 text-accent-primary animate-spin" />
              <p className="text-text-secondary font-display animate-pulse">Loading Presentation...</p>
            </div>
          }
          error={
            <div className="flex items-center justify-center h-[500px] w-full text-red-400">
              Failed to load PDF. Please check the URL.
            </div>
          }
        >
          <Page 
            pageNumber={currentPage} 
            scale={scale}
            className="shadow-xl"
            renderAnnotationLayer={false}
            renderTextLayer={true}
          />
        </Document>

        {/* Overlay Controls (Host Only or Hover) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {isHost && (
            <>
              <button 
                onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="p-2 hover:bg-white/10 rounded-xl disabled:opacity-30 transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="h-6 w-[1px] bg-white/10 mx-2" />
            </>
          )}

          <span className="text-sm font-mono tracking-widest min-w-[80px] text-center">
            {currentPage} <span className="opacity-40">/</span> {numPages || '--'}
          </span>

          {isHost && (
            <>
              <div className="h-6 w-[1px] bg-white/10 mx-2" />
              
              <button 
                onClick={() => onPageChange?.(Math.min(numPages, currentPage + 1))}
                disabled={currentPage >= numPages}
                className="p-2 hover:bg-white/10 rounded-xl disabled:opacity-30 transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="h-6 w-[1px] bg-white/10 mx-2" />

          <button 
            onClick={toggleFullscreen}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Floating Zoom Controls */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full opacity-60 hover:opacity-100 transition-opacity">
        <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="px-2 font-mono hover:text-accent-primary">-</button>
        <span className="text-xs font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale(s => Math.min(2.5, s + 0.1))} className="px-2 font-mono hover:text-accent-primary">+</button>
      </div>
    </div>
  );
}
