"use client";

import React from "react";

interface ExternalSimulationProps {
  url: string;
  title?: string;
  height?: string;
}

export function ExternalSimulation({ 
  url, 
  title = "Interactive Experience", 
  height = "600px" 
}: ExternalSimulationProps) {
  return (
    <div className="w-full bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-slate-800 my-8">
      <div className="bg-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {title}
        </span>
        <div className="w-12" />
      </div>
      <iframe
        src={url}
        title={title}
        width="100%"
        height={height}
        allowFullScreen
        className="bg-white"
      />
    </div>
  );
}
