'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
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
  Sparkles
} from '@react-three/drei';
import * as THREE from 'three';
import { Droplets, Timer, Trash2, Play, Pause, ChevronRight, Activity, Beaker, CheckCircle2, ShieldCheck, Thermometer, Waves } from 'lucide-react';

function WaterLevel({ height }: { height: number }) {
  const mesh = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.scale.set(1, height, 1);
      mesh.current.position.y = (height * 2) / 2 - 1;
    }
  });

  return (
    <mesh ref={mesh} position={[0, -1, 0]}>
      <cylinderGeometry args={[1, 1, 2, 32]} />
      <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} metalness={0.2} roughness={0.1} />
    </mesh>
  );
}

function Bucket() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[1.05, 1.05, 2.1, 32]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.2} metalness={0.5} roughness={0.1} side={THREE.BackSide} />
      </mesh>
      <Cylinder args={[1.1, 1.1, 0.05]} position={[0, -1.05, 0]}>
        <meshStandardMaterial color="#cbd5e1" />
      </Cylinder>
      {/* Measurements */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((y, i) => (
        <group key={i} position={[1.1, y, 0]}>
          <Box args={[0.1, 0.02, 0.1]}>
            <meshStandardMaterial color="#94a3b8" />
          </Box>
        </group>
      ))}
    </group>
  );
}

export function BucketLab() {
  const [level, setLevel] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [history, setHistory] = useState<{ time: string, volume: string, rate: string }[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsed(prev => prev + 0.1);
        setLevel(prev => Math.min(1, prev + 0.005));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const flowRate = useMemo(() => {
    if (elapsed === 0) return "0.00";
    return ((level * 10) / elapsed).toFixed(2);
  }, [level, elapsed]);

  const handleCapture = () => {
    setHistory(prev => [
      { time: elapsed.toFixed(1) + 's', volume: (level * 10).toFixed(1) + 'L', rate: flowRate + ' L/s' },
      ...prev.slice(0, 4)
    ]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setLevel(0);
    setElapsed(0);
  };

  return (
    <div className="w-full h-[750px] bg-slate-50 rounded-[3.5rem] overflow-hidden relative border-[12px] border-white shadow-[0_50px_100px_rgba(0,0,0,0.1)]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[5, 4, 8]} fov={35} />
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />
        
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" castShadow />
        <Environment preset="studio" />

        <group position={[0, -1, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </mesh>
          <Bucket />
          <WaterLevel height={level} />
          
          <group position={[0, 4, 0]}>
            <Cylinder args={[0.1, 0.1, 1]}>
              <meshStandardMaterial color="#94a3b8" />
            </Cylinder>
            {isRunning && (
              <Sparkles count={20} scale={[0.2, 4, 0.2]} size={2} speed={2} color="#3b82f6" />
            )}
          </group>
        </group>

        <ContactShadows position={[0, -0.99, 0]} opacity={0.2} scale={15} blur={3} far={4} />
      </Canvas>

      {/* UI: Light Lab HUD */}
      <div className="absolute top-8 left-8 bottom-8 w-80 pointer-events-none flex flex-col gap-6">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-slate-900 pointer-events-auto border-t-4 border-t-blue-500">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Beaker className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xs font-black tracking-widest uppercase leading-none text-slate-400">Flow Lab</h2>
              <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">Precision Measurement</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Volume</span>
              <span className="text-2xl font-black text-blue-600 tabular-nums">{(level * 10).toFixed(1)} <span className="text-[10px]">L</span></span>
            </div>
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Duration</span>
              <span className="text-2xl font-black text-blue-600 tabular-nums">{elapsed.toFixed(1)} <span className="text-[10px]">S</span></span>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 py-5 rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${
                isRunning ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-900 text-white hover:bg-blue-600'
              }`}
            >
              {isRunning ? <><Pause className="w-4 h-4" /> STOP</> : <><Play className="w-4 h-4" /> START</>}
            </button>
            <button 
              onClick={handleReset}
              className="w-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-slate-900 pointer-events-auto flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capture History</span>
            </div>
            <button onClick={handleCapture} className="text-[8px] font-black text-blue-600 uppercase tracking-widest hover:underline">Log Current</button>
          </div>
          
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-in slide-in-from-left duration-300">
                <span className="text-[10px] font-black text-slate-900">{h.volume}</span>
                <span className="text-[9px] font-bold text-slate-400">{h.time}</span>
                <span className="text-[10px] font-black text-blue-600">{h.rate}</span>
              </div>
            ))}
            {history.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-10 opacity-30 text-center">
                <Waves className="w-10 h-10 mb-4" />
                <p className="text-[9px] font-black uppercase tracking-widest">No Data Logged</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 pointer-events-none">
        <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-2xl flex items-center gap-8 border border-white/10">
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Flow Velocity</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-blue-400">{flowRate}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase">L/S</span>
            </div>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Confidence</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-green-400">98.4</span>
              <span className="text-[10px] font-black text-slate-400 uppercase">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
