'use client';

import React, { useState, useRef, useMemo, Suspense } from 'react';
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
  Sparkles,
  Cloud,
  Grid
} from '@react-three/drei';
import * as THREE from 'three';
import { 
  CloudRain, 
  Wind, 
  Thermometer, 
  Droplets, 
  Droplet, 
  Activity, 
  Info, 
  RefreshCcw, 
  ShieldCheck, 
  Waves,
  Zap,
  Settings,
  ChevronRight,
  ArrowRight,
  Sun,
  Pause,
  Play,
  RotateCcw
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

function Ground({ saturation }: { saturation: number }) {
  const color = useMemo(() => {
    const base = new THREE.Color('#86efac'); // Healthy green
    const wet = new THREE.Color('#1e3a8a'); // Saturated blue-green
    return base.clone().lerp(wet, saturation * 0.8);
  }, [saturation]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

function SimulationUpdater({ isSimulating, intensity, setSaturation }: { isSimulating: boolean, intensity: number, setSaturation: React.Dispatch<React.SetStateAction<number>> }) {
  useFrame((state, delta) => {
    if (isSimulating) {
      setSaturation(prev => Math.min(1, prev + delta * intensity * 0.05));
    } else {
      setSaturation(prev => Math.max(0, prev - delta * 0.01));
    }
  });
  return null;
}

export function MonsoonSimulator() {
  const [intensity, setIntensity] = useState(0.5);
  const [duration, setDuration] = useState(30);
  const [isSimulating, setIsSimulating] = useState(false);
  const [saturation, setSaturation] = useState(0);

  const reset = () => {
    setSaturation(0);
    setIsSimulating(false);
    setIntensity(0.5);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[800px] bg-white rounded-[3.5rem] overflow-hidden border border-slate-200 shadow-2xl relative">
      {/* LEFT: 3D CLIMATE PANEL */}
      <div className="relative flex-1 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 overflow-hidden min-h-[450px]">
        <Canvas shadows className="w-full h-full">
          <SimulationUpdater isSimulating={isSimulating} intensity={intensity} setSaturation={setSaturation} />
          <PerspectiveCamera makeDefault position={[20, 15, 20]} fov={30} />
          <OrbitControls 
            makeDefault 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2.2}
            minDistance={10}
            maxDistance={40}
          />
          
          <ambientLight intensity={isSimulating ? 0.8 : 1.5} />
          <directionalLight 
            position={[10, 20, 10]} 
            intensity={isSimulating ? 0.5 : 2} 
            color={isSimulating ? "#94a3b8" : "#ffffff"} 
            castShadow 
          />
          
          <Suspense fallback={null}>
            <Grid
              infiniteGrid
              fadeDistance={50}
              fadeStrength={5}
              cellSize={1}
              sectionSize={5}
              sectionThickness={1}
              sectionColor="#3b82f6"
              cellColor="#e2e8f0"
            />
            
            <group position={[0, -2, 0]}>
              <Ground saturation={saturation} />
              {isSimulating && <RainParticles intensity={intensity} />}
              
              {/* Reference Structure (Rain Gauge / Station) */}
              <group position={[0, 0, 0]}>
                <Box args={[4, 0.5, 4]} position={[0, 0.25, 0]} castShadow>
                  <meshStandardMaterial color="#cbd5e1" />
                </Box>
                <Cylinder args={[0.5, 0.5, 3]} position={[0, 1.5, 0]} castShadow>
                  <meshStandardMaterial color="#94a3b8" />
                </Cylinder>
              </group>

              {/* Dynamic Clouds */}
              <group position={[0, 12, 0]}>
                <Cloud 
                  position={[-6, 0, -6]} 
                  speed={0.5} 
                  opacity={isSimulating ? intensity : 0.2} 
                  color={isSimulating ? "#475569" : "#ffffff"} 
                />
                <Cloud 
                  position={[6, 0, 6]} 
                  speed={0.5} 
                  opacity={isSimulating ? intensity : 0.2} 
                  color={isSimulating ? "#475569" : "#ffffff"} 
                />
                <Cloud 
                  position={[0, 2, 0]} 
                  speed={0.3} 
                  opacity={isSimulating ? intensity * 1.5 : 0.1} 
                  color={isSimulating ? "#1e293b" : "#ffffff"} 
                />
              </group>
            </group>
            
            <Environment preset={isSimulating ? "night" : "park"} />
          </Suspense>

          <ContactShadows position={[0, -1.99, 0]} opacity={0.3} scale={40} blur={3} far={10} color="#000000" />
        </Canvas>

        {/* HUD Elements */}
        <div className="absolute top-10 left-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-700 ${
                isSimulating ? 'bg-blue-600 shadow-blue-500/20' : 'bg-amber-500 shadow-amber-500/20'
              }`}>
                {isSimulating ? <CloudRain className="w-6 h-6 text-white" /> : <Sun className="w-6 h-6 text-white" />}
              </div>
              <div>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Climate Simulation</span>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Monsoon Dynamics Engine</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 pointer-events-none">
          <div className="flex items-center gap-4">
            <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-[2rem] border border-slate-200 shadow-xl flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Precipitation</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-blue-600 tabular-nums">{(intensity * 450 * (isSimulating ? 1 : 0)).toFixed(0)}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">MM</span>
                </div>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Saturation</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-blue-600 tabular-nums">{(saturation * 100).toFixed(1)}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: CLIMATE CONTROL PANEL */}
      <div className="w-full lg:w-[480px] bg-white flex flex-col p-12 gap-10 overflow-y-auto no-scrollbar">
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Control Console</h3>
            <div className="p-3 bg-slate-50 rounded-2xl text-blue-600">
              <Settings size={20} />
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Configuration Parameters</span>
            </div>
            
            <div className="space-y-10">
              {/* Intensity Slider */}
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CloudRain size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Intensity</span>
                  </div>
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {(intensity * 100).toFixed(0)}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0.1" max="1" step="0.05" 
                  value={intensity}
                  onChange={(e) => setIntensity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Duration Slider */}
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <RefreshCcw size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Temporal Scale</span>
                  </div>
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {duration} Days
                  </span>
                </div>
                <input 
                  type="range" 
                  min="5" max="120" step="5" 
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button 
                onClick={() => setIsSimulating(!isSimulating)}
                className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${
                  isSimulating 
                    ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200' 
                    : 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200'
                }`}
              >
                {isSimulating ? <><Pause className="w-4 h-4" /> Halt Simulation</> : <><Play className="w-4 h-4" /> Initiate Monsoon</>}
              </button>
              
              <button 
                onClick={reset}
                className="w-20 bg-white border border-slate-200 text-slate-400 rounded-[2rem] flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm active:scale-95"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Environmental Telemetry */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Soil retention Telemetry</span>
              </div>
            </div>

            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
              <div className="h-4 w-full bg-white rounded-full overflow-hidden border border-slate-100 p-1">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    saturation > 0.8 ? 'bg-rose-500' : saturation > 0.4 ? 'bg-emerald-500' : 'bg-blue-600'
                  }`} 
                  style={{ width: `${saturation * 100}%` }} 
                />
              </div>
              
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${
                  saturation > 0.8 ? 'bg-rose-100 text-rose-600' : saturation > 0.4 ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  <Info size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Status Assessment</p>
                  <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">
                    {saturation > 0.8 ? 'Critical: Soil field capacity reached. High probability of runoff and surface flooding.' : 
                     saturation > 0.4 ? 'Optimal: Optimal moisture content for deep aquifer recharge. Vegetation retention high.' : 
                     'Stable: Low moisture level. Ground remains receptive to further precipitation input.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="mt-auto space-y-6">
          <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Aquifer Intake</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-400 tracking-tighter">{(saturation * 85).toFixed(1)}</span>
                  <span className="text-xs text-slate-500 font-black uppercase">%</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Runoff Coefficient</p>
                <div className="flex items-baseline justify-end gap-2">
                  <span className="text-3xl font-black text-rose-400 tracking-tighter">{(saturation * saturation * 0.9).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>

          <button 
            className="w-full flex items-center justify-center gap-3 py-6 rounded-[2rem] bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl hover:bg-blue-600 shadow-slate-200 active:scale-95"
          >
            Export Climate Report
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
