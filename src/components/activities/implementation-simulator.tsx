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
  Play, 
  Pause, 
  RotateCcw, 
  Calendar,
  Settings,
  Droplets,
  AlertTriangle,
  TrendingUp,
  Building2,
  CheckCircle2,
  Info,
  Activity,
  ArrowRight,
  Target,
  Zap,
  ChevronRight,
  TrendingDown
} from "lucide-react";
import * as THREE from "three";

// --- 3D Components ---

function FacilityBlock({ pos, size, color, label }: { pos: [number, number, number], size: [number, number, number], color: string, label: string }) {
  return (
    <group position={pos}>
      <mesh castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.2} />
      </mesh>
      <Html position={[0, size[1]/2 + 0.5, 0]} center distanceFactor={8}>
        <div className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full border border-slate-200 shadow-sm whitespace-nowrap">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
      </Html>
    </group>
  );
}

function SimulationScene({ 
  currentWeek, 
  actions 
}: { 
  currentWeek: number, 
  actions: any[] 
}) {
  const activeActions = actions.filter(a => a.week <= currentWeek);

  return (
    <group position={[0, -0.5, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f8fafc" />
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

      <FacilityBlock pos={[-3, 1, -3]} size={[4, 2, 4]} color="#ffffff" label="Main Office" />
      <FacilityBlock pos={[3, 1.5, 2]} size={[5, 3, 5]} color="#f1f5f9" label="Production Wing" />
      <FacilityBlock pos={[-2, 0.5, 4]} size={[3, 1, 3]} color="#e2e8f0" label="Storage" />

      {/* Active Interventions */}
      {activeActions.map((action, i) => (
        <group key={i} position={[action.pos[0], 4 + (i * 0.8), action.pos[2]]}>
          <Float speed={3} floatIntensity={0.5}>
            <mesh>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
            </mesh>
            <Html center distanceFactor={8}>
              <div className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full whitespace-nowrap shadow-2xl border border-white/20 flex items-center gap-2">
                <Zap className="w-3 h-3" />
                {action.name}
              </div>
            </Html>
          </Float>
        </group>
      ))}

      {/* Leak Visuals */}
      {!activeActions.some(a => a.name === "Leak Repair") && (
        <group position={[-1, 0.02, 1]}>
          {[...Array(5)].map((_, i) => (
            <mesh key={i} position={[Math.sin(i) * 0.8, 0, Math.cos(i) * 0.8]} rotation={[-Math.PI/2, 0, 0]}>
              <circleGeometry args={[0.2, 16]} />
              <meshBasicMaterial color="#ef4444" transparent opacity={0.2} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

// --- Main Activity ---

const INTERVENTIONS = [
  { id: 1, name: 'Leak Repair', pos: [-1, 0, 1], icon: Droplets, color: 'text-rose-500', savings: 15 },
  { id: 2, name: 'Smart Meters', pos: [3, 0, 2], icon: Activity, color: 'text-blue-500', savings: 20 },
  { id: 3, name: 'Rain Harvest', pos: [-2, 0, 4], icon: TrendingDown, color: 'text-emerald-500', savings: 10 },
  { id: 4, name: 'Eco Fixtures', pos: [-3, 0, -3], icon: Target, color: 'text-amber-500', savings: 12 }
];

export function ImplementationSimulator() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [plannedActions, setPlannedActions] = useState<any[]>([]);
  const totalWeeks = 12;

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentWeek((prev) => {
          if (prev >= totalWeeks) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const addAction = (action: typeof INTERVENTIONS[0]) => {
    if (plannedActions.some(a => a.id === action.id)) return;
    setPlannedActions([...plannedActions, { 
      ...action, 
      week: Math.floor(Math.random() * 8) + 2 
    }]);
  };

  const reset = () => {
    setCurrentWeek(1);
    setIsPlaying(false);
    setPlannedActions([]);
  };

  const activeSavings = plannedActions
    .filter(a => a.week <= currentWeek)
    .reduce((acc, curr) => acc + curr.savings, 0);

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[750px] bg-white rounded-[3.5rem] overflow-hidden border border-slate-200 shadow-2xl relative">
      {/* LEFT: 3D SIMULATION PANEL */}
      <div className="relative flex-1 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 overflow-hidden min-h-[450px]">
        <Canvas shadows className="w-full h-full">
          <PerspectiveCamera makeDefault position={[12, 12, 12]} fov={35} />
          <OrbitControls 
            enablePan={true} 
            minDistance={8} 
            maxDistance={25}
            maxPolarAngle={Math.PI / 2.2}
          />
          
          <ambientLight intensity={1.5} />
          <spotLight position={[20, 30, 20]} intensity={800} castShadow />
          
          <Suspense fallback={null}>
            <SimulationScene 
              currentWeek={currentWeek} 
              actions={plannedActions} 
            />
            <Environment preset="city" />
            <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={25} blur={2.5} far={10} color="#000000" />
          </Suspense>
        </Canvas>

        {/* HUD Elements */}
        <div className="absolute top-10 left-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Simulation Timeline</span>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Week {currentWeek} / {totalWeeks}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 pointer-events-none w-full max-w-sm">
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-2xl pointer-events-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button 
                  onClick={reset}
                  className="w-10 h-10 bg-white border border-slate-200 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Efficiency Gain</span>
                <div className="text-2xl font-black text-blue-600 leading-none">+{activeSavings}%</div>
              </div>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-1000" 
                style={{ width: `${(currentWeek / totalWeeks) * 100}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: CONFIGURATION PANEL */}
      <div className="w-full lg:w-[450px] bg-white flex flex-col p-12 gap-10 overflow-y-auto no-scrollbar">
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Implementation</h3>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <Settings className="w-5 h-5 text-slate-300" />
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Available Interventions</span>
            <div className="grid grid-cols-1 gap-3">
              {INTERVENTIONS.map((action) => {
                const isPlanned = plannedActions.some(a => a.id === action.id);
                return (
                  <button
                    key={action.id}
                    onClick={() => addAction(action)}
                    disabled={isPlanned}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                      isPlanned 
                        ? "bg-slate-900 border-slate-900 text-white opacity-40 cursor-not-allowed" 
                        : "bg-white border-slate-100 text-slate-600 hover:border-blue-400 hover:bg-blue-50/30 shadow-sm"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isPlanned ? 'bg-white/10' : 'bg-slate-50'
                    }`}>
                      <action.icon className={`w-5 h-5 ${isPlanned ? 'text-white' : action.color}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-xs font-black uppercase tracking-tight">{action.name}</h4>
                      <span className="text-[10px] font-bold opacity-60">Estimated {action.savings}% efficiency</span>
                    </div>
                    {isPlanned && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Simulation Queue</span>
            {plannedActions.length === 0 ? (
              <div className="text-center py-10 border-4 border-dashed border-slate-50 rounded-3xl">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Select interventions to begin planning</p>
              </div>
            ) : (
              <div className="space-y-3">
                {plannedActions.sort((a, b) => a.week - b.week).map((action) => {
                  const isActive = action.week <= currentWeek;
                  return (
                    <div 
                      key={action.id} 
                      className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                        isActive ? 'bg-blue-600 text-white border-blue-600 shadow-xl scale-[1.02]' : 'bg-white border-slate-100 text-slate-400'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 ${
                        isActive ? 'bg-white/20' : 'bg-slate-50'
                      }`}>
                        <span className="text-[8px] font-black opacity-60 uppercase">WK</span>
                        <span className="text-sm font-black">{action.week}</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="text-[10px] font-black uppercase tracking-widest">{action.name}</h5>
                        <span className="text-[8px] font-bold opacity-60 uppercase">
                          {isActive ? 'Currently Active' : `Deployment Scheduled`}
                        </span>
                      </div>
                      {isActive && <Activity size={16} className="animate-pulse" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto space-y-6">
          <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              Design a 12-week implementation strategy. Each intervention impacts the facility's water performance in real-time.
            </p>
          </div>
          
          <button 
            disabled={plannedActions.length === 0}
            className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 ${
              plannedActions.length === 0 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            Finalize Strategy <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Completion Overlay */}
      {currentWeek === totalWeeks && plannedActions.length > 0 && (
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center p-12 z-50 animate-in fade-in zoom-in duration-700">
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto shadow-2xl border-4 border-white/20">
              <TrendingUp size={48} className="text-white" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase leading-none">Simulation Optimized</h2>
            <p className="text-slate-400 mb-10 font-medium text-sm leading-relaxed">
              Your strategy resulted in a <span className="text-white font-black">{activeSavings}% overall reduction</span> in water consumption. You have successfully demonstrated implementation planning.
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={reset}
                className="w-full py-5 bg-white text-slate-900 font-black rounded-2xl transition-all shadow-xl hover:scale-105 active:scale-95 text-xs uppercase tracking-widest"
              >
                Restart Strategy
              </button>
              <button className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl transition-all shadow-xl hover:bg-blue-700 active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-3">
                Download Execution Plan
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
