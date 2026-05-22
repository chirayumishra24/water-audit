"use client";

import React, { useRef, useState, useEffect } from "react";
import { Maximize2, Minimize2, ExternalLink, Loader2 } from "lucide-react";

export function WaterHeroChallenge() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error("Exit fullscreen error:", err);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-6 my-8">
      {/* 16:9 Frame Wrapper */}
      <div 
        ref={containerRef}
        className={`w-full aspect-video rounded-[2rem] overflow-hidden border border-slate-700 bg-slate-950 relative shadow-2xl transition-all duration-300 ${
          isFullscreen ? "border-0 rounded-none w-screen h-screen aspect-auto" : ""
        }`}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-20 gap-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-slate-400 font-bold tracking-widest text-xs uppercase animate-pulse">
              Loading Water Hero Challenge...
            </p>
          </div>
        )}

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="p-3 bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md rounded-full text-white/95 border border-white/10 hover:border-white/20 hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>

          {/* External Link Button */}
          <a
            href="https://water-hero-saver.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open in new tab"
            className="p-3 bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md rounded-full text-white/95 border border-white/10 hover:border-white/20 hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>

        {/* The Simulator Iframe */}
        <iframe
          src="https://water-hero-saver.lovable.app"
          title="Water Hero Challenge – Experiential Activity"
          width="100%"
          height="100%"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          className="border-none w-full h-full bg-slate-950"
        />
      </div>

      {/* Submission instruction box */}
      <div className="bg-emerald-950/40 border-l-4 border-emerald-500 rounded-r-3xl p-6 md:p-8 shadow-xl backdrop-blur-xl border border-white/5">
        <h3 className="text-xl md:text-2xl font-black text-emerald-400 mb-3 tracking-tight">
          Important Next Step
        </h3>
        <p className="text-slate-300 font-medium text-base md:text-lg mb-4">
          After completing the activity:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-slate-300 font-medium text-sm md:text-base mb-4">
          <li>Download your final <strong className="text-white">Water Hero Certificate PDF</strong> from the app.</li>
          <li>Submit the downloaded PDF (or screenshot/link) back to the LMS.</li>
        </ol>
        <div className="text-emerald-300/80 font-bold text-xs uppercase tracking-widest">
          Your teacher will review it and mark your completion.
        </div>
      </div>
    </div>
  );
}
