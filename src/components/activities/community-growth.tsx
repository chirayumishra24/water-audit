"use client";

import React, { useState, Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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
  Home, 
  Users, 
  Zap, 
  Droplets, 
  AlertCircle, 
  TrendingUp, 
  Trees, 
  Building,
  RotateCcw,
  Waves
} from "lucide-react";
import * as THREE from "three";

// --- 3D Components ---

function House({ position, color, type }: { position: [number, number, number], color: string, type: 'house' | 'apartment' }) {
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position}>
        <mesh castShadow position={[0, type === 'house' ? 0.3 : 0.8, 0]}>
          <boxGeometry args={[0.6, type === 'house' ? 0.6 : 1.6, 0.6]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, type === 'house' ? 0.7 : 1.7, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.5, 0.4, 4]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>
    </Float>
  );
}

function ProceduralCity({ population, lifestyle }: { population: number, lifestyle: string }) {
  const houseCount = Math.floor(population / 10);
  const houses = useMemo(() => {
    return Array.from({ length: Math.min(houseCount, 100) }).map((_, i) => ({
      id: i,
      pos: [
        (Math.random() - 0.5) * 12,
        0,
        (Math.random() - 0.5) * 12
      ] as [number, number, number],
      type: Math.random() > 0.7 ? 'apartment' : 'house' as 'apartment' | 'house',
      color: ["#f8fafc", "#f1f5f9", "#e2e8f0"][Math.floor(Math.random() * 3)]
    }));
  }, [houseCount]);

  return (
    <group>
      {/* City Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
      </mesh>
      <Grid
        infiniteGrid
        fadeDistance={30}
        fadeStrength={5}
        cellSize={1}
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#2563eb"
        cellColor="#94a3b8"
      />

      {houses.map((h) => (
        <House key={h.id} position={h.pos} color={h.color} type={h.type} />
      ))}

      {/* Central Water Tower */}
      <group position={[0, 0, 0]}>
        <mesh castShadow position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 3, 16]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh castShadow position={[0, 3, 0]}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.2} />
        </mesh>
        <Html position={[0, 4, 0]} center>
          <div className="bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-xl">
            Community Storage
          </div>
        </Html>
      </group>
    </group>
  );
}

// --- Main Activity ---

export function CommunityGrowth() {
  const [population, setPopulation] = useState(200);
  const [lifestyle, setLifestyle] = useState("Balanced");
  const [supplyCapacity, setSupplyCapacity] = useState(50000); // L/day
  
  const lifestyleFactors: Record<string, number> = {
    "Conservative": 135,
    "Balanced": 150,
    "Luxury": 250
  };

  const demand = population * lifestyleFactors[lifestyle];
  const stressLevel = Math.min(demand / supplyCapacity, 1.2);
  const isStressed = stressLevel > 0.9;

  const reset = () => {
    setPopulation(200);
    setLifestyle("Balanced");
  };

  return (
    <div className="relative w-full h-[600px] bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
      <Canvas shadows className="w-full h-full">
        <PerspectiveCamera makeDefault position={[12, 12, 12]} fov={50} />
        <OrbitControls 
          enablePan={true} 
          minDistance={5} 
          maxDistance={25}
          maxPolarAngle={Math.PI / 2.1}
        />
        
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 20, 10]} intensity={300} castShadow />
        
        <Suspense fallback={null}>
          <ProceduralCity population={population} lifestyle={lifestyle} />
          <Environment preset="city" />
          <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
          
          {isStressed && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
              <planeGeometry args={[15, 15]} />
              <meshBasicMaterial color="#ef4444" transparent opacity={0.1} />
            </mesh>
          )}
        </Suspense>
      </Canvas>

      {/* TOP HUD: PARAMETERS */}
      <div className="absolute top-6 left-6 right-6 flex items-start justify-between pointer-events-none">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-2xl pointer-events-auto w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tighter">Community Growth Simulator</h2>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                Future Demand Forecaster
              </span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Population</span>
                </div>
                <span className="text-sm font-black text-slate-900">{population}</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="1000" 
                step="50"
                value={population}
                onChange={(e) => setPopulation(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Lifestyle Profile</span>
              <div className="grid grid-cols-3 gap-2">
                {["Conservative", "Balanced", "Luxury"].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLifestyle(l)}
                    className={`px-2 py-3 rounded-xl border text-[10px] font-bold transition-all ${
                      lifestyle === l 
                        ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-400"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pointer-events-auto">
          <div className={`bg-white/80 backdrop-blur-xl p-6 rounded-2xl border shadow-2xl w-48 text-center transition-all ${isStressed ? 'border-red-400 ring-2 ring-red-400/20' : 'border-white'}`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Live Demand</span>
            <div className={`text-2xl font-black ${isStressed ? 'text-red-600' : 'text-blue-600'}`}>
              {(demand / 1000).toFixed(1)}
              <span className="text-xs ml-1 font-bold text-slate-400">m³/day</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${isStressed ? 'bg-red-600' : 'bg-blue-600'}`} 
                style={{ width: `${Math.min((demand / supplyCapacity) * 100, 100)}%` }} 
              />
            </div>
            <span className={`text-[8px] font-black uppercase mt-2 block tracking-widest ${isStressed ? 'text-red-600 animate-pulse' : 'text-slate-400'}`}>
              {isStressed ? "Capacity Exceeded" : "Stable Supply"}
            </span>
          </div>

          <button 
            onClick={reset}
            className="p-4 bg-white/80 backdrop-blur-xl border border-white text-slate-400 rounded-2xl hover:bg-white shadow-xl transition-all active:scale-95 flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* BOTTOM HUD: METRICS */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl">
        <div className="bg-white/80 backdrop-blur-xl px-10 py-8 rounded-[3rem] border border-white shadow-2xl flex items-center gap-16">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Waves className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-black text-slate-900 uppercase">LPCD Standard</span>
              </div>
              <span className="text-sm font-black text-blue-600">{lifestyleFactors[lifestyle]} Liters</span>
            </div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-1000" 
                style={{ width: `${(lifestyleFactors[lifestyle] / 250) * 100}%` }} 
              />
            </div>
            <p className="text-[10px] font-medium text-slate-500 italic">
              Liters Per Capita per Day (LPCD) varies by development type and habits.
            </p>
          </div>

          <div className="w-[1px] h-16 bg-slate-200" />

          <div className="shrink-0 flex flex-col items-center gap-2">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isStressed ? 'bg-red-600 shadow-xl shadow-red-200' : 'bg-green-600 shadow-xl shadow-green-200'}`}>
              {isStressed ? <AlertCircle className="w-6 h-6 text-white" /> : <TrendingUp className="w-6 h-6 text-white" />}
            </div>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">Stress Level</span>
          </div>
        </div>
      </div>

      {/* Floating Info */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none space-y-2">
        <div className="bg-white/40 backdrop-blur-md p-3 rounded-xl border border-white/40 shadow-sm flex items-center gap-3 w-48">
          <Trees className="w-4 h-4 text-green-600" />
          <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Natural Filter Area</span>
        </div>
        <div className="bg-white/40 backdrop-blur-md p-3 rounded-xl border border-white/40 shadow-sm flex items-center gap-3 w-48 opacity-60">
          <Zap className="w-4 h-4 text-amber-600" />
          <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Energy Usage: High</span>
        </div>
      </div>
    </div>
  );
}
