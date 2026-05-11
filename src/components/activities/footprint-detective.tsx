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
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <Text
            position={[0.3, 0, 0]}
            fontSize={0.1}
            color="#ffffff"
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

const BENCHMARKS = {
  RURAL: 55,
  URBAN: 135,
  AVERAGE_INDIA: 150
};

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
    if (totalLiters <= BENCHMARKS.RURAL) return { color: "text-emerald-500", bg: "bg-emerald-500", label: "Water Hero (Rural Target)", icon: <ShieldCheck /> };
    if (totalLiters <= BENCHMARKS.URBAN) return { color: "text-blue-500", bg: "bg-blue-500", label: "Water Conscious (Urban Target)", icon: <Droplets /> };
    return { color: "text-rose-500", bg: "bg-rose-500", label: "High Impact (Exceeds Targets)", icon: <AlertCircle /> };
  };

  const status = getStatus();

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[650px]">
        
        {/* 3D Visualization */}
        <div className="lg:col-span-7 bg-slate-900 rounded-[3rem] relative overflow-hidden shadow-2xl border border-slate-800">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={35} />
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
          <div className="absolute top-10 left-10 flex flex-col gap-4">
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-3">
              <Droplets className="text-blue-400" size={18} />
              <span className="text-white font-black text-[10px] tracking-widest uppercase">Consumption Analysis</span>
            </div>
            
            <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] block mb-2">Calculated daily Use</span>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-white tabular-nums tracking-tighter">{totalLiters.toFixed(1)}</span>
                <span className="text-blue-400 font-black text-2xl uppercase italic">Litres</span>
              </div>
            </div>
          </div>

          {/* Benchmark Comparison Tooltip */}
          <div className="absolute bottom-10 left-10 right-10">
            <div className="bg-black/60 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[9px] font-black text-white uppercase tracking-widest">JJM Benchmark Comparison</span>
                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${status.bg} text-white`}>{status.label}</span>
              </div>
              <div className="space-y-4">
                {/* Rural Target */}
                <div>
                  <div className="flex justify-between mb-1 text-[8px] font-bold uppercase tracking-widest text-slate-400">
                    <span>Rural Target (JJM)</span>
                    <span>55L</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (totalLiters / 55) * 100)}%`, opacity: totalLiters > 55 ? 0.3 : 1 }} />
                  </div>
                </div>
                {/* Urban Target */}
                <div>
                  <div className="flex justify-between mb-1 text-[8px] font-bold uppercase tracking-widest text-slate-400">
                    <span>Urban Target (CPHEEO)</span>
                    <span>135L</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (totalLiters / 135) * 100)}%`, opacity: totalLiters > 135 ? 0.3 : 1 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto max-h-[650px] no-scrollbar">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                  <Search size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Habit Scanner</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audit your daily water usage</p>
                </div>
              </div>
              <button 
                onClick={() => setSelections({})} 
                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {HABITS.map((habit) => (
                <div key={habit.id} className="group flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm grayscale group-hover:grayscale-0 transition-all">
                      {habit.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 mb-1">{habit.label}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${
                          habit.category === "Wastage" ? "bg-rose-50 text-rose-500" : habit.category === "Savings" ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500"
                        }`}>
                          {habit.category}
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{habit.liters}L/Use</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => updateCount(habit.id, -1)}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-black text-slate-900 tabular-nums">{selections[habit.id] || 0}</span>
                    <button 
                      onClick={() => updateCount(habit.id, 1)}
                      className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col gap-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
                  <Zap className="text-white" size={28} />
                </div>
                <div>
                  <h4 className="font-black text-xl text-white uppercase tracking-tighter mb-1">Strategic Goal</h4>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                    Aim for <span className="text-emerald-400 font-black">55L</span> (Rural) or <span className="text-blue-400 font-black">135L</span> (Urban) targets.
                  </p>
                </div>
              </div>

              <button className="w-full h-16 bg-white/5 hover:bg-white text-white hover:text-slate-900 rounded-2xl flex items-center justify-center gap-4 font-black transition-all group border border-white/10 uppercase tracking-widest text-[10px]">
                Generate Footprint Report
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}
