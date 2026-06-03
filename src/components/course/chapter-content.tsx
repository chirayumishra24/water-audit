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

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
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
      {/* Scroll Progress Bar */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 h-[33vh] w-2.5 bg-slate-900/10 backdrop-blur-md rounded-full border border-white/40 shadow-inner z-[100] no-print">
        <div 
          className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#2156da] to-blue-400 rounded-full shadow-[0_0_10px_rgba(33,86,218,0.3)] transition-all duration-75 ease-out"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>
      
      {/* Floating Action Buttons */}
      <div className="fixed top-6 right-6 flex flex-col gap-4 z-[100] no-print">
        <button 
          onClick={toggleFullscreen}
          className="bg-slate-900/80 backdrop-blur-xl p-4 rounded-full text-white shadow-2xl hover:bg-slate-900 hover:scale-110 active:scale-95 transition-all border border-white/20 group"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? (
            <Minimize2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          ) : (
            <Maximize2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          )}
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
            <div className="bg-slate-900/60 backdrop-blur-2xl p-6 md:p-7 rounded-[1.75rem] border border-white/10 shadow-2xl mb-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.08] tracking-tight mb-5">
                Welcome to <br />
                <span className="text-blue-400">{chapter.title}</span>
              </h1>
              
              {/* Summary Text (Fixed Legibility) */}
              <div className="text-base md:text-lg text-slate-200 font-semibold leading-relaxed bg-white/5 p-3.5 md:p-4 rounded-xl border border-white/10">
                {chapter.summary}
              </div>
            </div>

          </div>

          {/* Right: Aquaman Helper */}
          <div className="w-full lg:w-80 shrink-0">
            <AquamanHelper title={chapter.title} />
          </div>
        </div>


        {/* Bottom Section: Main Course Content (No main card wrapper, relies on TopicCards) */}
        <div className="relative z-10 w-full mx-auto">
          <div className="prose-course max-w-none prose-lg md:prose-xl text-slate-300 w-full bg-slate-200/40 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl">
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
