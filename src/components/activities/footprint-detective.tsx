"use client";

import React, { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  Float,
  RoundedBox,
  Text,
  Html,
} from "@react-three/drei";
import { 
  Search, 
  Droplets, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Zap,
  ShieldCheck
} from "lucide-react";
import * as THREE from "three";

// --- 3D Components ---

function WaterTank({ liters }: { liters: number }) {
  // Max capacity 150L for visualization
  const height = Math.min(liters / 150, 1) * 2;
  
  return (
    <group position={[0, -1, 0]}>
      {/* Tank Glass */}
      <mesh>
        <cylinderGeometry args={[1, 1, 2, 32]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.1} 
          roughness={0} 
          metalness={0.1}
          side={THREE.DoubleSide} 
        />
      </mesh>
      
      {/* Water Fill */}
      {liters > 0 && (
        <mesh position={[0, height / 2, 0]}>
          <cylinderGeometry args={[0.98, 0.98, height, 32]} />
          <meshStandardMaterial 
            color="#0ea5e9" 
            transparent 
            opacity={0.6} 
            roughness={0.1}
            metalness={0.2}
          />
        </mesh>
      )}

      {/* Measurement Markers */}
      {[50, 100, 150].map((l) => (
        <group key={l} position={[1.1, (l / 150) * 2, 0]}>
          <mesh>
            <boxGeometry args={[0.1, 0.02, 0.02]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          <Text
            position={[0.3, 0, 0]}
            fontSize={0.1}
            color="#94a3b8"
            anchorX="left"
          >
            {l}L
          </Text>
        </group>
      ))}
    </group>
  );
}

// --- Main Component ---

const HABITS = [
  { id: "shower", label: "5-Min Shower", liters: 45, icon: "🚿", category: "Wastage" },
  { id: "tap", label: "Running Tap (5m)", liters: 45, icon: "🚰", category: "Wastage" },
  { id: "bucket", label: "Bucket Bath", liters: 10, icon: "🪣", category: "Standard" },
  { id: "mug", label: "Mug for Brushing", liters: 0.5, icon: "☕", category: "Savings" },
  { id: "flush", label: "Full Flush", liters: 9, icon: "🚽", category: "Standard" },
  { id: "leak", label: "Dripping Tap (Day)", liters: 15, icon: "💧", category: "Wastage" },
];

export function FootprintDetective() {
  const [selections, setSelections] = useState<Record<string, number>>({
    shower: 1,
    tap: 0,
    bucket: 0,
    mug: 2,
    flush: 3,
    leak: 0,
  });

  const totalLiters = useMemo(() => {
    return Object.entries(selections).reduce((acc, [id, count]) => {
      const habit = HABITS.find(h => h.id === id);
      return acc + (habit ? habit.liters * count : 0);
    }, 0);
  }, [selections]);

  const updateCount = (id: string, delta: number) => {
    setSelections(prev => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta)
    }));
  };

  const getStatus = () => {
    if (totalLiters < 55) return { color: "text-emerald-500", label: "Water Hero", icon: <ShieldCheck /> };
    if (totalLiters < 100) return { color: "text-blue-500", label: "Water Conscious", icon: <Droplets /> };
    return { color: "text-rose-500", label: "High Impact", icon: <AlertCircle /> };
  };

  const status = getStatus();

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        
        {/* 3D Visualization */}
        <div className="lg:col-span-7 bg-slate-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-slate-800">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={35} />
            <OrbitControls enableZoom={false} enablePan={false} />
            
            <ambientLight intensity={0.5} />
            <pointLight position={[5, 5, 5]} intensity={1} />
            
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
              <WaterTank liters={totalLiters} />
            </Float>

            <Environment preset="city" />
            <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} />
          </Canvas>

          {/* HUD */}
          <div className="absolute top-8 left-8 flex flex-col gap-4">
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-3">
              <Droplets className="text-blue-400" size={18} />
              <span className="text-white font-black text-sm tracking-widest uppercase">Live Footprint</span>
            </div>
            
            <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] block mb-1">Estimated Daily Use</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white tabular-nums">{totalLiters.toFixed(1)}</span>
                <span className="text-blue-400 font-black text-xl">L</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 right-8">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 ${status.color}`}>
              {status.icon}
              <span className="text-xs font-black uppercase tracking-widest">{status.label}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto max-h-[600px] no-scrollbar">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <Search size={20} />
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Habit Tracker</h3>
              </div>
              <button 
                onClick={() => setSelections({})} 
                className="text-slate-400 hover:text-rose-500 transition-colors"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {HABITS.map((habit) => (
                <div key={habit.id} className="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{habit.icon}</span>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 leading-none mb-1">{habit.label}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{habit.liters}L per use</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateCount(habit.id, -1)}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-black text-slate-900">{selections[habit.id] || 0}</span>
                    <button 
                      onClick={() => updateCount(habit.id, 1)}
                      className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-2xl">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <h4 className="font-black text-white uppercase tracking-tight">The Challenge</h4>
                <p className="text-xs text-slate-400 font-medium">Keep your footprint under <span className="text-emerald-400 font-black">55L</span> (Rural Target) or <span className="text-blue-400 font-black">135L</span> (Urban Target).</p>
              </div>
            </div>

            <button className="w-full h-14 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl flex items-center justify-center gap-3 font-black transition-all group">
              Download Footprint Report
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
