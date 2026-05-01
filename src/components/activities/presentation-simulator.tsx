"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Video, 
  Mic, 
  Play, 
  Square, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Timer,
  Layout,
  Presentation,
  Share2,
  Trophy,
  ArrowRight
} from "lucide-react";

const CHECKLIST = [
  { id: "hook", label: "Strong Data Hook", tip: "Did you mention the Olympic pool analogy?" },
  { id: "gap", label: "Explain Data Gap", tip: "Show the difference in perceptions vs reality." },
  { id: "demo", label: "Tech Demo", tip: "Screen-share your dashboard or map." },
  { id: "math", label: "Savings Math", tip: "Show the projected Cubic Meters saved." },
  { id: "vision", label: "Scale & Vision", tip: "How will this grow in the future?" },
];

export function PresentationSimulator() {
  const [isPracticing, setIsPracticing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPracticing && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleStop();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPracticing, timeLeft]);

  const handleStart = () => {
    setIsPracticing(true);
    setIsFinished(false);
    setTimeLeft(180);
    setCompletedSteps([]);
  };

  const handleStop = () => {
    setIsPracticing(false);
    setIsFinished(true);
  };

  const toggleStep = (id: string) => {
    setCompletedSteps(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        
        {/* Virtual Presentation Stage */}
        <div className="lg:col-span-8 bg-slate-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-slate-800 flex flex-col items-center justify-center p-12">
          
          {/* Mock Video Feed */}
          <div className="w-full aspect-video bg-slate-800 rounded-3xl border border-slate-700 flex flex-col items-center justify-center relative group overflow-hidden">
            {isPracticing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse mb-4">
                  <Mic className="text-blue-400" size={40} />
                </div>
                <p className="text-blue-400 font-black tracking-widest animate-bounce">RECORDING LIVE...</p>
                <div className="absolute top-6 left-6 flex items-center gap-2 bg-rose-600 px-3 py-1 rounded-full border border-rose-500 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-white" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">ON AIR</span>
                </div>
              </div>
            ) : isFinished ? (
              <div className="flex flex-col items-center gap-4 text-center p-8">
                <div className="p-6 bg-emerald-500/20 rounded-full border border-emerald-500/30 mb-2">
                  <Trophy className="text-emerald-400" size={48} />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">Practice Complete!</h3>
                <p className="text-slate-400 text-sm max-w-xs">You covered {completedSteps.length} of {CHECKLIST.length} key points in {formatTime(180 - timeLeft)}.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="p-8 bg-slate-700/50 rounded-full border border-slate-600/50">
                  <Video className="text-slate-400" size={56} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white tracking-tight">Ready to Pitch?</h3>
                  <p className="text-slate-500 text-sm max-w-xs">Practice your 3-minute pitch before recording your final submission.</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center gap-4">
            {!isPracticing ? (
              <button 
                onClick={handleStart}
                className="h-16 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-600/20 flex items-center gap-3 active:scale-95"
              >
                <Play size={20} fill="currentColor" />
                START PRACTICE
              </button>
            ) : (
              <button 
                onClick={handleStop}
                className="h-16 px-10 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-rose-600/20 flex items-center gap-3 active:scale-95"
              >
                <Square size={20} fill="currentColor" />
                STOP & REVIEW
              </button>
            )}
            <button 
              onClick={() => { setTimeLeft(180); setIsPracticing(false); setIsFinished(false); }}
              className="w-16 h-16 bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center rounded-2xl border border-slate-700 transition-all"
            >
              <RotateCcw size={20} />
            </button>
          </div>

          {/* Time Display */}
          <div className="absolute top-8 right-8 bg-slate-800/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-700 flex items-center gap-3">
            <Timer className={timeLeft < 30 ? "text-rose-500" : "text-blue-400"} size={20} />
            <span className={`text-2xl font-black tabular-nums ${timeLeft < 30 ? "text-rose-500 animate-pulse" : "text-white"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Pitch Checklist */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                <Presentation size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Pitch Checklist</h3>
            </div>

            <div className="space-y-3">
              {CHECKLIST.map((step) => (
                <button
                  key={step.id}
                  disabled={!isPracticing}
                  onClick={() => toggleStep(step.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                    completedSteps.includes(step.id)
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-slate-50 border-slate-100 opacity-60"
                  } ${isPracticing ? "opacity-100 cursor-pointer" : "cursor-default"}`}
                >
                  <div className={`mt-1 flex-shrink-0 ${completedSteps.includes(step.id) ? "text-emerald-500" : "text-slate-300"}`}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-black tracking-tight ${completedSteps.includes(step.id) ? "text-emerald-900" : "text-slate-500"}`}>
                      {step.label}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-wider">{step.tip}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-600 rounded-2xl">
                <Share2 size={24} />
              </div>
              <div>
                <h4 className="font-black text-white uppercase tracking-tight">Final Step</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Submit Pitch & Deck</p>
              </div>
            </div>
            <button className="w-full h-14 bg-white text-slate-900 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 group">
              Submit Final Project
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
