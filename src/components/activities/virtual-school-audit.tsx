'use client';

import React, { useState, useRef, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Html, 
  RoundedBox,
  Box,
  Cylinder,
  Plane,
  Environment,
  ContactShadows,
  Float,
  SpotLight,
  Sparkles,
  Grid
} from '@react-three/drei';
import * as THREE from 'three';
import { 
  Search, 
  CheckCircle2, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  Eye, 
  RotateCcw,
  AlertCircle,
  ArrowRight,
  Info,
  ChevronRight,
  Droplets,
  Wrench,
  Zap
} from 'lucide-react';

function Wall({ position, args }: { position: [number, number, number], args: [number, number, number] }) {
  return (
    <Box position={position} args={args} receiveShadow castShadow>
      <meshStandardMaterial color="#f8fafc" roughness={0.5} />
    </Box>
  );
}

function SinkModel({ position, isLeaking }: { position: [number, number, number], isLeaking: boolean }) {
  return (
    <group position={position}>
      <Box args={[3, 1, 1.5]} position={[0, 0.5, 0]} castShadow>
        <meshStandardMaterial color="#cbd5e1" />
      </Box>
      <Cylinder args={[0.1, 0.1, 1]} position={[0, 1.5, 0]} castShadow>
        <meshStandardMaterial color="#94a3b8" />
      </Cylinder>
      {isLeaking && <Sparkles count={20} scale={0.5} size={2} speed={0.5} color="#60a5fa" position={[0, 1, 0]} />}
    </group>
  );
}

function ToiletModel({ position, isLeaking }: { position: [number, number, number], isLeaking: boolean }) {
  return (
    <group position={position}>
      <Box args={[1.5, 0.8, 2]} position={[0, 0.4, 0]} castShadow>
        <meshStandardMaterial color="#f8fafc" />
      </Box>
      <Box args={[1.5, 1.2, 0.6]} position={[0, 1.4, -0.7]} castShadow>
        <meshStandardMaterial color="#f8fafc" />
      </Box>
      {isLeaking && <Sparkles count={20} scale={0.8} size={2} speed={0.5} color="#60a5fa" position={[0, 0.5, 0]} />}
    </group>
  );
}

