'use client';

import React, { useState, Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows, 
  Html, 
  Grid, 
  Float,
  RoundedBox,
  Box,
  Cylinder
} from '@react-three/drei';
import * as THREE from 'three';
import { 
  CloudRain, 
  Droplets, 
  CheckCircle2, 
  RotateCcw, 
  Info,
  Layers,
  ArrowDown,
  Wind,
  Trees,
  Mountain,
  Zap,
  Waves,
  ArrowRight,
  ShieldCheck,
  Activity,
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react';

// --- 3D Components ---

function TerrainModel({ 
  structures, 
  rainIntensity, 
  isRaining 
}: { 
  structures: string[], 
  rainIntensity: number, 
  isRaining: boolean 
}) {
  const rainRef = useRef<THREE.Group>(null);
  const aquiferRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (isRaining && rainRef.current) {
      rainRef.current.children.forEach((child: any) => {
        child.position.y -= delta * 5 * rainIntensity;
        if (child.position.y < 0) child.position.y = 10;
      });
    }
    
    if (isRaining && aquiferRef.current) {
      const growth = delta * 0.05 * rainIntensity * (structures.length + 1);
      if (aquiferRef.current.scale.y < 2) {
        aquiferRef.current.scale.y += growth;
        aquiferRef.current.position.y += growth * 0.5;
      }
    }
  });

  return (
    <group position={[0, -1.5, 0]}>
      {/* Terrain Base - Cross Section */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[10, 1, 6]} />
        <meshStandardMaterial color="#8b4513" roughness={0.9} />
      </mesh>
      
      {/* Surface Layer */}
      <mesh castShadow receiveShadow position={[0, 1.05, 0]}>
        <boxGeometry args={[10, 0.1, 6]} />
        <meshStandardMaterial color="#22c55e" roughness={0.8} />
      </mesh>

      {/* Aquifer Layer (Blue) */}
      <mesh ref={aquiferRef} position={[0, -0.5, 0]} scale={[1, 0.5, 1]}>
        <boxGeometry args={[10, 1, 6]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} />
      </mesh>

      {/* Structures */}
      {structures.includes("Check Dam") && (
        <group position={[2, 1.1, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.2, 0.4, 4]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        </group>
      )}

      {structures.includes("Recharge Well") && (
        <group position={[-2, 1.1, 0]}>
          <Cylinder args={[0.2, 0.2, 3]} position={[0, -1, 0]}>
            <meshStandardMaterial color="#94a3b8" transparent opacity={0.8} />
          </Cylinder>
          <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.3, 0.05, 16, 32]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>
      )}

      {/* Rain Particles */}
      {isRaining && (
        <group ref={rainRef}>
          {[...Array(100)].map((_, i) => (
            <mesh key={i} position={[(Math.random() - 0.5) * 10, Math.random() * 10, (Math.random() - 0.5) * 6]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#60a5fa" transparent opacity={0.4} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

// --- Main Activity ---

export function GroundwaterSandbox() {
  const [structures, setStructures] = useState<string[]>([]);
  const [isRaining, setIsRaining] = useState(false);
  const [intensity, setIntensity] = useState(1);
  
  const availableStructures = [
    { name: "Check Dam", icon: Mountain, desc: "Slows runoff in streams" },
    { name: "Percolation Tank", icon: Droplets, desc: "Stores runoff for soaking" },
    { name: "Contour Bund", icon: Zap, desc: "Breaks slope flow" },
    { name: "Recharge Well", icon: ArrowDown, desc: "Direct path to aquifer" }
  ];

  const toggleStructure = (name: string) => {
    setStructures(prev => prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]);
  };

  const reset = () => {
    setStructures([]);
    setIsRaining(false);
    setIntensity(1);
  };

  const rechargeRate = isRaining ? (intensity * (structures.length + 1) * 150) : 0;
  const progress = (rechargeRate / 2250) * 100; // Max rate with 4 structures + Torrential

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[750px] bg-white rounded-[3.5rem] overflow-hidden border border-slate-200 shadow-2xl relative">
      {/* LEFT: 3D SIMULATION PANEL */}
      <div className="relative flex-1 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 overflow-hidden min-h-[450px]">
        <Canvas shadows className="w-full h-full">
          <PerspectiveCamera makeDefault position={[12, 12, 12]} fov={35} />
          <OrbitControls 
            enablePan={false}
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
              cellColor="#e2e8f0"
            />
            
            <TerrainModel 
              structures={structures} 
              isRaining={isRaining} 
              rainIntensity={intensity} 
            />
            
            <Environment preset="park" />
            <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={25} blur={2.5} far={10} color="#000000" />
          </Suspense>
        </Canvas>

        {/* HUD Elements */}
        <div className="absolute top-10 left-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Aquifer Simulation</span>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Groundwater Recharge</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 pointer-events-none">
          <div className="bg-blue-600/10 backdrop-blur-md px-6 py-3 rounded-full border border-blue-500/20 text-blue-500 flex items-center gap-3">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {isRaining ? 'Monsoon Active' : 'System Idle - Awaiting Rain'}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: CONTROL PANEL */}
      <div className="w-full lg:w-[450px] bg-white flex flex-col p-12 gap-10 overflow-y-auto no-scrollbar">
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Interventions</h3>
            <div className="p-3 bg-slate-50 rounded-2xl text-blue-600">
              <Layers size={20} />
            </div>
          </div>

          {/* Structure Selection */}
          <div className="space-y-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Augmentation Units</span>
            <div className="grid grid-cols-2 gap-3">
              {availableStructures.map((s) => (
                <button
                  key={s.name}
                  onClick={() => toggleStructure(s.name)}
                  className={`flex flex-col p-5 rounded-[2rem] border transition-all text-left gap-3 group ${
                    structures.includes(s.name) 
                      ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 scale-105" 
                      : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-blue-200 hover:shadow-lg"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    structures.includes(s.name) ? "bg-white/20" : "bg-white shadow-sm group-hover:scale-110 transition-transform"
                  }`}>
                    <s.icon className={structures.includes(s.name) ? "text-white" : "text-blue-600"} size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-tight block">{s.name}</span>
                    <p className={`text-[8px] font-bold mt-1 leading-tight ${structures.includes(s.name) ? "text-blue-100" : "text-slate-400"}`}>
                      {s.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Intensity Control */}
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CloudRain className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monsoon Intensity</span>
              </div>
              <span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase ${
                intensity === 1 ? 'bg-blue-100 text-blue-600' :
                intensity === 2 ? 'bg-amber-100 text-amber-600' :
                'bg-rose-100 text-rose-600'
              }`}>
                {intensity === 1 ? 'Light' : intensity === 2 ? 'Moderate' : 'Torrential'}
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="3" 
              step="1"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between mt-4">
              <span className="text-[8px] font-black text-slate-300 uppercase">Mist</span>
              <span className="text-[8px] font-black text-slate-300 uppercase">Downpour</span>
            </div>
          </div>
        </div>

        {/* Results/Telemetry */}
        <div className="mt-auto space-y-6">
          <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Recharge Velocity</p>
                  <p className="text-3xl font-black text-blue-400 tracking-tighter">
                    {rechargeRate.toLocaleString()} <span className="text-xs text-slate-500">L/hr</span>
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <TrendingUp className={isRaining ? "text-emerald-400 animate-pulse" : "text-slate-600"} size={24} />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Aquifer Saturation</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-1000 ease-out" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button 
                  onClick={() => setIsRaining(!isRaining)}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    isRaining ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}
                >
                  {isRaining ? 'Halt Simulation' : 'Initialize Monsoon'}
                </button>
                <button 
                  onClick={reset}
                  className="p-4 bg-white/5 text-slate-400 rounded-2xl hover:bg-white/10 transition-all"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>

          <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              Structures like Check Dams capture surface runoff, allowing it to seep into the aquifer over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
