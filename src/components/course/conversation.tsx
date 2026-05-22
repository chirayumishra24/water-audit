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
    bg: "bg-blue-600", 
    border: "border-blue-400/30", 
    icon: <img src="/images/characters/mr_sharma.png" alt="Mr. Sharma" className="w-full h-full object-cover" />
  },
  "Aisha": { 
    bg: "bg-rose-600", 
    border: "border-rose-400/30", 
    icon: <img src="/images/characters/aisha.png" alt="Aisha" className="w-full h-full object-cover" />
  },
  "Rohan": { 
    bg: "bg-emerald-600", 
    border: "border-emerald-400/30", 
    icon: <img src="/images/characters/rohan.png" alt="Rohan" className="w-full h-full object-cover" />
  },
  "Kavya": { 
    bg: "bg-amber-600", 
    border: "border-amber-400/30", 
    icon: <img src="/images/characters/kavya.png" alt="Kavya" className="w-full h-full object-cover" />
  },
};

export function Message({ speaker, children }: { speaker: string; children: ReactNode }) {
  const isTeacher = speaker === "Mr. Sharma";
  const avatar = AVATARS[speaker] || { bg: "bg-slate-500", icon: <span role="img" aria-label={speaker}>👤</span>, border: "border-slate-200" };

  return (
    <div className={`flex gap-6 ${isTeacher ? 'flex-row' : 'flex-row-reverse'} items-start group animate-message`}>
      {/* Avatar with Ring */}
      <div className={`flex-shrink-0 w-20 h-20 rounded-[2rem] flex items-center justify-center border-4 shadow-2xl overflow-hidden ${avatar.bg} ${avatar.border} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
        {avatar.icon}
      </div>
      
      {/* Message Content */}
      <div className={`flex-1 flex flex-col ${isTeacher ? 'items-start' : 'items-end'}`}>
        <span className="text-xs font-black text-slate-400 mb-2 px-3 uppercase tracking-[0.2em]">{speaker}</span>
        <div className={`px-8 py-6 rounded-[2rem] shadow-xl text-xl md:text-2xl leading-relaxed max-w-[85%] font-medium transition-all duration-300 [&_*]:text-inherit [&_p]:m-0 [&_strong]:text-inherit [&_em]:text-inherit
          ${isTeacher 
            ? 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm hover:shadow-2xl' 
            : 'bg-slate-900 text-slate-700 rounded-tr-sm hover:bg-slate-800 shadow-slate-200'}
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
