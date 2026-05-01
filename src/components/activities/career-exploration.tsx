"use client";

import React, { useState, Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  Html,
  useCursor,
  Float,
  Stars,
  Sparkles,
  Text,
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
  Info,
  Globe
} from "lucide-react";
import * as THREE from "three";
import { useRouter } from "next/navigation";

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
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z += 0.005;
      if (isActive) {
        const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        meshRef.current.scale.set(s, s, s);
      }
    }
  });

  return (
    <group 
      position={pos} 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      <Float speed={isActive ? 5 : 2} floatIntensity={isActive ? 1.5 : 0.5}>
        {/* Glow Effect */}
        <mesh scale={1.2}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshBasicMaterial color={color} transparent opacity={isActive ? 0.2 : hovered ? 0.1 : 0.05} />
        </mesh>
        
        {/* Main Planet */}
        <mesh ref={meshRef} castShadow>
          <sphereGeometry args={[0.8, 64, 64]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.9} 
            roughness={0.1}
            emissive={color}
            emissiveIntensity={isActive ? 1 : hovered ? 0.5 : 0.2}
          />
        </mesh>

        {/* Ring for active */}
        {isActive && (
          <mesh rotation={[Math.PI / 2.5, 0, 0]}>
            <torusGeometry args={[1.2, 0.02, 16, 100]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} />
          </mesh>
        )}

        <Html position={[0, -1.5, 0]} center distanceFactor={10}>
          <div className={`px-5 py-2.5 rounded-full bg-slate-900/80 backdrop-blur-xl border transition-all duration-500 whitespace-nowrap flex items-center gap-3 ${
            isActive ? 'border-blue-500 scale-125' : 'border-white/10 hover:border-white/20'
          }`}>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive ? 'text-blue-400' : 'text-slate-400'}`}>
              {label}
            </span>
            {isCompleted && (
              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
        </Html>
      </Float>
    </group>
  );
}

function CareerGalaxy({ activePortal, completedPortals, onPortalClick }: any) {
  return (
    <group>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={15} size={2} speed={0.4} color="#3b82f6" />
      
      {/* Central Core */}
      <Float speed={1} floatIntensity={0.5}>
        <mesh>
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshStandardMaterial 
            color="#3b82f6" 
            emissive="#3b82f6" 
            emissiveIntensity={2} 
            transparent 
            opacity={0.3} 
            wireframe
          />
        </mesh>
      </Float>

      {CAREERS.map((c, i) => {
        const angle = (i / CAREERS.length) * Math.PI * 2;
        const radius = 6;
        return (
          <CareerOrb 
            key={c.id}
            id={c.id}
            pos={[Math.cos(angle) * radius, Math.sin(angle) * radius * 0.5, Math.sin(angle) * radius]}
            label={c.label}
            color={c.color}
            isActive={activePortal === c.id}
            isCompleted={completedPortals.includes(c.id)}
            onClick={() => onPortalClick(c.id)}
          />
        );
      })}
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
    mission: 'Systematically examine water systems to identify wastage and optimize usage efficiency.',
    skills: ['Data Integrity', 'Hydraulic Mapping', 'Waste Quantification'],
    pathway: 'Audit -> Analysis -> Recommendation'
  },
  { 
    id: 'engineer', 
    label: 'Sustainability Engineer', 
    icon: Construction, 
    color: '#0ea5e9', 
    mission: 'Design closed-loop recovery systems and high-efficiency filtration infrastructure.',
    skills: ['Process Engineering', 'Renewable Integration', 'Lifecycle Modeling'],
    pathway: 'Design -> Build -> Optimize'
  },
  { 
    id: 'scientist', 
    label: 'Hydrologist', 
    icon: Microscope, 
    color: '#6366f1', 
    mission: 'Study the distribution, circulation, and physical properties of ground and surface waters.',
    skills: ['Aqueous Chemistry', 'GIS Mapping', 'Aquifer Saturation'],
    pathway: 'Sample -> Analyze -> Protect'
  },
  { 
    id: 'advocate', 
    label: 'Environmental Policy Lead', 
    icon: Megaphone, 
    color: '#8b5cf6', 
    mission: 'Shape legislation and community standards to ensure long-term water security for all.',
    skills: ['Strategic Comms', 'Public Policy', 'Stakeholder Management'],
    pathway: 'Advocate -> Policy -> Impact'
  }
];

export function CareerExploration() {
  const router = useRouter();
  const [activePortal, setActivePortal] = useState<string | null>(null);
  const [completedPortals, setCompletedPortals] = useState<string[]>([]);
  
  const handlePortalClick = (id: string) => {
    setActivePortal(id);
    if (!completedPortals.includes(id)) {
      // Simulate "reading" or "syncing" profile
      setTimeout(() => {
        setCompletedPortals(prev => [...prev, id]);
      }, 2000);
    }
  };

  const activeCareer = useMemo(() => CAREERS.find(c => c.id === activePortal), [activePortal]);
  const isComplete = completedPortals.length === CAREERS.length;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[850px]">
        
        {/* LEFT: 3D Career Galaxy (Col 8) */}
        <div className="lg:col-span-8 bg-[#020617] rounded-[3.5rem] relative overflow-hidden shadow-2xl border border-white/5">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 5, 18]} fov={40} />
            <OrbitControls 
              autoRotate={!activePortal}
              autoRotateSpeed={0.5}
              enablePan={false} 
              minDistance={10} 
              maxDistance={25}
            />
            
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={500} color="#3b82f6" />
            <pointLight position={[-10, -10, -10]} intensity={200} color="#8b5cf6" />
            
            <Suspense fallback={null}>
              <CareerGalaxy 
                activePortal={activePortal} 
                completedPortals={completedPortals} 
                onPortalClick={handlePortalClick} 
              />
              <Environment preset="night" />
            </Suspense>
          </Canvas>

          {/* HUD Overlay */}
          <div className="absolute top-10 left-10 flex flex-col gap-4 pointer-events-none">
            <div className="bg-white/5 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Career Map</span>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">The Water Frontier</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-xl px-8 py-4 rounded-full border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${completedPortals.length >= 1 ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-white/10'}`} />
              Phase I
            </div>
            <div className="w-8 h-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${completedPortals.length >= 3 ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-white/10'}`} />
              Phase II
            </div>
            <div className="w-8 h-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isComplete ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-white/10'}`} />
              Certification
            </div>
          </div>
        </div>

        {/* RIGHT: Profile Explorer (Col 4) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm flex-1 flex flex-col relative overflow-hidden">
            {!activePortal ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 animate-pulse">
                  <Target size={40} className="text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tighter mb-4 leading-tight">Explore the<br />Galaxy</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-[200px]">
                  Select an orbital destination to unlock career insights and required skills.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col animate-in slide-in-from-right-8 duration-500">
                <div className="flex items-start justify-between mb-10">
                  <div className="p-5 rounded-[2rem] bg-slate-50" style={{ color: activeCareer?.color }}>
                    {activeCareer && React.createElement(activeCareer.icon, { size: 32 })}
                  </div>
                  <div className="bg-blue-50 px-4 py-2 rounded-full">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Level 10</span>
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-4">{activeCareer?.label}</h3>
                  <p className="text-sm font-bold text-slate-500 leading-relaxed italic border-l-4 border-slate-100 pl-4">
                    "{activeCareer?.mission}"
                  </p>
                </div>

                <div className="space-y-8 flex-1">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Mastery Domains</span>
                    <div className="flex flex-col gap-3">
                      {activeCareer?.skills.map(skill => (
                        <div key={skill} className="flex items-center gap-4 group">
                          <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-150 transition-all" />
                          <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Advancement Pathway</span>
                    <div className="text-[11px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-3">
                      {activeCareer?.pathway.split(' -> ').map((step, i, arr) => (
                        <React.Fragment key={step}>
                          <span>{step}</span>
                          {i < arr.length - 1 && <ChevronRight size={12} className="text-slate-300" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Portal Sync</span>
                    <span className={`text-[10px] font-black uppercase ${completedPortals.includes(activePortal) ? 'text-emerald-500' : 'text-blue-600 animate-pulse'}`}>
                      {completedPortals.includes(activePortal) ? 'Verified' : 'Processing...'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {CAREERS.map(c => (
                      <div key={c.id} className={`w-2 h-2 rounded-full ${completedPortals.includes(c.id) ? 'bg-blue-500' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white flex flex-col gap-8 relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Award size={20} className="text-white" />
                </div>
                <h4 className="text-lg font-black tracking-tight uppercase">Audit Legacy</h4>
              </div>
              <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                Your journey through the Water Audit Project is nearing its conclusion. These career paths represent the impact you can scale by applying your data skills to global challenges.
              </p>
            </div>
            
            <button
              onClick={() => isComplete ? router.push('/') : null}
              disabled={!isComplete}
              className={`w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-black transition-all group ${
                isComplete
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
              }`}
            >
              {isComplete ? 'Complete Full Course' : `Explore ${CAREERS.length - completedPortals.length} More Portals`}
              <ArrowRight size={20} className={isComplete ? "group-hover:translate-x-1 transition-transform" : ""} />
            </button>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
