'use client';

import React, { useState, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Box,
  Cylinder,
  Environment,
  ContactShadows,
  Sparkles,
  Grid
} from '@react-three/drei';
import * as THREE from 'three';
import { 
  CloudRain, 
  Wind, 
  Activity, 
  Settings, 
  ArrowRight,
  RotateCcw,
  Layers,
  CheckCircle2,
  PlayCircle,
  Zap
} from 'lucide-react';

function RainParticles({ intensity }: { intensity: number }) {
  const count = Math.floor(1000 * intensity);
  const mesh = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 30;
      temp[i * 3 + 1] = Math.random() * 25;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] -= delta * 20;
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 25;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.08} 
        color="#60a5fa" 
        transparent 
        opacity={0.6} 
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

const TERRAINS = [
  { id: 'concrete', name: 'Urban (Concrete)', absorption: 0.1, runoff: 0.9, color: '#94a3b8', description: 'High runoff, minimal recharge.' },
  { id: 'forest', name: 'Forest/Green', absorption: 0.8, runoff: 0.2, color: '#22c55e', description: 'Maximum absorption & recharge.' },
  { id: 'mixed', name: 'Suburban', absorption: 0.4, runoff: 0.6, color: '#64748b', description: 'Balanced urban-green mix.' }
];

function Rain({ intensity }: { intensity: number }) {
  return intensity > 0 ? <RainParticles intensity={intensity / 100} /> : null;
}

