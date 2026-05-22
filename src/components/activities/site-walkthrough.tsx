'use client';

import React, { useState, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  OrbitControls, 
  Html,
  Cylinder,
  Grid,
  Environment,
  RoundedBox,
  ContactShadows,
  Torus,
  Float
} from '@react-three/drei';
import * as THREE from 'three';
import { 
  Eye, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  Activity, 
  Target, 
  ShieldCheck, 
  Crosshair, 
  Droplets, 
  RotateCcw,
  ArrowRight,
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';

// --- Data ---

const LOSS_POINTS = [
  { id: 1, name: 'Dripping Faucet', pos: [-3, 0.5, 2] as [number, number, number], description: 'A small leak can waste 2,000L/year.', severity: 'Low', icon: Droplets },
  { id: 2, name: 'Tank Overflow', pos: [0, 3.5, -2] as [number, number, number], description: 'Missing float valve causing water waste.', severity: 'Critical', icon: AlertCircle },
  { id: 3, name: 'Broken Sprinkler', pos: [4, 0.2, 0] as [number, number, number], description: 'Watering the pavement instead of grass.', severity: 'High', icon: Crosshair },
  { id: 4, name: 'Corroded Pipe', pos: [-2, 0.5, -3] as [number, number, number], description: 'Hidden pinhole leak in supply line.', severity: 'Medium', icon: ShieldCheck }
];

// --- 3D Components ---

function FaucetModel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Cylinder args={[0.05, 0.05, 0.5]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </Cylinder>
      <Cylinder args={[0.05, 0.05, 0.3]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.5, 0.15]}>
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </Cylinder>
      <RoundedBox args={[0.4, 0.1, 0.4]} radius={0.05} position={[0, 0, 0]}>
        <meshStandardMaterial color="#cbd5e1" />
      </RoundedBox>
    </group>
  );
}

function TankModel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Cylinder args={[1, 1, 2, 32]} castShadow>
        <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.5} />
      </Cylinder>
      <Cylinder args={[1.1, 1.1, 0.2]} position={[0, 1.1, 0]}>
        <meshStandardMaterial color="#475569" />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 1]} rotation={[0, 0, Math.PI / 2]} position={[0.8, 0, 0]}>
        <meshStandardMaterial color="#94a3b8" />
      </Cylinder>
    </group>
  );
}

function SprinklerModel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      <Cylinder args={[0.05, 0.1, 0.3]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#334155" />
      </Cylinder>
      <Torus args={[0.1, 0.02, 16, 32]} position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#94a3b8" />
      </Torus>
    </group>
  );
}

function PipeModel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, Math.PI / 4, 0]}>
      <Cylinder args={[0.1, 0.1, 2]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.15, 0.15, 0.4]} position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#64748b" />
      </Cylinder>
      <Cylinder args={[0.15, 0.15, 0.4]} position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#64748b" />
      </Cylinder>
    </group>
  );
}

function LossPointMarker({ point, found, onFound }: { point: any, found: boolean, onFound: (id: number) => void }) {
  const [hovered, setHovered] = useState(false);
  const color = found ? "#22c55e" : hovered ? "#3b82f6" : "#60a5fa";

  return (
    <group position={point.pos}>
      <Float speed={5} floatIntensity={0.5}>
        <mesh 
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onFound(point.id)}
        >
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={hovered ? 2 : 0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
        
        {!found && (
          <Html distanceFactor={8} position={[0, 0.8, 0]} center>
            <div className={`px-4 py-2 rounded-2xl bg-white/90 backdrop-blur-xl border-2 shadow-2xl transition-all duration-500 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              hovered ? 'border-blue-600 scale-110' : 'border-white'
            }`}>
              <Search className="w-3 h-3 text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Inspect</span>
            </div>
          </Html>
        )}
      </Float>
    </group>
  );
}

// --- Main Activity ---

