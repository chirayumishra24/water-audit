"use client";

import React, { useState, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
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
  Waves,
  ChevronRight,
  Target,
  Activity,
  ArrowRight,
  Info
} from "lucide-react";
import * as THREE from "three";

// --- 3D Components ---

function BuildingModel({ position, color, type }: { position: [number, number, number], color: string, type: 'house' | 'apartment' }) {
  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={position}>
        <mesh castShadow position={[0, type === 'house' ? 0.3 : 0.8, 0]}>
          <boxGeometry args={[0.6, type === 'house' ? 0.6 : 1.6, 0.6]} />
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.2} />
        </mesh>
        <mesh castShadow position={[0, type === 'house' ? 0.7 : 1.7, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.5, 0.4, 4]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>
    </Float>
  );
}

function CityEnvironment({ population, lifestyle }: { population: number, lifestyle: string }) {
  const buildingCount = Math.floor(population / 8);
  const buildings = useMemo(() => {
    const seed = lifestyle === 'Luxury' ? 0.8 : lifestyle === 'Balanced' ? 0.5 : 0.2;
    return Array.from({ length: Math.min(buildingCount, 80) }).map((_, i) => ({
      id: i,
      pos: [
        (Math.random() - 0.5) * 12,
        0,
        (Math.random() - 0.5) * 12
      ] as [number, number, number],
      type: Math.random() > (1 - seed) ? 'apartment' : 'house' as 'apartment' | 'house',
      color: ["#f8fafc", "#f1f5f9", "#e2e8f0", "#94a3b8"][Math.floor(Math.random() * 4)]
    }));
  }, [buildingCount, lifestyle]);

  return (
    <group>
      {/* City Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f8fafc" roughness={1} />
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
        position={[0, 0, 0]}
      />

      {buildings.map((b) => (
        <BuildingModel key={b.id} position={b.pos} color={b.color} type={b.type} />
      ))}

      {/* Central Reservoir */}
      <group position={[0, 0, 0]}>
        <mesh castShadow position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 2.5, 16]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh castShadow position={[0, 2.5, 0]}>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.1} emissive="#1d4ed8" emissiveIntensity={0.2} />
        </mesh>
        <Html position={[0, 3.8, 0]} center distanceFactor={8}>
          <div className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-2xl border border-white/20">
            Main Reservoir
          </div>
        </Html>
      </group>
    </group>
  );
}

// --- Main Activity ---

export function CommunityGrowth() {
  const [population, setPopulation] = useState(250);
  const [lifestyle, setLifestyle] = useState("Balanced");
  const [supplyLimit] = useState(60000); // kL/day baseline
  
  const factors: Record<string, number> = {
    "Conservative": 120,
    "Balanced": 150,
    "Luxury": 280
  };

  const demand = population * factors[lifestyle];
  const stress = Math.min(demand / supplyLimit, 1.2);
  const isStressed = stress > 0.9;

  const reset = () => {
    setPopulation(250);
    setLifestyle("Balanced");
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[750px] bg-white rounded-[3.5rem] overflow-hidden border border-slate-200 shadow-2xl relative">
      {/* LEFT: 3D CITY PANEL */}
      <div className="relative flex-1 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 overflow-hidden min-h-[450px]">
        {/* Dynamic Warning Overlay */}
        {isStressed && (
          <div className="absolute inset-0 bg-red-600/5 animate-pulse pointer-events-none z-10" />
        )}

        <Canvas shadows className="w-full h-full">
          <PerspectiveCamera makeDefault position={[12, 12, 12]} fov={45} />
          <OrbitControls 
            enablePan={true} 
            minDistance={8} 
            maxDistance={25}
            maxPolarAngle={Math.PI / 2.1}
          />
          
          <ambientLight intensity={1.5} />
          <spotLight position={[20, 30, 20]} intensity={1000} castShadow />
          
          <Suspense fallback={null}>
            <CityEnvironment population={population} lifestyle={lifestyle} />
            <Environment preset="city" />
            <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={25} blur={2.5} far={10} color="#000000" />
          </Suspense>
        </Canvas>

        {/* HUD Elements */}
        <div className="absolute top-10 left-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Simulator</span>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Urban Demand</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 pointer-events-none">
          <div className={`backdrop-blur-md px-6 py-3 rounded-full border flex items-center gap-3 transition-all duration-500 ${
            isStressed ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-600/10 border-blue-500/20 text-blue-500'
          }`}>
            <Activity className={`w-4 h-4 ${isStressed ? 'animate-bounce' : 'animate-pulse'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {isStressed ? 'System Stress: Critical' : 'Demand Monitoring Active'}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: CONFIGURATION PANEL */}
      <div className="w-full lg:w-[450px] bg-white flex flex-col p-12 gap-10 overflow-y-auto no-scrollbar">
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Growth Engine</h3>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <TrendingUp className="w-5 h-5 text-slate-300" />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Population Size</span>
                  <div className="text-3xl font-black text-slate-900 tracking-tighter">{population} <span className="text-xs uppercase text-slate-400">Residents</span></div>
                </div>
                <Users className="w-6 h-6 text-slate-200 mb-1" />
              </div>
              <input 
                type="range" 
                min="50" 
                max="1000" 
                step="50"
                value={population}
                onChange={(e) => setPopulation(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Lifestyle Profile</span>
              <div className="grid grid-cols-1 gap-2">
                {["Conservative", "Balanced", "Luxury"].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLifestyle(l)}
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                      lifestyle === l 
                        ? "bg-blue-600 border-blue-600 text-white shadow-xl translate-x-2" 
                        : "bg-white border-slate-100 text-slate-500 hover:border-blue-100 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-widest">{l}</span>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-bold ${lifestyle === l ? 'text-blue-100' : 'text-slate-400'}`}>
                        {factors[l]} LPCD
                      </span>
                      <ChevronRight className={`w-4 h-4 ${lifestyle === l ? 'text-white' : 'text-slate-200'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis Dashboard */}
          <div className={`p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden ${
            isStressed ? 'bg-red-50 border-red-100 text-red-900' : 'bg-blue-50 border-blue-100 text-blue-900'
          }`}>
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black opacity-60 uppercase tracking-widest block mb-2">Projected Demand</span>
                <div className="text-4xl font-black tracking-tighter">
                  {(demand / 1000).toFixed(1)} <span className="text-sm uppercase opacity-60">m³/d</span>
                </div>
              </div>
              <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-xl ${
                isStressed ? 'bg-red-600 text-white shadow-red-200' : 'bg-blue-600 text-white shadow-blue-200'
              }`}>
                {isStressed ? <AlertCircle className="w-8 h-8" /> : <Droplets className="w-8 h-8" />}
              </div>
            </div>
            <div className="mt-8 h-2 w-full bg-black/5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${isStressed ? 'bg-red-600' : 'bg-blue-600'}`} 
                style={{ width: `${Math.min((demand / supplyLimit) * 100, 100)}%` }} 
              />
            </div>
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest opacity-60">
              {isStressed ? 'CRITICAL: Supply capacity exceeded' : 'SAFE: Within infrastructure limits'}
            </p>
          </div>
        </div>

        <div className="mt-auto space-y-6">
          <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              Use this model to predict how population growth and changing lifestyle habits impact municipal water infrastructure.
            </p>
          </div>

          <div className="flex gap-4">
            <button onClick={reset} className="flex-1 py-5 bg-white border border-slate-200 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-all flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button className="flex-[2] py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3">
              Generate Report <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
