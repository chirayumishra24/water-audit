"use client";

import React, { ReactNode, useState, Children } from 'react';
import { ChevronRight } from "lucide-react";

export function Conversation({ children }: { children: ReactNode }) {
  const childrenArray = Children.toArray(children);
  const [visibleCount, setVisibleCount] = useState(1);

  const showNext = () => {
    if (visibleCount < childrenArray.length) {
      setVisibleCount(prev => prev + 1);
    }
  };

  const isComplete = visibleCount === childrenArray.length;

  return (
    <div className="flex flex-col gap-8 my-16 w-full max-w-4xl mx-auto font-sans relative">
      <div className="flex flex-col gap-8">
        {childrenArray.slice(0, visibleCount)}
      </div>
      
      {!isComplete && (
        <div className="flex justify-center mt-4">
          <button 
            onClick={showNext}
            className="group flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-700 hover:shadow-2xl transition-all animate-bounce hover:animate-none"
          >
            Next <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}

const AVATARS: Record<string, { bg: string; icon: ReactNode; border: string }> = {
  "Mr. Sharma": { 
    bg: "bg-blue-500", 
    border: "border-blue-200", 
    icon: (
      <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="35" r="15" fill="#fde047" stroke="#ca8a04"/>
        <path d="M 25 80 C 25 55, 75 55, 75 80" fill="#3b82f6" stroke="#2563eb"/>
        <rect x="40" y="45" width="20" height="15" fill="#fde047" stroke="#ca8a04" />
        <path d="M 30 50 L 70 50" stroke="#ca8a04"/>
      </svg>
    )
  },
  "Aisha": { 
    bg: "bg-rose-500", 
    border: "border-rose-200", 
    icon: (
      <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="40" r="15" fill="#d97706" stroke="#92400e"/>
        <path d="M 35 25 C 20 20, 20 50, 35 55" fill="#1f2937" stroke="none" />
        <path d="M 65 25 C 80 20, 80 50, 65 55" fill="#1f2937" stroke="none" />
        <path d="M 30 85 C 30 65, 70 65, 70 85" fill="#e11d48" stroke="#be123c"/>
      </svg>
    )
  },
  "Rohan": { 
    bg: "bg-emerald-500", 
    border: "border-emerald-200", 
    icon: (
      <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="40" r="15" fill="#f59e0b" stroke="#b45309"/>
        <path d="M 35 25 Q 50 15 65 25 L 65 30 Q 50 20 35 30 Z" fill="#1f2937" stroke="none"/>
        <path d="M 30 85 C 30 65, 70 65, 70 85" fill="#10b981" stroke="#047857"/>
      </svg>
    )
  },
  "Kavya": { 
    bg: "bg-amber-500", 
    border: "border-amber-200", 
    icon: (
      <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="40" r="15" fill="#fcd34d" stroke="#d97706"/>
        <path d="M 35 25 Q 50 10 65 25" fill="none" stroke="#1f2937" strokeWidth="6"/>
        <path d="M 30 85 C 30 65, 70 65, 70 85" fill="#f59e0b" stroke="#d97706"/>
      </svg>
    )
  },
};

export function Message({ speaker, children }: { speaker: string; children: ReactNode }) {
  const isTeacher = speaker === "Mr. Sharma";
  const avatar = AVATARS[speaker] || { bg: "bg-slate-500", icon: <span role="img" aria-label={speaker}>👤</span>, border: "border-slate-200" };

  return (
    <div className={`flex gap-6 ${isTeacher ? 'flex-row' : 'flex-row-reverse'} items-start group animate-message`}>
      {/* Avatar with Ring */}
      <div className={`flex-shrink-0 w-16 h-16 rounded-3xl flex items-center justify-center border-4 shadow-xl text-3xl ${avatar.bg} ${avatar.border} transform group-hover:rotate-6 transition-transform duration-500`}>
        {avatar.icon}
      </div>
      
      {/* Message Content */}
      <div className={`flex-1 flex flex-col ${isTeacher ? 'items-start' : 'items-end'}`}>
        <span className="text-xs font-black text-slate-400 mb-2 px-3 uppercase tracking-[0.2em]">{speaker}</span>
        <div className={`px-8 py-6 rounded-[2rem] shadow-xl text-xl md:text-2xl leading-relaxed max-w-[85%] font-medium transition-all duration-300 [&_*]:text-inherit [&_p]:m-0 [&_strong]:text-inherit [&_em]:text-inherit
          ${isTeacher 
            ? 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm hover:shadow-2xl' 
            : 'bg-slate-900 text-white rounded-tr-sm hover:bg-slate-800 shadow-slate-200'}
        `}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function YoutubeEmbed({ url, title }: { url: string; title: string }) {
  let videoId = "";
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (match && match[1]) {
    videoId = match[1];
  } else {
    videoId = url.split('/').pop()?.split('?')[0] || '';
  }

  return (
    <div className="my-12 rounded-[2.5rem] overflow-hidden border border-white shadow-[0_30px_60px_rgba(0,0,0,0.12)] bg-slate-900 group">
      <div className="bg-slate-900/50 backdrop-blur-md p-4 text-xs font-black text-slate-400 border-b border-white/10 flex items-center gap-3 uppercase tracking-[0.2em]">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        {title}
      </div>
      <div className="relative aspect-video">
        <iframe 
          className="absolute inset-0 w-full h-full grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