export function SiteWalkthrough() {
  const [foundIds, setFoundIds] = useState<number[]>([]);
  const progress = (foundIds.length / LOSS_POINTS.length) * 100;

  const handleFound = (id: number) => {
    setFoundIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const reset = () => setFoundIds([]);

  const handlePrint = () => {
    document.body.classList.add('printing-activity');
    window.print();
    document.body.classList.remove('printing-activity');
  };

  return (
    <div className="w-full flex flex-col gap-6 activity-print-target">
      {/* Print-only Header */}
      <div className="hidden print:block mb-12 border-b-4 border-slate-900 pb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-blue-600 font-black text-sm uppercase tracking-[0.3em] block mb-2">Module 02: Facility Audit</span>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Site Inspection Report</h1>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Reference</div>
            <div className="text-sm font-black text-slate-900 uppercase italic">#SWK-AUDIT-02</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="bg-slate-50 p-4 rounded-2xl">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Audit Status</span>
            <span className="text-sm font-black uppercase text-emerald-500">Certified Complete</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl text-center">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Issues Identified</span>
            <span className="text-2xl font-black text-slate-900">{foundIds.length} / {LOSS_POINTS.length}</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl text-right">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Inspection Date</span>
            <span className="text-sm font-black text-slate-900 uppercase">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full bg-slate-900 rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl relative lg:aspect-[16/9]">
        {/* LEFT: 3D SITE PANEL */}
        <div className="relative flex-1 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 overflow-hidden">
          <Canvas shadows className="w-full h-full" gl={{ preserveDrawingBuffer: true }}>
            <PerspectiveCamera makeDefault position={[12, 12, 12]} fov={35} />
            <OrbitControls 
              enablePan={true}
              minDistance={8}
              maxDistance={25}
              maxPolarAngle={Math.PI / 2.1}
            />
            
            <ambientLight intensity={1.5} />
            <spotLight position={[20, 30, 10]} intensity={800} castShadow />
            
            <Suspense fallback={null}>
              <Grid
                infiniteGrid
                fadeDistance={40}
                fadeStrength={5}
                cellSize={1}
                sectionSize={5}
                sectionThickness={1}
                sectionColor="#3b82f6"
                cellColor="#1e293b"
              />
              
              <FaucetModel position={[-3, 0.05, 2]} />
              <TankModel position={[0, 1, -2]} />
              <SprinklerModel position={[4, 0.01, 0]} />
              <PipeModel position={[-2, 0.05, -3]} />
              
              {LOSS_POINTS.map(p => (
                <LossPointMarker 
                  key={p.id} 
                  point={p} 
                  found={foundIds.includes(p.id)} 
                  onFound={handleFound} 
                />
              ))}
              
              <Environment preset="city" />
              <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={25} blur={2.5} far={10} color="#000000" />
            </Suspense>
          </Canvas>

          {/* HUD Elements */}
          <div className="absolute top-10 left-10 pointer-events-none">
            <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[8px] font-black text-white/60 uppercase tracking-widest block">Audit Engine</span>
                  <h2 className="text-2xl font-black uppercase tracking-tighter tabular-nums">Site Inspection</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions Overlay */}
          <div className="absolute top-10 right-10 pointer-events-none z-10 print:hidden">
            <div className="bg-slate-900/90 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl max-w-[180px]">
              <div className="flex items-center gap-2 mb-3 text-blue-400">
                <Info size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Controls</span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Drag to Rotate</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Scroll to Zoom</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter">Click Blue Dots</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="absolute bottom-10 left-10 pointer-events-none">
            <div className="bg-blue-600/10 backdrop-blur-md px-6 py-3 rounded-full border border-blue-500/20 text-blue-500 flex items-center gap-3">
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                {foundIds.length === LOSS_POINTS.length ? 'Site Audit Complete' : `Searching for ${LOSS_POINTS.length - foundIds.length} more issues`}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: REGISTRY PANEL */}
        <div className="w-full lg:w-[450px] bg-slate-900 flex flex-col p-12 gap-10 overflow-y-auto no-scrollbar print:p-0 print:border-none print:w-full border-l border-white/5">
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Issue Registry</h3>
              <div className="p-3 bg-white/5 rounded-2xl print:hidden border border-white/5">
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
            </div>

            <div className="flex-1 space-y-4 min-h-[300px]">
              {foundIds.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-12 border-4 border-dashed border-white/5 rounded-[3rem] h-full print:hidden">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
                    <Eye className="w-10 h-10 text-slate-700" />
                  </div>
                  <h4 className="text-sm font-black text-slate-600 uppercase tracking-widest mb-2">No Issues Detected</h4>
                  <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest">
                    Rotate the 3D view and click on the markers to identify facility loss points.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500 print:grid print:grid-cols-2 print:gap-6 print:space-y-0">
                  {foundIds.map(id => {
                    const p = LOSS_POINTS.find(item => item.id === id)!;
                    return (
                      <div key={id} className="p-6 bg-white/5 rounded-[2.5rem] border border-white/5 flex items-start gap-5 group hover:bg-white/10 hover:shadow-xl transition-all print:bg-white print:border-slate-200">
                        <div className="p-4 bg-slate-900 rounded-2xl shadow-sm group-hover:scale-110 transition-transform print:shadow-none print:border print:border-slate-100 border border-white/5">
                          <p.icon size={24} className="text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-black uppercase tracking-tight text-white">{p.name}</h4>
                            <span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase ${
                              p.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400' :
                              p.severity === 'High' ? 'bg-amber-500/10 text-amber-400' :
                              'bg-blue-500/10 text-blue-400'
                            }`}>
                              {p.severity}
                            </span>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 leading-relaxed">{p.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto space-y-6">
            {/* Progress Widget */}
            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden print:hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Progress</span>
                  <div className="text-2xl font-black tabular-nums">{Math.round(progress)}%</div>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-1000 ease-out" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                      {foundIds.length}/{LOSS_POINTS.length} Identified
                    </span>
                  </div>
                  <button onClick={reset} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/5 rounded-3xl border border-white/5 print:hidden">
              <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center shrink-0 border border-blue-500/20">
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-xs font-bold text-blue-400 leading-relaxed">
                Identify all critical leaks to generate the final site audit report.
              </p>
            </div>

            <button 
              onClick={handlePrint}
              disabled={foundIds.length < LOSS_POINTS.length}
              className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 print:hidden ${
                foundIds.length < LOSS_POINTS.length 
                  ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5' 
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              Finalize Site Report <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Completion Mastery Overlay */}
        {foundIds.length === LOSS_POINTS.length && (
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center p-12 z-50 animate-in fade-in zoom-in duration-700 print:hidden">
            <div className="text-center max-w-sm">
              <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto shadow-2xl border-4 border-white/20">
                <ShieldCheck size={48} className="text-white" />
              </div>
              <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase leading-none">Walkthrough Complete</h2>
              <p className="text-slate-400 mb-10 font-medium text-sm leading-relaxed">
                You have identified all water loss points across the facility. Your technical awareness is now certified for Module 2.
              </p>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handlePrint}
                  className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl transition-all shadow-xl hover:bg-blue-700 active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  Generate Audit Document
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={reset}
                  className="w-full py-5 bg-white/5 text-slate-400 font-black rounded-2xl transition-all hover:bg-white/10 text-xs uppercase tracking-widest"
                >
                  Re-inspect Site
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
