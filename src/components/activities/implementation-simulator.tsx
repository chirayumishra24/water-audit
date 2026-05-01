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
  RoundedBox,
  Edges,
  MeshTransmissionMaterial,
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
  TrendingDown,
  BarChart3
} from "lucide-react";
import * as THREE from "three";
import { useRouter } from "next/navigation";

// --- 3D Components ---

function FacilityAsset({ pos, size, color, label, isActive }: { pos: [number, number, number], size: [number, number, number], color: string, label: string, isActive: boolean }) {
  return (
    <group position={pos}>
      <Float speed={isActive ? 2 : 0} rotationIntensity={isActive ? 0.2 : 0} floatIntensity={isActive ? 0.2 : 0}>
        <RoundedBox args={size} radius={0.1}>
          <meshStandardMaterial color={isActive ? color : "#cbd5e1"} roughness={0.3} metalness={0.8} />
          <Edges color={isActive ? color : "#94a3b8"} />
        </RoundedBox>
      </Float>
      <Html position={[0, size[1]/2 + 0.8, 0]} center distanceFactor={10}>
        <div className={`px-3 py-1.5 rounded-full border shadow-sm transition-all duration-500 ${
          isActive ? 'bg-blue-600 text-white border-blue-400 scale-110 shadow-blue-500/20' : 'bg-white/80 text-slate-400 border-slate-200'
        }`}>
          <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
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
  const activeIds = actions.filter(a => a.week <= currentWeek).map(a => a.id);

  return (
    <group position={[0, -0.5, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      
      <Grid
        infiniteGrid
        fadeDistance={50}
        fadeStrength={5}
        cellSize={1}
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#3b82f6"
        cellColor="#e2e8f0"
      />

      <FacilityAsset 
        pos={[-4, 1.5, -4]} 
        size={[3, 3, 3]} 
        color="#3b82f6" 
        label="Admin Block" 
        isActive={activeIds.includes(4)} 
      />
      <FacilityAsset 
        pos={[4, 2, 2]} 
        size={[6, 4, 6]} 
        color="#8b5cf6" 
        label="Production" 
        isActive={activeIds.includes(1) || activeIds.includes(2)} 
      />
      <FacilityAsset 
        pos={[-3, 1, 4]} 
        size={[4, 2, 4]} 
        color="#10b981" 
        label="Water Plant" 
        isActive={activeIds.includes(3)} 
      />

      {/* Active Interventions Pulse */}
      {actions.filter(a => a.week <= currentWeek).map((action, i) => (
        <group key={i} position={[action.pos[0], 6, action.pos[2]]}>
          <Float speed={5}>
            <mesh>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} />
            </mesh>
            <Html center distanceFactor={10}>
              <div className="bg-blue-600/90 backdrop-blur-md text-white text-[9px] font-black px-4 py-2 rounded-xl whitespace-nowrap shadow-2xl border border-blue-400 flex items-center gap-2 animate-bounce">
                <Activity size={12} />
                {action.name.toUpperCase()}
              </div>
            </Html>
          </Float>
        </group>
      ))}

      <Environment preset="city" />
      <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={30} blur={2.5} far={10} color="#000000" />
    </group>
  );
}

// --- Main Activity ---

const INTERVENTIONS = [
  { id: 1, name: 'Leak Repair', pos: [4, 0, 2], icon: Droplets, color: 'text-rose-500', savings: 15, effort: 2, desc: 'Fix production line valves.' },
  { id: 2, name: 'Cooling Tower Opt.', pos: [5, 0, 3], icon: Zap, color: 'text-amber-500', savings: 25, effort: 5, desc: 'Improve cycles of concentration.' },
  { id: 3, name: 'STP Recycling', pos: [-3, 0, 4], icon: TrendingDown, color: 'text-emerald-500', savings: 35, effort: 9, desc: 'Reuse greywater for landscaping.' },
  { id: 4, name: 'Flow Aerators', pos: [-4, 0, -4], icon: Target, color: 'text-blue-500', savings: 10, effort: 1, desc: 'Install in all office blocks.' }
];

export function ImplementationSimulator() {
  const router = useRouter();
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
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[750px]">
        
        {/* LEFT: 3D Visualization */}
        <div className="lg:col-span-8 bg-slate-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-slate-800">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[15, 15, 15]} fov={35} />
            <OrbitControls 
              enablePan={true} 
              minDistance={10} 
              maxDistance={30}
              maxPolarAngle={Math.PI / 2.2}
            />
            
            <ambientLight intensity={1.5} />
            <spotLight position={[20, 30, 20]} intensity={1000} castShadow />
            
            <Suspense fallback={null}>
              <SimulationScene 
                currentWeek={currentWeek} 
                actions={plannedActions} 
              />
            </Suspense>
          </Canvas>

          {/* HUD Overlay */}
          <div className="absolute top-8 left-8 flex flex-col gap-4">
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Deployment Timeline</span>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Week {currentWeek} / {totalWeeks}</h2>
                </div>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl min-w-[200px]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Efficiency GAIN</span>
                <TrendingUp size={16} className="text-emerald-400" />
              </div>
              <div className="text-4xl font-black text-white leading-none">+{activeSavings}%</div>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Saved KL/Day</p>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-1000"
                style={{ width: `${(currentWeek / totalWeeks) * 100}%` }}
              />
            </div>
            <button 
              onClick={reset}
              className="w-14 h-14 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </div>

        {/* RIGHT: Action Plan Builder */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex-1 flex flex-col overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Execution Plan</h3>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <Settings size={20} className="text-slate-300" />
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Available Actions</span>
              <div className="flex flex-col gap-3">
                {INTERVENTIONS.map(action => {
                  const isPlanned = plannedActions.some(a => a.id === action.id);
                  return (
                    <button
                      key={action.id}
                      onClick={() => addAction(action)}
                      disabled={isPlanned}
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all group ${
                        isPlanned 
                          ? 'bg-slate-900 border-slate-900 text-white opacity-40' 
                          : 'bg-white border-slate-100 hover:border-blue-400 hover:bg-blue-50/30'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isPlanned ? 'bg-white/10' : 'bg-slate-50'}`}>
                        <action.icon className={`w-6 h-6 ${isPlanned ? 'text-white' : action.color}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="text-xs font-black uppercase tracking-tight">{action.name}</h4>
                        <p className={`text-[10px] font-bold ${isPlanned ? 'text-white/60' : 'text-slate-400'}`}>{action.desc}</p>
                      </div>
                      {isPlanned ? <CheckCircle2 size={18} className="text-emerald-400" /> : <ChevronRight size={18} className="text-slate-200 group-hover:text-blue-400 transition-colors" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {plannedActions.length > 0 && (
              <div className="mt-10 space-y-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Scheduled Queue</span>
                <div className="space-y-3">
                  {plannedActions.sort((a, b) => a.week - b.week).map(action => {
                    const isActive = action.week <= currentWeek;
                    return (
                      <div 
                        key={action.id}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                          isActive ? 'bg-blue-600 text-white border-blue-400 shadow-xl scale-[1.02]' : 'bg-slate-50 border-slate-100'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 ${isActive ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                          <span className="text-[8px] font-black opacity-60">WK</span>
                          <span className="text-sm font-black">{action.week}</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="text-[10px] font-black uppercase tracking-widest">{action.name}</h5>
                          <span className="text-[9px] font-bold opacity-60">Impact: +{action.savings}%</span>
                        </div>
                        {isActive && <Activity size={16} className="animate-pulse" />}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                <Info size={20} className="text-blue-400" />
              </div>
              <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                Design a 12-week implementation roadmap. Strategic sequencing allows you to reinvest quick-win savings into major capital projects.
              </p>
            </div>

            <button
              onClick={() => currentWeek === totalWeeks ? router.push('/3-3') : setIsPlaying(true)}
              disabled={plannedActions.length === 0}
              className={`w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-black transition-all ${
                plannedActions.length > 0
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {currentWeek === totalWeeks ? 'Complete Module' : 'Execute Implementation'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Strategy Summary Footer */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner">
            <Target size={24} />
          </div>
          <h4 className="text-lg font-black text-slate-900 tracking-tight">Sequence Matters</h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">Start with leak repairs and aerators. These low-cost actions provide immediate data shifts that justify larger investments like recycling plants.</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
            <BarChart3 size={24} />
          </div>
          <h4 className="text-lg font-black text-slate-900 tracking-tight">Data Integrity</h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">Smart meters (Week 2-4) are the foundation of implementation. Without them, you cannot prove the savings from subsequent technical work.</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="text-lg font-black text-slate-900 tracking-tight">Success Metrics</h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">An action plan without a success metric is just a wish list. Every deployment in this simulator correlates to a measurable reduction in site intensity.</p>
        </div>
      </div>
    </div>
  );
}
