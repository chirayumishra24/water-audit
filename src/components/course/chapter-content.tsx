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
        <button 
          onClick={toggleFullscreen}
          className="bg-white/90 backdrop-blur-md p-2 rounded-full text-slate-800 shadow-sm hover:bg-white transition-colors border border-white"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Content Area - Center Aligned */}
      <div className="w-full max-w-[95vw] 2xl:max-w-[1320px] mx-auto pt-4 relative z-20 flex flex-col gap-10">
        
        {/* Top Section: Title & Aquaman */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 w-full mx-auto">
          {/* Left: Titles & Info */}
          <div className="flex-1 flex flex-col">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-600 mb-5 bg-white/70 backdrop-blur-md w-max px-4 py-2 rounded-2xl border border-white/50 shadow-sm">
              <span className="text-blue-600">Modules</span>
              <ChevronRight className="w-4 h-4" />
              <span>Water Audit</span>
              <ChevronRight className="w-4 h-4" />
              <span>Chapter {chapter.order}</span>
            </div>

            {/* Title with frosted background for readability */}
            <div className="bg-white/40 backdrop-blur-2xl p-6 md:p-7 rounded-[1.75rem] border border-white/60 shadow-lg mb-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-5">
                Welcome to <br />
                <span className="text-blue-600">{chapter.title}</span>
              </h1>
              
              {/* Summary Text (Fixed Legibility) */}
              <p className="text-base md:text-lg text-slate-800 font-semibold leading-relaxed bg-white/60 p-3.5 md:p-4 rounded-xl border border-white/50">
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
      <footer className="mt-16 w-full bg-white/95 backdrop-blur-xl px-6 md:px-12 py-5 border-t border-slate-200 flex items-center justify-between">
        <span className="font-extrabold text-slate-800 text-sm md:text-base">Water Audit | skillizee.io</span>
        <span className="font-bold text-slate-500 text-xs md:text-sm bg-slate-100 px-4 py-2 rounded-full">Chapter {chapter.order}</span>
      </footer>

    </article>
  );
}
