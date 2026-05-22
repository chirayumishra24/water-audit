'use client';

import React, { useState, useRef, useMemo, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Text, 
  Html, 
  Box,
  Cylinder,
  Plane,
  Environment,
  ContactShadows,
  RoundedBox,
  Float,
  Sparkles,
  Grid
} from '@react-three/drei';
import * as THREE from 'three';
import { 
  Droplets, 
  Timer, 
  Trash2, 
  Play, 
  Pause, 
  ChevronRight, 
  Activity, 
  Beaker, 
  CheckCircle2, 
  ShieldCheck, 
  Thermometer, 
  Waves,
  Zap,
  RotateCcw,
  Settings,
  ArrowRight,
  ClipboardList
} from 'lucide-react';

function WaterLevel({ height }: { height: number }) {
  const mesh = useRef<THREE.Mesh>(null!);
  
  useFrame(() => {
    if (mesh.current) {
      mesh.current.scale.set(1, height, 1);
      mesh.current.position.y = (height * 2) / 2 - 1;
    }
  });

  return (
    <mesh ref={mesh} position={[0, -1, 0]}>
      <cylinderGeometry args={[0.97, 0.97, 2, 64]} />
      <meshStandardMaterial 
        color="#3b82f6" 
        transparent 
        opacity={0.6} 
        metalness={0.5} 
        roughness={0.1}
        emissive="#1d4ed8"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

function Bucket() {
  return (
    <group>
      {/* Outer Shell - Cylinder */}
      <mesh>
        <cylinderGeometry args={[1.0, 1.0, 2.1, 64]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.2} 
          metalness={0.9} 
          roughness={0.05} 
          side={THREE.DoubleSide} 
        />
      </mesh>
      {/* Inner Wall */}
      <mesh scale={[0.98, 1, 0.98]}>
        <cylinderGeometry args={[1.0, 1.0, 2.05, 64]} />
        <meshStandardMaterial 
          color="#f8fafc" 
          transparent 
          opacity={0.1} 
          metalness={0.2} 
          roughness={0.8} 
        />
      </mesh>
      {/* Base */}
      <Cylinder args={[1.0, 1.0, 0.1]} position={[0, -1.05, 0]}>
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </Cylinder>
      {/* Measurement Markers */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          <mesh rotation={[0, (i * Math.PI) / 2, 0]} position={[0.98, 0, 0]}>
            <boxGeometry args={[0.2, 0.01, 0.05]} />
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
          </mesh>
          <Html position={[1.3, 0, 0]} center>
            <span className="text-[8px] font-black text-slate-400">{(i + 1) * 2}L</span>
          </Html>
        </group>
      ))}
    </group>
  );
}

