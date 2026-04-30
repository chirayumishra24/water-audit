"use client";

import React, { useState, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  Html,
  Grid,
  Float,
} from "@react-three/drei";
import { 
  Users, 
  Presentation, 
  MessageSquare, 
  Heart, 
  Brain, 
  Coins, 
  CheckCircle2, 
  RotateCcw,
  BarChart,
  ArrowRight,
  TrendingUp,
  Award,
  ChevronRight,
  Info,
  Sparkles,
  Target
} from "lucide-react";
import * as THREE from "three";

// --- 3D Components ---

function AudienceMember({ position, reaction }: { position: [number, number, number], reaction: 'happy' | 'neutral' | 'unhappy' }) {
  const color = reaction === 'happy' ? '#22c55e' : reaction === 'unhappy' ? '#ef4444' : '#94a3b8';
  
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.8, 16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 1, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
      </mesh>
      <Float speed={4} floatIntensity={0.2} rotationIntensity={0.1}>
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </Float>
    </group>
  );
}

function StageScene({ engagement, currentSlide }: { engagement: number, currentSlide: any }) {
  const reaction = engagement > 70 ? 'happy' : engagement < 40 ? 'unhappy' : 'neutral';
  
  return (
    <group position={[0, -1.5, 0]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial color="#f1f5f9" roughness={1} />
      </mesh>

      <Grid
        infiniteGrid
        fadeDistance={40}
        fadeStrength={5}
        cellSize={1}
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#3b82f6"
        cellColor="#e2e8f0"
      />
      
      {/* Podium */}
      <mesh castShadow position={[0, 0.6, 5]}>
        <boxGeometry args={[1.6, 1.2, 0.8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Screen */}
      <group position={[0, 4.5, 8]}>
        <mesh castShadow>
          <boxGeometry args={[10, 5.6, 0.2]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.1} />
        </mesh>
        <Html transform distanceFactor={6} position={[0, 0, 0.15]}>
          <div className="w-[1000px] h-[560px] bg-white p-20 flex flex-col items-center justify-center text-center rounded-[2rem] border-[10px] border-slate-900 overflow-hidden shadow-2xl">
            {currentSlide ? (
              <div className="animate-in fade-in zoom-in duration-500 w-full">
                <div className="flex items-center justify-center gap-6 mb-12">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                    {currentSlide.type === 'logic' ? <Brain className="w-10 h-10 text-white" /> : currentSlide.type === 'emotion' ? <Heart className="w-10 h-10 text-white" /> : <Coins className="w-10 h-10 text-white" />}
                  </div>
                  <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">{currentSlide.title}</h1>
                </div>
                <p className="text-4xl font-bold text-slate-500 leading-tight max-w-4xl mx-auto mb-16">{currentSlide.content}</p>
                <div className="flex items-center justify-center gap-20">
                  <div className="text-center">
                    <div className="text-8xl font-black text-blue-600 mb-4">{currentSlide.metric}</div>
                    <div className="text-2xl font-black text-slate-400 uppercase tracking-[0.3em]">{currentSlide.label}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-8 opacity-20">
                <Presentation className="w-48 h-48 text-slate-400" />
                <h1 className="text-5xl font-black text-slate-400 uppercase tracking-widest">System Ready</h1>
              </div>
            )}
          </div>
        </Html>
      </group>

      {/* Audience */}
      {Array.from({ length: 20 }).map((_, i) => (
        <AudienceMember 
          key={i} 
          position={[
            ((i % 5) - 2) * 2.5,
            0,
            -Math.floor(i / 5) * 2.5 + 2
          ]} 
          reaction={reaction}
        />
      ))}
    </group>
  );
}

// --- Main Activity ---

const SLIDES = [
  { id: 1, title: "Waste Analysis", content: "Our facility is currently losing 15,000L of filtered water every 24 hours.", metric: "15k L", label: "Daily Loss", type: 'logic', impact: { logic: 25, emotion: 5, budget: -5 } },
  { id: 2, title: "Smart Solution", content: "AI-driven sensors can detect micro-leaks and reduce waste by 65%.", metric: "65%", label: "Reduction", type: 'budget', impact: { logic: 10, emotion: 10, budget: 15 } },
  { id: 3, title: "Future Legacy", content: "Saving water today ensures a sustainable campus for the next generation.", metric: "2050", label: "Vision", type: 'emotion', impact: { logic: 5, emotion: 30, budget: 0 } },
  { id: 4, title: "Financial ROI", content: "The $12k investment will be fully recouped within 8 months of operation.", metric: "8 mo", label: "Payback", type: 'budget', impact: { logic: 15, emotion: 0, budget: 30 } }
];

export function TownHallSim() {
  const [selectedSlideIds, setSelectedSlideIds] = useState<number[]>([]);
  const [logic, setLogic] = useState(40);
  const [emotion, setEmotion] = useState(40);
  const [budget, setBudget] = useState(40);

  const engagement = useMemo(() => {
    return Math.min((logic + emotion + budget) / 1.8, 100);
  }, [logic, emotion, budget]);

  const handleSelect = (id: number) => {
    if (selectedSlideIds.includes(id)) return;
    if (selectedSlideIds.length >= 3) return;

    const slide = SLIDES.find(s => s.id === id);
    if (slide) {
      setSelectedSlideIds([...selectedSlideIds, id]);
      setLogic(prev => Math.min(prev + slide.impact.logic, 100));
      setEmotion(prev => Math.min(prev + slide.impact.emotion, 100));
      setBudget(prev => Math.min(prev + slide.impact.budget, 100));
    }
  };

  const reset = () => {
    setSelectedSlideIds([]);
    setLogic(40);
    setEmotion(40);
    setBudget(40);
  };

  const activeSlide = useMemo(() => 
    SLIDES.find(s => s.id === selectedSlideIds[selectedSlideIds.length - 1]), 
    [selectedSlideIds]
  );

  const isSuccess = selectedSlideIds.length === 3 && engagement > 75;

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[750px] bg-white rounded-[3.5rem] overflow-hidden border border-slate-200 shadow-2xl relative">
      {/* LEFT: 3D STAGE PANEL */}
      <div className="relative flex-1 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 overflow-hidden min-h-[450px]">
        <Canvas shadows className="w-full h-full">
          <PerspectiveCamera makeDefault position={[0, 8, 18]} fov={40} />
          <OrbitControls 
            enablePan={false} 
            minDistance={10} 
            maxDistance={25}
            maxPolarAngle={Math.PI / 2.2}
          />
          
          <ambientLight intensity={1.5} />
          <spotLight position={[0, 15, 10]} intensity={500} castShadow />
          <pointLight position={[0, 5, 10]} intensity={100} color="#3b82f6" />
          
          <Suspense fallback={null}>
            <StageScene engagement={engagement} currentSlide={activeSlide} />
            <Environment preset="city" />
            <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={25} blur={2.5} far={10} color="#000000" />
          </Suspense>
        </Canvas>

        {/* HUD Overlay */}
        <div className="absolute top-10 left-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Presentation className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Advocacy Simulation</span>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Town Hall Presentation</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 pointer-events-none">
          <div className="bg-blue-600/10 backdrop-blur-md px-6 py-3 rounded-full border border-blue-500/20 text-blue-500 flex items-center gap-3">
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Audience engagement: {engagement.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* RIGHT: STRATEGY PANEL */}
      <div className="w-full lg:w-[450px] bg-white flex flex-col p-12 gap-10 overflow-y-auto no-scrollbar">
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Deck Strategy</h3>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <Target className="w-5 h-5 text-slate-300" />
            </div>
          </div>

          {/* Gauges */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Logic", val: logic, icon: Brain, color: "bg-blue-600" },
              { label: "Emotion", val: emotion, icon: Heart, color: "bg-rose-500" },
              { label: "Budget", val: budget, icon: Coins, color: "bg-amber-500" }
            ].map((g) => (
              <div key={g.label} className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center gap-3">
                <div className={`p-2 rounded-xl bg-white shadow-sm`}>
                  <g.icon className={`w-4 h-4 ${g.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="h-16 w-1.5 bg-slate-200 rounded-full overflow-hidden relative">
                  <div 
                    className={`absolute bottom-0 w-full ${g.color} transition-all duration-700 ease-out`} 
                    style={{ height: `${g.val}%` }} 
                  />
                </div>
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{g.label}</span>
              </div>
            ))}
          </div>

          {/* Slide Selection */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Slides ({selectedSlideIds.length}/3)</span>
              {selectedSlideIds.length === 3 && (
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">Deck Complete</span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3">
              {SLIDES.map((slide) => {
                const isSelected = selectedSlideIds.includes(slide.id);
                return (
                  <button
                    key={slide.id}
                    onClick={() => handleSelect(slide.id)}
                    disabled={isSelected || selectedSlideIds.length >= 3}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                      isSelected 
                        ? "bg-slate-900 border-slate-900 text-white opacity-50" 
                        : selectedSlideIds.length >= 3
                          ? "bg-slate-50 border-slate-50 opacity-40 cursor-not-allowed"
                          : "bg-white border-slate-100 text-slate-600 hover:border-blue-400 hover:bg-blue-50/30 shadow-sm"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-white/10' : 'bg-slate-50'
                    }`}>
                      {slide.type === 'logic' ? <Brain className="w-5 h-5" /> : slide.type === 'emotion' ? <Heart className="w-5 h-5" /> : <Coins className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-xs font-black uppercase tracking-tight">{slide.title}</h4>
                      <p className="text-[10px] font-bold opacity-60 line-clamp-1">{slide.content}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Global Progress */}
        <div className="mt-auto space-y-6">
          <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest block mb-1">Engagement Meter</span>
                  <div className="text-4xl font-black tracking-tighter">{engagement.toFixed(0)}%</div>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Sparkles className="w-6 h-6 text-blue-200" />
                </div>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-1000 ease-out" 
                  style={{ width: `${engagement}%` }} 
                />
              </div>
              <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-blue-200">
                {engagement > 75 ? 'Committee is extremely impressed' : engagement > 50 ? 'Building momentum...' : 'Needs more impact'}
              </p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>

          <div className="flex gap-4">
            <button onClick={reset} className="flex-1 py-5 bg-white border border-slate-200 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-all flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button 
              disabled={selectedSlideIds.length < 3}
              className={`flex-[2] py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 ${
                selectedSlideIds.length < 3 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              Submit Proposal <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Success Overlay */}
      {isSuccess && (
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center p-12 z-50 animate-in fade-in zoom-in duration-700">
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto shadow-2xl border-4 border-white/20">
              <Award size={48} className="text-white" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase leading-none">Proposal Approved</h2>
            <p className="text-slate-400 mb-10 font-medium text-sm leading-relaxed">
              Congratulations! Your balanced approach successfully persuaded the committee. The funding for the water optimization project has been unlocked.
            </p>
            <div className="flex flex-col gap-4">
              <button className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl transition-all shadow-xl hover:bg-blue-700 active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-3">
                Claim Module Badge
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={reset}
                className="w-full py-5 bg-white/5 text-slate-400 font-black rounded-2xl transition-all hover:bg-white/10 text-xs uppercase tracking-widest"
              >
                Re-simulate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