function GardenModel({ position, isLeaking }: { position: [number, number, number], isLeaking: boolean }) {
  return (
    <group position={position}>
      <Plane args={[8, 8]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <meshStandardMaterial color="#86efac" />
      </Plane>
      <Cylinder args={[0.05, 0.05, 1]} position={[0, 0.5, 0]} castShadow>
        <meshStandardMaterial color="#94a3b8" />
      </Cylinder>
      {isLeaking && <Sparkles count={30} scale={2} size={2} speed={0.3} color="#60a5fa" position={[0, 0.1, 0]} />}
    </group>
  );
}

function WaterTankModel({ position, isLeaking }: { position: [number, number, number], isLeaking: boolean }) {
  return (
    <group position={position}>
      <Cylinder args={[2, 2, 3]} position={[0, 1.5, 0]} castShadow>
        <meshStandardMaterial color="#334155" />
      </Cylinder>
      {isLeaking && <Sparkles count={50} scale={3} size={3} speed={1} color="#60a5fa" position={[0, 3, 0]} />}
    </group>
  );
}

function Hotspot({ data, onSelect }: { data: any, onSelect: () => void }) {
  return (
    <Html position={data.pos} center>
      <button 
        onClick={onSelect}
        className={`w-8 h-8 rounded-full border-4 border-white shadow-2xl transition-all duration-500 flex items-center justify-center group ${
          data.found ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'
        }`}
      >
        <div className="absolute inset-0 rounded-full bg-inherit animate-ping opacity-20" />
        {data.found ? <CheckCircle2 className="w-4 h-4 text-white" /> : <MapPin className="w-4 h-4 text-white" />}
        
        <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap pointer-events-none">
          {data.name}
        </div>
      </button>
    </Html>
  );
}

const AUDIT_POINTS = [
  { id: 'kitchen', name: 'Kitchen Sink', pos: [-5, 0.1, -4], type: 'Leak', description: 'Faucet dripping at a constant rate.', benchmarkFlow: 0.5, found: false, measured: false, icon: Droplets },
  { id: 'bathroom', name: 'Toilet Flush', pos: [5, 0, -4], type: 'Overflow', description: 'Faulty valve causing silent constant flow.', benchmarkFlow: 2.5, found: false, measured: false, icon: AlertCircle },
  { id: 'garden', name: 'Garden Tap', pos: [0, 0, 6], type: 'Corrosion', description: 'External tap leaking into soil bypass.', benchmarkFlow: 0.8, found: false, measured: false, icon: Wrench },
  { id: 'tank', name: 'Roof Tank', pos: [0, 6, -4], type: 'Sensor Failure', description: 'Tank overflows during pump cycles.', benchmarkFlow: 15.0, found: false, measured: false, icon: Zap }
];

export function VirtualSchoolAudit() {
  const router = useRouter();
  const [points, setPoints] = useState(AUDIT_POINTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [measuring, setMeasuring] = useState(false);
  const [measurementProgress, setMeasurementProgress] = useState(0);

  const handleMeasure = (id: string) => {
    setMeasuring(true);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 5;
      setMeasurementProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setPoints(prev => prev.map(p => p.id === id ? { ...p, measured: true } : p));
        setMeasuring(false);
        setMeasurementProgress(0);
      }
    }, 50);
  };

  const handleRepair = (id: string) => {
    setPoints(prev => prev.map(p => p.id === id ? { ...p, found: true } : p));
    setSelectedId(null);
  };

  const foundCount = points.filter(p => p.found).length;
  const selectedData = points.find(p => p.id === selectedId);
  const totalWastage = points.filter(p => p.found).reduce((acc, p) => acc + p.benchmarkFlow * 60 * 24, 0);
  const progress = (foundCount / AUDIT_POINTS.length) * 100;

  return (
    <div className="flex flex-col lg:flex-row w-full bg-white rounded-[3.5rem] overflow-hidden border border-slate-200 shadow-2xl relative lg:aspect-[16/9]">
      {/* LEFT: 3D SITE PANEL */}
      <div className="relative flex-1 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 overflow-hidden">
        <Canvas shadows className="w-full h-full">
          <PerspectiveCamera makeDefault position={[12, 12, 12]} fov={35} />
          <OrbitControls enablePan={true} minDistance={8} maxDistance={25} maxPolarAngle={Math.PI / 2.1} />
          <ambientLight intensity={1.5} />
          <spotLight position={[20, 30, 10]} intensity={800} castShadow />
          <Suspense fallback={null}>
            <Grid infiniteGrid fadeDistance={40} fadeStrength={5} cellSize={1} sectionSize={5} sectionThickness={1} sectionColor="#3b82f6" cellColor="#e2e8f0" />
            <group position={[0, -1.5, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[50, 50]} /><meshStandardMaterial color="#f1f5f9" /></mesh>
              <Plane args={[22, 18]} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><meshStandardMaterial color="#ffffff" roughness={0.1} /></Plane>
              <group position={[0, 1.5, -2]}>
                <Wall position={[0, 0, -5]} args={[18, 4, 0.4]} /><Wall position={[-9, 0, 2]} args={[0.4, 4, 14]} /><Wall position={[9, 0, 2]} args={[0.4, 4, 14]} /><Wall position={[0, 0, 2]} args={[0.4, 4, 6]} /> 
              </group>
              <Box args={[18, 0.4, 6]} position={[0, 4.5, -4]} receiveShadow castShadow><meshStandardMaterial color="#f8fafc" /></Box>
              <SinkModel position={[-5, 0.1, -4]} isLeaking={!points.find(p => p.id === 'kitchen')?.found} />
              <ToiletModel position={[5, 0, -4]} isLeaking={!points.find(p => p.id === 'bathroom')?.found} />
              <GardenModel position={[0, 0, 6]} isLeaking={!points.find(p => p.id === 'garden')?.found} />
              <WaterTankModel position={[0, 6, -4]} isLeaking={!points.find(p => p.id === 'tank')?.found} />
              {points.map(p => <Hotspot key={p.id} data={p} onSelect={() => setSelectedId(p.id)} />)}
            </group>
            <Environment preset="apartment" />
            <ContactShadows position={[0, -1.45, 0]} opacity={0.6} scale={30} blur={2} far={10} color="#1e293b" />
          </Suspense>
        </Canvas>



        {measuring && (
          <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] border border-slate-100 text-center scale-110">
              <div className="relative w-32 h-32 mx-auto mb-8">
                <svg className="w-full h-full rotate-[-90deg]">
                  <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                  <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-blue-600 transition-all duration-300" strokeDasharray={377} strokeDashoffset={377 - (377 * measurementProgress) / 100} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Droplets className="w-8 h-8 text-blue-600 animate-bounce" />
                </div>
              </div>
              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-2">Analyzing Flow Rate</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Collecting volumetric data...</p>
            </div>
          </div>
        )}

        {/* HUD: Controls/Guide */}
        <div className="absolute bottom-10 left-10 z-10 flex gap-4">
          <div className="px-6 py-4 bg-slate-900/10 backdrop-blur-xl rounded-2xl border border-slate-200 flex items-center gap-4 group hover:bg-slate-900/20 transition-all">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
              <RotateCcw size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Navigation</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Rotate & Zoom</span>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-slate-900/10 backdrop-blur-xl rounded-2xl border border-slate-200 flex items-center gap-4 group hover:bg-slate-900/20 transition-all">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <MapPin size={20} className="text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Audit</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Click Red Hotspots</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[480px] bg-white flex flex-col p-12 gap-10 overflow-y-auto no-scrollbar">
        {/* HEADER BLOCK */}
        <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <Wrench className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] block mb-1">Audit Protocol V2.0</span>
              <h2 className="text-3xl font-black text-blue-400 uppercase tracking-tighter italic">Campus Diagnostics</h2>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Facility Log</h3>
            <div className="p-4 bg-slate-50 rounded-2xl text-slate-300"><Activity size={24} /></div>
          </div>

          <div className="space-y-4">
            {points.filter(p => p.found).map(p => (
              <div key={p.id} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-start gap-6 shadow-sm">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm"><CheckCircle2 size={28} /></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-black uppercase text-slate-900">{p.name}</h4>
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Recovered</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 mb-3">Diagnostic: {p.type}</p>
                  <div className="flex justify-between items-center border-t border-slate-200 pt-3 text-[9px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Total Recovery</span>
                    <span className="text-blue-600">{(p.benchmarkFlow * 60 * 24).toFixed(0)} L/Day</span>
                  </div>
                </div>
              </div>
            ))}
            {foundCount === 0 && (
              <div className="py-20 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <Eye className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Scan Campus for anomalies</p>
              </div>
            )}
          </div>
        </div>

        {selectedData && !selectedData.found && (
          <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl animate-in slide-in-from-bottom-8 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  {selectedData.measured ? <ShieldCheck className="w-8 h-8 text-white" /> : <Droplets className="w-8 h-8 text-white" />}
                </div>
                <div>
                  <h4 className="text-xl font-black uppercase tracking-tighter leading-none mb-1">{selectedData.name}</h4>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">{selectedData.measured ? 'Data Verified' : 'Awaiting Diagnostic'}</span>
                </div>
              </div>
              
              {!selectedData.measured ? (
                <button 
                  onClick={() => handleMeasure(selectedData.id)}
                  className="w-full bg-white text-slate-900 font-black py-6 rounded-2xl hover:bg-blue-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em]"
                >
                  Measure Flow Rate <Activity className="w-4 h-4" />
                </button>
              ) : (
                <div className="space-y-8">
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="flex justify-between mb-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Measured Rate</span>
                      <span className="text-xl font-black text-blue-400">{selectedData.benchmarkFlow} L/M</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 animate-pulse" style={{ width: `${(selectedData.benchmarkFlow / 15) * 100}%` }} />
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRepair(selectedData.id)}
                    className="w-full bg-blue-600 text-white font-black py-6 rounded-2xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em]"
                  >
                    Log Repair Action <Wrench className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          </div>
        )}

        <div className="mt-auto space-y-6 pt-10">
          <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Net Potential recovery</span>
              <div className="text-4xl font-black text-slate-900 tracking-tighter italic">{totalWastage.toFixed(0)} <span className="text-lg not-italic text-slate-400">LPD</span></div>
            </div>
            <div className="h-3 w-full bg-white rounded-full overflow-hidden border border-slate-200 p-1">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(37,99,235,0.4)]" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <button 
            onClick={() => router.push('/chapters/the-power-of-data')}
            disabled={foundCount < AUDIT_POINTS.length}
            className={`w-full py-7 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center justify-center gap-4 ${
              foundCount < AUDIT_POINTS.length ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50' : 'bg-slate-900 text-white hover:bg-blue-600 hover:scale-[1.02] shadow-slate-200'
            }`}
          >
            FINALISE AUDIT DATA <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Completion Mastery Overlay */}
      {foundCount === AUDIT_POINTS.length && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl flex items-center justify-center p-12 z-50 animate-in fade-in zoom-in duration-700">
          <div className="text-center max-w-xl">
            <div className="w-32 h-32 bg-blue-600 rounded-[3rem] flex items-center justify-center mb-10 mx-auto shadow-[0_0_80px_rgba(37,99,235,0.6)] border-8 border-white/10">
              <ShieldCheck size={64} className="text-white" />
            </div>
            <h2 className="text-6xl font-black text-white mb-6 tracking-tighter uppercase leading-none italic">Audit Finalised</h2>
            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/10 mb-12 text-left space-y-8">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Campus Water Balance</span>
                <span className="px-3 py-1 bg-blue-600 text-[10px] font-black text-white rounded-full">OPTIMIZED</span>
              </div>
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Daily Wastage Prevented</p>
                  <p className="text-4xl font-black text-emerald-400 italic tracking-tighter">{totalWastage.toFixed(0)}L</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Audit Accuracy Score</p>
                  <p className="text-4xl font-black text-blue-400 italic tracking-tighter">98.4%</p>
                </div>
              </div>
              <p className="text-slate-400 font-medium text-sm leading-relaxed italic border-l-2 border-white/10 pl-6">
                "Your systematic diagnostic of the school facilities has identified the critical 20% of leak points responsible for 80% of total water loss."
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <button onClick={() => router.push('/chapters/the-power-of-data')} className="flex-1 py-6 bg-white text-slate-900 font-black rounded-2xl transition-all shadow-2xl hover:bg-blue-600 hover:text-white active:scale-95 text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">Proceed to Analysis <ArrowRight className="w-4 h-4" /></button>
              <button onClick={() => setPoints(AUDIT_POINTS)} className="px-10 py-6 bg-white/5 text-slate-500 font-black rounded-2xl transition-all hover:bg-white/10 text-[10px] uppercase tracking-widest">Reset Scan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