function Terrain({ type }: { type: 'concrete' | 'forest' | 'mixed' }) {
  const terrain = TERRAINS.find(t => t.id === type)!;
  return (
    <group position={[0, -0.01, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color={terrain.color} roughness={0.9} />
      </mesh>
      {type === 'forest' && <Sparkles count={50} scale={20} size={2} speed={0.3} color="#4ade80" />}
    </group>
  );
}

function RWHSystem({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Cylinder args={[0.8, 0.8, 1.5]} position={[4, 0.75, 4]} castShadow>
        <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.2} />
      </Cylinder>
      <Box args={[0.2, 3, 0.2]} position={[4, 1.5, 3]} castShadow>
        <meshStandardMaterial color="#94a3b8" />
      </Box>
    </group>
  );
}

function WaterTable({ level }: { level: number }) {
  return (
    <group position={[0, -2 + (level / 100), 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function SimulationManager({ simulating, intensity, activeTerrain, hasRWH, setStats }: any) {
  useFrame((state, delta) => {
    if (simulating) {
      const rainForce = intensity / 100;
      const absorptionRate = activeTerrain.absorption * delta * rainForce * 2;
      const runoffRate = activeTerrain.runoff * delta * rainForce * 5;
      const harvestRate = hasRWH ? runoffRate * 0.4 : 0;

      setStats((prev: any) => ({
        groundwater: Math.min(100, prev.groundwater + absorptionRate),
        runoff: prev.runoff + (runoffRate - harvestRate),
        harvested: prev.harvested + harvestRate
      }));
    }
  });
  return null;
}

export function MonsoonSimulator() {
  const [intensity, setIntensity] = useState(50);
  const [terrainId, setTerrainId] = useState('concrete');
  const [hasRWH, setHasRWH] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [stats, setStats] = useState({ groundwater: 20, runoff: 0, harvested: 0 });

  const activeTerrain = TERRAINS.find(t => t.id === terrainId)!;

  const handleExport = () => {
    const csvContent = [
      ["Parameter", "Value"],
      ["Timestamp", new Date().toLocaleString()],
      ["Rain Intensity", `${intensity}%`],
      ["Terrain Type", activeTerrain.name],
      ["RWH Deployed", hasRWH ? "Yes" : "No"],
      ["Groundwater Level", `${stats.groundwater.toFixed(2)}%`],
      ["Surface Runoff", `${stats.runoff.toFixed(2)} kL`],
      ["Water Harvested", `${stats.harvested.toFixed(2)} kL`]
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `monsoon_telemetry_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full bg-white rounded-[3.5rem] overflow-hidden border border-slate-200 shadow-2xl relative lg:aspect-[16/9]">
      {/* LEFT: 3D CLIMATE PANEL */}
      <div className="relative flex-1 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 overflow-hidden lg:h-full">
        <Canvas shadows className="w-full h-full">
          <PerspectiveCamera makeDefault position={[15, 12, 15]} fov={35} />
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />
          
          <ambientLight intensity={simulating ? 0.4 : 0.8} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
          
          <Suspense fallback={null}>
            <Grid infiniteGrid fadeDistance={50} fadeStrength={5} cellSize={1} sectionSize={5} sectionThickness={1} sectionColor="#3b82f6" cellColor="#334155" />
            <group position={[0, -2, 0]}>
              <Terrain type={terrainId as any} />
              <Rain intensity={simulating ? intensity : 0} />
              {hasRWH && <RWHSystem position={[0, 0, 0]} />}
              <WaterTable level={stats.groundwater} />
            </group>
            <SimulationManager 
              simulating={simulating} 
              intensity={intensity} 
              activeTerrain={activeTerrain} 
              hasRWH={hasRWH} 
              setStats={setStats} 
            />
            <Environment preset="night" />
          </Suspense>
        </Canvas>

        {/* HUD */}
        <div className="absolute top-10 left-10 pointer-events-none flex flex-col gap-4">
          <div className="bg-blue-600/20 backdrop-blur-md px-6 py-3 rounded-full border border-blue-500/30 flex items-center gap-3 w-fit">
            <CloudRain className="text-blue-400 animate-pulse" size={18} />
            <span className="text-white font-black text-[10px] tracking-widest uppercase">Climate Dynamics HUD</span>
          </div>

          {/* HUD: Controls/Guide */}
          <div className="flex gap-4 no-print pointer-events-auto">
            <div className="px-6 py-4 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-4 group hover:bg-slate-900/60 transition-all">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                <RotateCcw size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Navigation</span>
                <span className="text-[8px] font-bold text-white uppercase tracking-widest leading-none">Rotate View</span>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-4 group hover:bg-slate-900/60 transition-all">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <PlayCircle size={20} className="text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Guide</span>
                <span className="text-[8px] font-bold text-white uppercase tracking-widest leading-none">Simulate Rainfall</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-2xl min-w-[280px]">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Groundwater</span>
                  <span className="text-emerald-400 font-black text-sm">{stats.groundwater.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" style={{ width: `${stats.groundwater}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Cumulative Runoff</span>
                  <span className="text-rose-400 font-black text-sm">{stats.runoff.toFixed(0)} L</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, stats.runoff / 10)}%` }} />
                </div>
              </div>
              {hasRWH && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Harvested Volume</span>
                    <span className="text-blue-400 font-black text-sm">{stats.harvested.toFixed(0)} L</span>
                  </div>
                  <div className="h-1.5 w-full bg-blue-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ width: `${Math.min(100, stats.harvested / 10)}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Terrain Details Overlay */}
        <div className="absolute bottom-10 left-10 right-10">
          <div className="bg-black/40 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl`} style={{ backgroundColor: activeTerrain.color }}>
                <Layers size={32} />
              </div>
              <div>
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1">{activeTerrain.name}</h4>
                <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">{activeTerrain.description}</p>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <span className="block text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Absorption</span>
                <span className="text-2xl font-black text-emerald-400 italic">{(activeTerrain.absorption * 100).toFixed(0)}%</span>
              </div>
              <div className="text-center border-l border-white/10 pl-8">
                <span className="block text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Runoff</span>
                <span className="text-2xl font-black text-rose-400 italic">{(activeTerrain.runoff * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: CLIMATE CONTROL PANEL */}
      <div className="w-full lg:w-[500px] bg-white flex flex-col p-12 gap-10 lg:h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-12">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Simulation Controller</h3>
            <div className="p-4 bg-slate-50 rounded-2xl text-blue-600 shadow-sm"><Settings size={24} /></div>
          </div>

          <div className="space-y-12">
            {/* Intensity */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Wind size={14} className="text-blue-500" /> Precipitation Intensity
                </label>
                <span className="text-sm font-black text-blue-600 bg-blue-50 px-4 py-1 rounded-full border border-blue-100">{intensity}%</span>
              </div>
              <input 
                type="range" value={intensity} onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Terrain Selection */}
            <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Surface Permeability</label>
              <div className="grid grid-cols-1 gap-3">
                {TERRAINS.map((t) => (
                  <button
                    key={t.id} onClick={() => setTerrainId(t.id)}
                    className={`p-6 rounded-[1.5rem] border-2 transition-all flex items-center justify-between group ${
                      terrainId === t.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: t.color }} />
                      <span className={`font-black text-xs uppercase tracking-widest ${terrainId === t.id ? 'text-blue-600' : 'text-slate-500'}`}>
                        {t.name}
                      </span>
                    </div>
                    {terrainId === t.id && <CheckCircle2 className="text-blue-600" size={20} />}
                  </button>
                ))}
              </div>
            </div>

            {/* RWH System Deployment */}
            <div className={`p-10 rounded-[3rem] border-2 transition-all duration-500 ${hasRWH ? 'bg-blue-600 border-blue-400 shadow-2xl shadow-blue-500/20 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl shadow-xl transition-colors ${hasRWH ? 'bg-white text-blue-600' : 'bg-white text-slate-400'}`}>
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-widest leading-none mb-1">RWH Systems</h4>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${hasRWH ? 'text-blue-100' : 'text-slate-400'}`}>Rainwater Harvesting</p>
                  </div>
                </div>
                <button 
                  onClick={() => setHasRWH(!hasRWH)}
                  className={`w-16 h-9 rounded-full transition-all relative ${hasRWH ? 'bg-blue-400 border-2 border-white/20' : 'bg-slate-200 border-2 border-transparent'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${hasRWH ? 'left-8' : 'left-1'}`} />
                </button>
              </div>
              <p className={`text-[10px] font-bold leading-relaxed uppercase tracking-widest ${hasRWH ? 'text-blue-50' : 'text-slate-400'}`}>
                {hasRWH ? 'Systems deployed. Capturing 40% of surface runoff for storage.' : 'Deploy systems to mitigate runoff and recharge groundwater.'}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 space-y-6">
          <div className="flex gap-4">
            <button 
              onClick={() => setSimulating(!simulating)}
              className={`flex-1 py-7 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center justify-center gap-4 active:scale-95 ${
                simulating ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200'
              }`}
            >
              {simulating ? <><RotateCcw className="animate-spin" size={20} /> Halt Simulation</> : <><PlayCircle size={20} /> Initiate Rainfall</>}
            </button>
            <button 
              onClick={() => setStats({ groundwater: 20, runoff: 0, harvested: 0 })}
              className="w-24 bg-white border border-slate-200 text-slate-300 rounded-[2rem] flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm active:scale-95"
            >
              <RotateCcw size={24} />
            </button>
          </div>
          
          <button 
            disabled={!simulating && stats.runoff === 0}
            onClick={handleExport}
            className="w-full py-6 rounded-[1.5rem] bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-widest border border-blue-100 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export Sensor Telemetry <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
