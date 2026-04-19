"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    onLoadSuccess?.(numPages);
  }

  const handlePageTransition = useCallback((newPage: number) => {
    if (newPage === currentPage) return;
    setDirection(newPage > currentPage ? 1 : -1);
    onPageChange?.(newPage);
  }, [currentPage, onPageChange]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Handle Fullscreen Exit (e.g. via ESC key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    if (!isHost) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        handlePageTransition(Math.min(numPages, currentPage + 1));
      } else if (e.key === "ArrowLeft") {
        handlePageTransition(Math.max(1, currentPage - 1));
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHost, currentPage, numPages, handlePageTransition, toggleFullscreen]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    }),
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col items-center w-full gap-6 transition-all duration-700 ${isFullscreen ? 'bg-[#050505] p-0 h-screen justify-center' : ''}`}
      onDoubleClick={isHost ? toggleFullscreen : undefined}
    >
      {/* Search / Slide Seeker (Host Only) */}
      {isHost && numPages > 0 && (
        <div className="w-full max-w-2xl flex items-center gap-4 px-6 group">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">Seek</span>
          <input
            type="range"
            min="1"
            max={numPages}
            value={currentPage}
            onChange={(e) => handlePageTransition(parseInt(e.target.value))}
            className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent-primary hover:accent-accent-secondary transition-all"
          />
          <span className="text-[10px] font-mono text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">End</span>
        </div>
      )}

      {/* Viewer Container */}
      <div className={`relative group flex justify-center overflow-hidden transition-all duration-500
        ${isFullscreen ? 'w-screen h-[calc(100vh-80px)]' : 'w-full glass rounded-[2.5rem] border border-white/5 shadow-2xl min-h-[500px]'}
      `}>
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center justify-center h-[500px] w-full gap-4">
              <Loader2 className="w-12 h-12 text-accent-primary animate-spin" />
              <p className="text-text-secondary font-display animate-pulse uppercase tracking-widest text-xs">Synchronizing Buffer...</p>
            </div>
          }
          error={
            <div className="flex items-center justify-center h-[500px] w-full text-red-500 font-display">
              Failed to load presentation.
            </div>
          }
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentPage}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="flex items-center justify-center w-full h-full p-4"
            >
              <Page 
                pageNumber={currentPage} 
                scale={isFullscreen ? (scale * 1.5) : scale}
                className="shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm"
                renderAnnotationLayer={false}
                renderTextLayer={true}
              />
            </motion.div>
          </AnimatePresence>
        </Document>

        {/* Floating Controls Overlay */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 glass border border-white/10 px-8 py-4 rounded-[2rem] transition-all duration-500 z-50
          ${isFullscreen ? 'bg-black/40 backdrop-blur-2xl border-white/20' : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'}
        `}>
          {isHost && (
            <>
              <button 
                onClick={() => handlePageTransition(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="p-3 hover:bg-white/10 rounded-2xl disabled:opacity-20 transition-all active:scale-95"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="h-8 w-[1px] bg-white/10" />
            </>
          )}

          <div className="flex flex-col items-center min-w-[100px]">
            <span className="text-sm font-display tracking-[0.3em] font-bold">
              {String(currentPage).padStart(2, '0')}
              <span className="opacity-30 mx-2 text-xs">/</span>
              {String(numPages || '--').padStart(2, '0')}
            </span>
          </div>

          {isHost && (
            <>
              <div className="h-8 w-[1px] bg-white/10" />
              
              <button 
                onClick={() => handlePageTransition(Math.min(numPages, currentPage + 1))}
                disabled={currentPage >= numPages}
                className="p-3 hover:bg-white/10 rounded-2xl disabled:opacity-20 transition-all active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="h-8 w-[1px] bg-white/10" />

          <button 
            onClick={toggleFullscreen}
            className="p-3 hover:bg-white/10 rounded-2xl transition-all active:scale-95"
            title="Toggle Presentation Mode (F)"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Floating Zoom & Info */}
      <div className={`flex items-center gap-4 bg-white/[0.03] border border-white/5 px-6 py-2.5 rounded-full transition-opacity duration-300
        ${isFullscreen ? 'opacity-0 hover:opacity-100' : 'opacity-40 hover:opacity-100'}
      `}>
        <div className="flex items-center gap-2">
          <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="w-8 h-8 rounded-lg hover:bg-white/10 transition-colors font-mono">-</button>
          <span className="text-[10px] font-mono w-14 text-center text-text-secondary">{Math.round(scale * 100)}% ZOOM</span>
          <button onClick={() => setScale(s => Math.min(2.5, s + 0.1))} className="w-8 h-8 rounded-lg hover:bg-white/10 transition-colors font-mono">+</button>
        </div>
        {!isFullscreen && (
          <>
            <div className="w-[1px] h-4 bg-white/10" />
            <span className="text-[10px] font-display text-text-secondary uppercase tracking-widest hidden md:block">Double Click to Present</span>
          </>
        )}
      </div>
    </div>
  );
}