export function BucketLab() {
  const router = useRouter();
  const [level, setLevel] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [pressure, setPressure] = useState(0.5); // 0.1 to 1.0
  const [elapsed, setElapsed] = useState(0);
  const [history, setHistory] = useState<{ time: string, volume: string, rate: string, status: string }[]>([]);

  // Simulation Physics: 1.0 level = 10L. 
  // Max flow rate is 15 L/min at 1.0 pressure.
  const activeFlowLMin = useMemo(() => pressure * 15, [pressure]);
  const efficiencyStatus = useMemo(() => {
    if (activeFlowLMin <= 6) return { label: 'ECO-EFFICIENT', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    if (activeFlowLMin <= 10) return { label: 'STANDARD FLOW', color: 'text-blue-500', bg: 'bg-blue-500/10' };
    return { label: 'WASTEFUL FLOW', color: 'text-rose-500', bg: 'bg-rose-500/10' };
  }, [activeFlowLMin]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsed(prev => prev + 0.1);
        const litersPerSecond = activeFlowLMin / 60;
        const litersInTick = litersPerSecond * 0.1;
        setLevel(prev => Math.min(1, prev + (litersInTick / 10)));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeFlowLMin]);

  useEffect(() => {
    if (level >= 1 && isRunning) {
      setIsRunning(false);
    }
  }, [level, isRunning]);

  const flowRateDisplay = useMemo(() => activeFlowLMin.toFixed(1), [activeFlowLMin]);

  const handleCapture = () => {
    setHistory(prev => [
      { 
        time: elapsed.toFixed(1) + 's', 
        volume: (level * 10).toFixed(1) + 'L', 
        rate: flowRateDisplay + ' L/min',
        status: efficiencyStatus.label
      },
      ...prev.slice(0, 4)
    ]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setLevel(0);
    setElapsed(0);
  };

  const handlePrint = () => {
    document.body.classList.add('printing-activity');
    window.print();
    document.body.classList.remove('printing-activity');
  };

  return (
    <div className="activity-print-target flex flex-col lg:flex-row w-full bg-white rounded-[3.5rem] overflow-hidden border border-slate-200 shadow-2xl relative lg:aspect-[16/9]">
      {/* Print Header - Only visible in PDF/Print */}
      <div className="hidden print:block w-full mb-8 border-b-2 border-slate-900 pb-6">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Water Flow Analysis Report</h1>
        <div className="flex justify-between mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>Experiment: Bucket Lab Telemetry</span>
          <span>Date: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* LEFT: 3D CITY PANEL */}
      <div className="relative flex-1 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 overflow-hidden print:h-[400px]">
        <Canvas shadows className="w-full h-full" gl={{ preserveDrawingBuffer: true }}>
          <PerspectiveCamera makeDefault position={[5, 4, 8]} fov={30} />
          <OrbitControls 
            makeDefault 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2.2}
            minDistance={5}
            maxDistance={15}
          />
          
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" castShadow />
          <Environment preset="studio" />

          <group position={[0, -1, 0]}>
            <Grid
              infiniteGrid
              fadeDistance={30}
              fadeStrength={5}
              cellSize={1}
              sectionSize={5}
              sectionThickness={1.5}
              sectionColor="#3b82f6"
              cellColor="#e2e8f0"
            />
            
            <Bucket />
            <WaterLevel height={level} />
            
            {/* Professional Tap Model */}
            <group position={[0, 4, 0]}>
              <mesh position={[1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.15, 0.15, 2, 32]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
              </mesh>
              <mesh position={[0, -0.2, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 0.5, 32]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
              </mesh>
              {/* Valve Handle - Rotates with pressure */}
              <mesh 
                position={[1, 0.2, 0]} 
                rotation={[Math.PI / 2 + (pressure * Math.PI), 0, 0]}
              >
                <torusGeometry args={[0.2, 0.05, 16, 32]} />
                <meshStandardMaterial color={pressure > 0.7 ? "#ef4444" : "#3b82f6"} metalness={0.5} roughness={0.5} />
              </mesh>
              
              {isRunning && (
                <group>
                  <Sparkles count={Math.floor(pressure * 100)} scale={[0.1 * pressure, 4, 0.1 * pressure]} size={2} speed={3} color="#3b82f6" />
                  <mesh position={[0, -2, 0]}>
                    <cylinderGeometry args={[0.04 + (pressure * 0.08), 0.08 + (pressure * 0.12), 4, 16]} />
                    <meshStandardMaterial 
                      color="#60a5fa" 
                      transparent 
                      opacity={0.6} 
                      emissive="#3b82f6"
                      emissiveIntensity={0.5}
                    />
                  </mesh>
                  {/* Splash effect at water level */}
                  <mesh position={[0, -4 + (level * 2), 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.1, 0.2 + (pressure * 0.4), 32]} />
                    <meshStandardMaterial color="#93c5fd" transparent opacity={0.4} />
                  </mesh>
                </group>
              )}
            </group>
          </group>

          <ContactShadows position={[0, -0.99, 0]} opacity={0.3} scale={20} blur={2.5} far={10} color="#000000" />
        </Canvas>

        {/* HUD Elements */}
        <div className="absolute top-10 left-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Beaker className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[8px] font-black text-white/60 uppercase tracking-widest block">Simulator</span>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Water Flow Lab</h2>
              </div>
            </div>
          </div>
        </div>

        {/* HUD: Controls/Guide */}
        <div className="absolute bottom-10 left-10 z-10 flex gap-4 no-print">
          <div className="px-6 py-4 bg-slate-900/10 backdrop-blur-xl rounded-2xl border border-slate-200 flex items-center gap-4 group hover:bg-slate-900/20 transition-all">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
              <RotateCcw size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Navigation</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Rotate View</span>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-slate-900/10 backdrop-blur-xl rounded-2xl border border-slate-200 flex items-center gap-4 group hover:bg-slate-900/20 transition-all">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Timer size={20} className="text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Guide</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Adjust Valve & Log Data</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 pointer-events-none">
          <div className="flex items-center gap-4">
            <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-[2rem] border border-slate-200 shadow-xl flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Volume</span>
                <span className="text-2xl font-black text-blue-600 tabular-nums">{(level * 10).toFixed(1)} <span className="text-[10px]">L</span></span>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Efficiency Status</span>
                <span className={`text-xs font-black uppercase tracking-wider ${efficiencyStatus.color}`}>{efficiencyStatus.label}</span>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Elapsed Time</span>
                <span className="text-2xl font-black text-blue-600 tabular-nums">{elapsed.toFixed(1)} <span className="text-[10px]">S</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: DATA & ANALYTICS PANEL */}
      <div className="w-full lg:w-[480px] bg-white flex flex-col p-12 gap-10 overflow-y-auto no-scrollbar print:overflow-visible">
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Telemetry History</h3>
            <div className="p-3 bg-slate-50 rounded-2xl text-blue-600 no-print">
              <Settings size={20} />
            </div>
          </div>

            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 no-print">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Timer className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valve Control</span>
              </div>
              <span className={`text-[8px] font-black px-2 py-1 rounded-md ${efficiencyStatus.bg} ${efficiencyStatus.color}`}>
                {activeFlowLMin.toFixed(1)} L/MIN
              </span>
            </div>

            {/* Pressure Slider */}
            <div className="mb-8">
              <input 
                type="range" 
                min="0.1" 
                max="1.0" 
                step="0.05"
                value={pressure}
                onChange={(e) => setPressure(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between mt-2 text-[8px] font-black text-slate-400 uppercase">
                <span>Drip (Low)</span>
                <span>Gush (High)</span>
              </div>
            </div>
            
            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => setIsRunning(!isRunning)}
                className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 no-print cursor-pointer ${
                  isRunning 
                    ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                }`}
              >
                {isRunning ? <><Pause className="w-4 h-4" /> Halt Stream</> : <><Play className="w-4 h-4" /> Initiate Flow</>}
              </button>
              
              <button 
                onClick={handleReset}
                className="w-20 bg-white border border-slate-200 text-slate-400 rounded-[2rem] flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm active:scale-95 no-print cursor-pointer"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>

            <button 
              onClick={handleCapture}
              disabled={!isRunning && level === 0}
              className="w-full py-4 bg-white border border-slate-200 text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed no-print cursor-pointer"
            >
              <ClipboardList className="w-4 h-4" />
              Log Data Point
            </button>
          </div>

          {/* History Panel */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2 no-print">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logged Telemetry</span>
              </div>
              <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">Verified</span>
            </div>

            <div className="space-y-3">
              {history.map((h, i) => (
                <div key={i} className="group flex items-center justify-between p-5 bg-white rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all animate-in slide-in-from-right duration-500">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase">Volume</span>
                    <span className="text-sm font-black text-slate-900">{h.volume}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{h.status}</span>
                    <span className="text-sm font-bold text-slate-400 tabular-nums">{h.time}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-slate-400 uppercase">Rate</span>
                    <span className="text-sm font-black text-blue-600">{h.rate}</span>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200 opacity-40">
                  <Waves className="w-12 h-12 text-slate-300 mb-4" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Awaiting Data Capture</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Dashboard */}
        <div className="mt-auto space-y-6">
          <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Final Stream Flow</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-blue-400 tracking-tighter">{flowRateDisplay}</span>
                  <span className="text-xs text-slate-500 font-black uppercase">L/MIN</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Eco Efficiency</p>
                <div className="flex items-baseline justify-end gap-2">
                  <span className="text-3xl font-black text-emerald-400 tracking-tighter">{((1 - pressure) * 100).toFixed(0)}</span>
                  <span className="text-xs text-slate-500 font-black uppercase">%</span>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>

          <button 
            onClick={handlePrint}
            disabled={history.length === 0}
            className={`w-full flex items-center justify-center gap-3 py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl no-print cursor-pointer ${
              history.length > 0 
                ? 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200 active:scale-95' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            Submit Final Lab Report
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
