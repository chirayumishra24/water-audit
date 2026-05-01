"use client";

import React, { useState } from "react";
import { 
  Database, 
  Map as MapIcon, 
  Zap, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Layout,
  BarChart3,
  Globe,
  Users
} from "lucide-react";

const PATHS = [
  {
    id: "path-a",
    title: "Path A: Water Dashboard",
    description: "Build an interactive 'State of the Water' dashboard using real survey data.",
    icon: <BarChart3 className="text-blue-500" size={32} />,
    color: "blue",
    tools: ["Google Sheets", "Canva", "Looker Studio"],
    checkpoints: [
      "Dynamic charts for neighborhood use",
      "Leakage Calculator widget",
      "Standard Benchmarking"
    ]
  },
  {
    id: "path-b",
    title: "Path B: Source-to-Tap Map",
    description: "Create a digital map of the local water ecosystem with data overlays.",
    icon: <Globe className="text-emerald-500" size={32} />,
    color: "emerald",
    tools: ["Google My Maps", "StoryMaps", "ArcGIS"],
    checkpoints: [
      "Pins for treatment plants/pipes",
      "Groundwater depletion overlays",
      "Source tracking history"
    ]
  },
  {
    id: "path-c",
    title: "Path C: Social Nudge App",
    description: "Design a digital platform to nudge community behavior changes.",
    icon: <Users className="text-purple-500" size={32} />,
    color: "purple",
    tools: ["Adobe Express", "Figma", "Canva"],
    checkpoints: [
      "Behavioral nudge videos",
      "Water Hero Leaderboard",
      "Community Feedback loop"
    ]
  }
];

export function TechChallengePicker() {
  const [selectedPath, setSelectedPath] = useState(PATHS[0]);

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Path Selection */}
        <div className="lg:col-span-5 space-y-4">
          {PATHS.map((path) => (
            <button
              key={path.id}
              onClick={() => setSelectedPath(path)}
              className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all flex items-center gap-6 group relative overflow-hidden ${
                selectedPath.id === path.id
                  ? `bg-white border-${path.color}-500 shadow-xl shadow-${path.color}-500/10`
                  : "bg-slate-50 border-slate-100 opacity-60 hover:opacity-100 hover:bg-white"
              }`}
            >
              {selectedPath.id === path.id && (
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${path.color}-500/5 rounded-full -mr-16 -mt-16`} />
              )}
              
              <div className={`p-4 rounded-2xl bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform`}>
                {path.icon}
              </div>
              
              <div className="flex-1">
                <h3 className={`font-black tracking-tight ${selectedPath.id === path.id ? `text-${path.color}-900` : "text-slate-900"}`}>
                  {path.title}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Choose this Path
                </p>
              </div>

              <ChevronRight className={`transition-transform ${selectedPath.id === path.id ? "translate-x-1 text-slate-900" : "text-slate-300"}`} />
            </button>
          ))}
        </div>

        {/* Path Details Container */}
        <div className="lg:col-span-7 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col gap-8 relative overflow-hidden group">
          <div className={`absolute top-0 right-0 w-64 h-64 bg-${selectedPath.color}-500/5 rounded-full -mr-32 -mt-32 blur-3xl`} />
          
          <div className="flex flex-col gap-4 relative">
            <div className={`w-16 h-16 rounded-2xl bg-${selectedPath.color}-50 flex items-center justify-center`}>
              {selectedPath.icon}
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                {selectedPath.title}
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed max-w-md">
                {selectedPath.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Recommended Tools</h4>
              <div className="flex flex-wrap gap-2">
                {selectedPath.tools.map(tool => (
                  <span key={tool} className={`px-4 py-2 bg-slate-50 rounded-xl text-xs font-black text-slate-700 border border-slate-100`}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Project Checklist</h4>
              <div className="space-y-3">
                {selectedPath.checkpoints.map(check => (
                  <div key={check} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full bg-${selectedPath.color}-500 flex items-center justify-center`}>
                      <ChevronRight size={12} className="text-white" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{check}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between relative">
            <div className="flex items-center gap-4">
               <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                120+ Students submitted
              </p>
            </div>
            
            <button className={`h-14 px-8 bg-slate-900 text-white rounded-2xl font-black hover:bg-${selectedPath.color}-600 transition-all flex items-center gap-2 group/btn`}>
              Start This Path
              <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
