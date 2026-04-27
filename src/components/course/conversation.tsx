import React, { ReactNode } from 'react';

export function Conversation({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6 my-10 max-w-3xl mx-auto font-sans">
      {children}
    </div>
  );
}

const AVATARS: Record<string, { bg: string; icon: string }> = {
  "Mr. Sharma": { bg: "bg-blue-100 border-blue-300", icon: "👨‍🏫" },
  "Aisha": { bg: "bg-pink-100 border-pink-300", icon: "👧🏽" },
  "Rohan": { bg: "bg-green-100 border-green-300", icon: "👦🏽" },
  "Kavya": { bg: "bg-yellow-100 border-yellow-300", icon: "👧🏻" },
};

export function Message({ speaker, children }: { speaker: string; children: ReactNode }) {
  const isTeacher = speaker === "Mr. Sharma";
  const avatar = AVATARS[speaker] || { bg: "bg-gray-100 border-gray-300", icon: "👤" };

  return (
    <div className={`flex gap-4 ${isTeacher ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-sm text-3xl ${avatar.bg}`}>
        <span role="img" aria-label={speaker}>{avatar.icon}</span>
      </div>
      <div className={`flex-1 flex flex-col ${isTeacher ? 'items-start' : 'items-end'}`}>
        <span className="text-sm font-bold text-slate-500 mb-1 px-2 uppercase tracking-wider">{speaker}</span>
        <div className={`px-6 py-4 rounded-2xl shadow-sm text-slate-800 leading-relaxed max-w-[90%] text-base
          ${isTeacher ? 'bg-white border-2 border-blue-100 rounded-tl-sm' : 'bg-slate-50 border-2 border-slate-200 rounded-tr-sm text-right'}
        `}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function YoutubeEmbed({ url, title }: { url: string; title: string }) {
  // Extract video ID from e.g. https://youtu.be/TVBh9BuKP98
  const videoId = url.split('/').pop();
  return (
    <div className="my-6 rounded-2xl overflow-hidden border-4 border-slate-200 shadow-md">
      <div className="bg-slate-100 p-3 text-sm font-semibold text-slate-600 border-b-2 border-slate-200">
        🎥 {title}
      </div>
      <div className="relative aspect-video">
        <iframe 
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
