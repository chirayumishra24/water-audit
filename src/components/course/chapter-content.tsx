'use client';

import Link from "next/link";
import { Maximize2, Minimize2, ChevronRight } from "lucide-react";
import type { ChapterPageData } from "@/lib/course/types";
import { AquamanHelper } from "@/components/course/aquaman-helper";
import { useState, useEffect } from "react";

type ChapterContentProps = {
  chapter: ChapterPageData;
};

export function ChapterContent({ chapter }: ChapterContentProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(console.error);
    } else {
      await document.exitFullscreen().catch(console.error);
    }
  };

  return (
    <article className="relative min-h-screen">
      
      {/* Top right buttons (Motion, Expand) */}
      <div className="absolute -top-4 right-0 flex gap-3 z-50 hidden md:flex">
        <button className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-slate-800 shadow-sm hover:bg-white transition-colors border border-white">
          Motion: Full
        </button>
        <button 
          onClick={toggleFullscreen}
          className="bg-white/90 backdrop-blur-md p-2 rounded-full text-slate-800 shadow-sm hover:bg-white transition-colors border border-white"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Content Area - Center Aligned */}
      <div className="w-full max-w-[95vw] 2xl:max-w-[1400px] mx-auto pt-4 relative z-20 flex flex-col gap-12">
        
        {/* Top Section: Title & Aquaman */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 w-full mx-auto">
          {/* Left: Titles & Info */}
          <div className="flex-1 flex flex-col">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-6 bg-white/70 backdrop-blur-md w-max px-5 py-2.5 rounded-2xl border border-white/50 shadow-sm">
              <span className="text-blue-600">Modules</span>
              <ChevronRight className="w-4 h-4" />
              <span>Water Audit</span>
              <ChevronRight className="w-4 h-4" />
              <span>Chapter {chapter.order}</span>
            </div>

            {/* Title with frosted background for readability */}
            <div className="bg-white/40 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/60 shadow-lg mb-8">
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
                Welcome to <br />
                <span className="text-blue-600">{chapter.title}</span>
              </h1>
              
              {/* Summary Text (Fixed Legibility) */}
              <p className="text-lg md:text-xl text-slate-800 font-semibold leading-relaxed bg-white/60 p-4 rounded-xl border border-white/50">
                {chapter.summary}
              </p>
            </div>

          </div>

          {/* Right: Aquaman Helper */}
          <div className="w-full lg:w-80 shrink-0">
            <AquamanHelper title={chapter.title} />
          </div>
        </div>


        {/* Bottom Section: Main Course Content (No main card wrapper, relies on TopicCards) */}
        <div className="relative z-10 w-full mx-auto">
          <div className="prose-course max-w-none prose-lg md:prose-xl text-slate-800 w-full">
            {chapter.content}
          </div>
        </div>
      </div>

      {/* Bottom Docked Footer */}
      <footer className="mt-20 w-full bg-white/95 backdrop-blur-xl px-6 md:px-12 py-6 border-t border-slate-200 flex items-center justify-between">
        <span className="font-extrabold text-slate-800 text-base md:text-lg">Water Audit | skillizee.io</span>
        <span className="font-bold text-slate-500 text-sm md:text-base bg-slate-100 px-4 py-2 rounded-full">Chapter {chapter.order}</span>
      </footer>

    </article>
  );
}
