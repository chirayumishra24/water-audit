"use client";

import React, { useState, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  Html,
  useCursor,
  Float,
  Text,
  RoundedBox
} from "@react-three/drei";
import { 
  Calculator, 
  Beaker, 
  HardHat, 
  Megaphone, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw,
  Zap,
  Target,
  Users,
  Search,
  Droplets,
  Microscope,
  Construction,
  Award,
  ChevronRight,
  Info
} from "lucide-react";
import * as THREE from "three";

// --- 3D Components ---

function CareerOrb({ 
  id, 
  pos, 
  label, 
  color, 
  isActive, 
  isCompleted, 
  onClick 
}: { 
  id: string, 
  pos: [number, number, number], 
  label: string, 
  color: string, 
  isActive: boolean, 
  isCompleted: boolean, 
  onClick: () => void 
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <group 
      position={pos} 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      <Float speed={isActive ? 4 : 2} floatIntensity={isActive ? 1 : 0.5}>
        <mesh castShadow>
          <sphereGeometry args={[0.8, 64, 64]} />
          <meshStandardMaterial 
            color={color} 
            transparent 
            opacity={isActive ? 0.9 : hovered ? 0.7 : 0.4} 
            metalness={0.9} 
            roughness={0.1}
            emissive={color}
            emissiveIntensity={isActive ? 0.5 : hovered ? 0.2 : 0}
          />
        </mesh>
        
        {isActive && (
          <mesh scale={1.2}>
            <sphereGeometry args={[0.8, 64, 64]} />
            <meshStandardMaterial 
              color={color} 
              transparent 
              opacity={0.1} 
              wireframe
            />
          </mesh>
        )}

        <Html position={[0, -1.2, 0]} center distanceFactor={8}>
          <div className={`px-4 py-2 rounded-2xl bg-white/90 backdrop-blur-xl border-2 shadow-2xl transition-all duration-500 whitespace-nowrap flex items-center gap-3 ${
            isActive ? 'border-blue-600 scale-125' : 'border-white hover:scale-110'
          }`}>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive ? 'text-blue-600' : 'text-slate-600'}`}>
              {label}
            </span>
            {isCompleted && (
              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </Html>
      </Float>
    </group>
  );
}

// --- Main Activity ---

const CAREERS = [
  { 
    id: 'auditor', 
    label: 'Water Auditor', 
    icon: Search, 
    color: '#3b82f6', 
    mission: 'Identify and quantify leaks across facility systems.',
    skills: ['Data Analysis', 'Site Inspection', 'Mass Balance'],
    description: 'The front-line detective of water conservation.'
  },
  { 
    id: 'scientist', 
    label: 'Lab Scientist', 
    icon: Microscope, 
    color: '#0ea5e9', 
    mission: 'Test and certify water quality for reuse and discharge.',
    skills: ['Chemistry', 'Sampling', 'Regulatory Standards'],
    description: 'Ensuring every drop meets the highest safety standards.'
  },
  { 
    id: 'engineer', 
    label: 'Systems Engineer', 
    icon: Construction, 
    color: '#6366f1', 
    mission: 'Design and optimize filtration and recovery loops.',
    skills: ['Process Design', 'Pump Dynamics', 'Heat Transfer'],
    description: 'Architecting the closed-loop systems of the future.'
  },
  { 
    id: 'advocate', 
    label: 'Policy Advocate', 
    icon: Megaphone, 
    color: '#8b5cf6', 
    mission: 'Influence legislation and community water standards.',
    skills: ['Communication', 'Legislation', 'Public Engagement'],
    description: 'Driving the cultural shift toward water stewardship.'
  }
];

export function CareerExploration() {
  const [activePortal, setActivePortal] = useState<string | null>(null);
  const [completedPortals, setCompletedPortals] = useState<string[]>([]);
  
  const handlePortalClick = (id: string) => {
    setActivePortal(id);
    if (!completedPortals.includes(id)) {
      setTimeout(() => {
        setCompletedPortals(prev => [...prev, id]);
      }, 3000);
    }
  };

  const reset = () => {
    setActivePortal(null);
    setCompletedPortals([]);
  };

  const activeCareer = useMemo(() => CAREERS.find(c => c.id === activePortal), [activePortal]);
  const isComplete = completedPortals.length === CAREERS.length;

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[750px] bg-white rounded-[3.5rem] overflow-hidden border border-slate-200 shadow-2xl relative">
      {/* LEFT: 3D GALAXY PANEL */}
      <div className="relative flex-1 bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-900 overflow-hidden min-h-[450px]">
        {/* Galaxy Starry Background */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <Canvas shadows className="w-full h-full">
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
          <OrbitControls enablePan={false} minDistance={6} maxDistance={15} />
          
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={500} color="#3b82f6" />
          
          <Suspense fallback={null}>
            <group position={[0, 0, 0]}>
              {CAREERS.map((c, i) => {
                const angle = (i / CAREERS.length) * Math.PI * 2;
                return (
                  <CareerOrb 
                    key={c.id}
                    id={c.id}
                    pos={[Math.cos(angle) * 4, Math.sin(angle) * 4, 0]}
                    label={c.label}
                    color={c.color}
                    isActive={activePortal === c.id}
                    isCompleted={completedPortals.includes(c.id)}
                    onClick={() => handlePortalClick(c.id)}
                  />
                );
              })}
            </group>
            <Environment preset="night" />
          </Suspense>
          <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={20} blur={2.5} far={10} color="#000000" />
        </Canvas>

        {/* HUD Overlay */}
        <div className="absolute top-10 left-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Gateway</span>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Career Galaxy</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 pointer-events-none">
          <div className="bg-blue-600/10 backdrop-blur-md px-6 py-3 rounded-full border border-blue-500/20 text-blue-400 flex items-center gap-3">
            <Zap className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Select a planet to investigate a career path</span>
          </div>
        </div>
      </div>

      {/* RIGHT: CAREER PROFILE PANEL */}
      <div className="w-full lg:w-[450px] bg-white flex flex-col p-12 gap-10 overflow-y-auto no-scrollbar">
        {!activePortal ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-4 border-dashed border-slate-50 rounded-[3rem]">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-300 uppercase tracking-tighter mb-2">Awaiting Selection</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              Explore the professional landscape by selecting a career orb in the galaxy view.
            </p>
          </div>
        ) : (
          <div className="flex-1 space-y-10 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{activeCareer?.label}</h3>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-2 block">Professional Profile</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-3xl" style={{ color: activeCareer?.color }}>
                  {activeCareer && React.createElement(activeCareer.icon, { size: 32 })}
                </div>
              </div>
              <p className="text-sm font-bold text-slate-500 leading-relaxed italic">
                "{activeCareer?.description}"
              </p>
            </div>

            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Core Mission</span>
                <p className="text-lg font-black tracking-tight leading-tight mb-8">
                  {activeCareer?.mission}
                </p>
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">Required Expertise</span>
                  <div className="flex flex-wrap gap-2">
                    {activeCareer?.skills.map(s => (
                      <span key={s} className="px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Training Progress</span>
                {completedPortals.includes(activePortal) ? (
                  <span className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase">
                    <CheckCircle2 size={14} /> Completed
                  </span>
                ) : (
                  <span className="text-blue-600 text-[10px] font-black uppercase animate-pulse">Syncing Mission...</span>
                )}
              </div>
              <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-200">
                <div 
                  className={`h-full transition-all duration-[3000ms] ${completedPortals.includes(activePortal) ? 'bg-emerald-500 w-full' : 'bg-blue-600 w-2/3'}`} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Global Progress */}
        <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Knowledge Map</span>
            <div className="text-2xl font-black text-slate-900 tracking-tighter">{completedPortals.length}/{CAREERS.length} <span className="text-xs uppercase text-slate-400">Portals</span></div>
          </div>
          <button onClick={reset} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Completion Overlay */}
      {isComplete && (
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center p-12 z-50 animate-in fade-in zoom-in duration-700">
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto shadow-2xl border-4 border-white/20">
              <Award size={48} className="text-white" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Journey Mastered</h2>
            <p className="text-slate-400 mb-10 font-medium text-sm leading-relaxed">
              You've explored the entire professional spectrum of water stewardship. You are now ready to claim your certification.
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={reset}
                className="w-full py-5 bg-white text-slate-900 font-black rounded-2xl transition-all shadow-xl hover:scale-105 active:scale-95 text-xs uppercase tracking-widest"
              >
                Revisit Career Galaxy
              </button>
              <button className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl transition-all shadow-xl hover:bg-blue-700 active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-3">
                Final Assessment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
