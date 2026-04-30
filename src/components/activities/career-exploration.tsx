"use client";

import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  Html,
  useCursor,
  Grid,
  Float,
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
  Construction
} from "lucide-react";

// --- 3D Components ---

function CareerPortal({ 
  id, 
  pos, 
  icon: Icon, 
  label, 
  color, 
  isActive, 
  isCompleted, 
  onClick 
}: { 
  id: string, 
  pos: [number, number, number], 
  icon: any, 
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
      <Float speed={2} floatIntensity={0.5} rotationIntensity={0.5}>
        <mesh castShadow>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial 
            color={color} 
            transparent 
            opacity={isActive ? 0.8 : hovered ? 0.6 : 0.4} 
            metalness={0.8} 
            roughness={0.1} 
          />
        </mesh>
        <group position={[0, 0, 0.5]}>
          <Html center distanceFactor={4}>
            <div className={`p-4 rounded-2xl bg-white/90 backdrop-blur-xl border-2 shadow-2xl transition-all duration-300 flex flex-col items-center gap-2 ${
              isActive ? 'border-blue-600 scale-110' : 'border-white hover:scale-105'
            }`}>
              <Icon className={`w-8 h-8 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${isActive ? 'text-blue-600' : 'text-slate-600'}`}>
                {label}
              </span>
              {isCompleted && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </Html>
        </group>
      </Float>
    </group>
  );
}

// --- Main Activity ---

export function CareerExploration() {
  const [activePortal, setActivePortal] = useState<string | null>(null);
  const [completedPortals, setCompletedPortals] = useState<string[]>([]);
  
  const careers = [
    { id: 'auditor', label: 'Water Auditor', icon: Search, color: '#2563eb', mission: 'Inspect the facility floorplan for leaks.' },
    { id: 'scientist', label: 'Lab Scientist', icon: Microscope, color: '#0ea5e9', mission: 'Test water samples for contaminants.' },
    { id: 'engineer', label: 'Systems Engineer', icon: Construction, color: '#6366f1', mission: 'Design a high-efficiency filtration loop.' },
    { id: 'advocate', label: 'Policy Advocate', icon: Megaphone, color: '#8b5cf6', mission: 'Draft a municipal water conservation act.' }
  ];

  const handlePortalClick = (id: string) => {
    setActivePortal(id);
    // Simulating a mini-mission completion
    setTimeout(() => {
      if (!completedPortals.includes(id)) {
        setCompletedPortals([...completedPortals, id]);
      }
    }, 2000);
  };

  const reset = () => {
    setActivePortal(null);
    setCompletedPortals([]);
  };

  return (
    <div className="relative w-full h-[600px] bg-[#f8fafc] rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
      <Canvas shadows className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <OrbitControls 
          enablePan={false} 
          minDistance={5} 
          maxDistance={15}
        />
        
        <ambientLight intensity={1.5} />
        <pointLight position={[5, 5, 5]} intensity={100} color="#3b82f6" />
        
        <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
            {careers.map((c, i) => {
              const angle = (i / careers.length) * Math.PI * 2;
              return (
                <CareerPortal 
                  key={c.id}
                  id={c.id}
                  pos={[Math.cos(angle) * 4, Math.sin(angle) * 4, 0]}
                  icon={c.icon}
                  label={c.label}
                  color={c.color}
                  isActive={activePortal === c.id}
                  isCompleted={completedPortals.includes(c.id)}
                  onClick={() => handlePortalClick(c.id)}
                />
              );
            })}
          </group>
          <Environment preset="studio" />
          <Grid
            infiniteGrid
            fadeDistance={30}
            fadeStrength={3}
            cellSize={1}
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#2563eb"
            cellColor="#94a3b8"
            position={[0, -5, 0]}
          />
        </Suspense>
      </Canvas>

      {/* TOP HUD: CAREER PROFILE */}
      <div className="absolute top-6 left-6 right-6 flex items-start justify-between pointer-events-none">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-2xl pointer-events-auto max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tighter">Career Exploration</h2>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                Gateway to Professionalism
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Skill Radar</span>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-600 uppercase">Analytical</span>
              <div className="h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${(completedPortals.length / 4) * 100}%` }} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-600 uppercase">Leadership</span>
              <div className="h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${completedPortals.includes('advocate') ? 100 : 20}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-2xl pointer-events-auto w-48 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Missions Complete</span>
          <div className="text-4xl font-black text-blue-600">
            {completedPortals.length}
            <span className="text-xs ml-1 font-bold text-slate-400">/ 4</span>
          </div>
          <div className="mt-2 flex gap-1 justify-center">
            {careers.map((c) => (
              <div 
                key={c.id} 
                className={`w-2 h-2 rounded-full ${completedPortals.includes(c.id) ? 'bg-blue-600' : 'bg-slate-200'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM HUD: MISSION CARD */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl">
        <div className="bg-white/80 backdrop-blur-xl px-10 py-8 rounded-[3rem] border border-white shadow-2xl flex items-center gap-8">
          {activePortal ? (
            <>
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                {React.createElement(careers.find(c => c.id === activePortal)?.icon || Search, { className: "w-8 h-8 text-blue-600" })}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                  {careers.find(c => c.id === activePortal)?.label}
                </h3>
                <p className="text-xs font-medium text-slate-500 italic mt-1 leading-relaxed">
                  "{careers.find(c => c.id === activePortal)?.mission}"
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 animate-pulse" style={{ width: '60%' }} />
                  </div>
                  <span className="text-[8px] font-bold text-blue-600 uppercase">Synchronizing...</span>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-center gap-4 text-slate-400 italic font-medium">
              <Zap className="w-5 h-5 animate-pulse" />
              <span>Select a career portal to explore its day-to-day impact.</span>
            </div>
          )}
        </div>
      </div>

      {completedPortals.length === 4 && (
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-3xl flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl mb-8 border-4 border-white/20">
            <Users className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Water Hero Journey Complete</h2>
          <p className="text-slate-300 text-lg max-w-lg mb-8 leading-relaxed">
            You've explored the diverse roles required to secure our water future. From auditing to advocacy, every skill counts toward sustainability.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={reset}
              className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all active:scale-95 shadow-xl flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Re-explore Gateway
            </button>
            <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-2xl shadow-blue-500/40 flex items-center gap-2">
              Get Certification <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
