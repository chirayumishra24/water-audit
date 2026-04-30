'use client';

import React, { useState, useRef, useMemo } from 'react';
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
  Cloud
} from '@react-three/drei';
import * as THREE from 'three';
import { CloudRain, Wind, Thermometer, Droplets, Droplet, Activity, Info, RefreshCcw, ShieldCheck, Waves } from 'lucide-react';

function RainParticles({ intensity }: { intensity: number }) {
  const count = 500 * intensity;
  const mesh = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 20;
      temp[i * 3 + 1] = Math.random() * 20;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] -= delta * 15;
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 20;
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
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#60a5fa" transparent opacity={0.4} />
    </points>
  );
}

function Ground({ saturation }: { saturation: number }) {
  const color = useMemo(() => {
    const base = new THREE.Color('#86efac'); // Light natural green
    const wet = new THREE.Color('#14532d'); // Deep forest green
    return base.lerp(wet, saturation);
  }, [saturation]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

export function MonsoonSimulator() {
  const [intensity, setIntensity] = useState(0.5);
  const [duration, setDuration] = useState(30);
  const [isSimulating, setIsSimulating] = useState(false);
  const [saturation, setSaturation] = useState(0);

  useFrame((state, delta) => {
    if (isSimulating) {
      setSaturation(prev => Math.min(1, prev + delta * intensity * 0.1));
    }
  });

  return (
    <div className="w-full h-[700px] bg-slate-50 rounded-[3.5rem] overflow-hidden relative border-[12px] border-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] group">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[15, 10, 15]} fov={35} />
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />
        
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" castShadow />
        <Environment preset="park" />

        <group position={[0, -2, 0]}>
          <Ground saturation={saturation} />
          {isSimulating && <RainParticles intensity={intensity} />}
          
          <Box args={[4, 0.5, 4]} position={[0, 0.25, 0]} castShadow>
            <meshStandardMaterial color="#cbd5e1" />
          </Box>
          <Cylinder args={[0.5, 0.5, 3]} position={[0, 1.5, 0]} castShadow>
            <meshStandardMaterial color="#94a3b8" />
          </Cylinder>

          {/* Clouds */}
          <group position={[0, 10, 0]}>
            <Cloud position={[-4, 0, -4]} speed={0.2} opacity={intensity} color={isSimulating ? "#94a3b8" : "#ffffff"} />
            <Cloud position={[4, 0, 4]} speed={0.2} opacity={intensity} color={isSimulating ? "#94a3b8" : "#ffffff"} />
          </group>
        </group>

        <ContactShadows position={[0, -1.99, 0]} opacity={0.3} scale={30} blur={3} far={5} />
      </Canvas>

      {/* UI: Light Control HUD */}
      <div className="absolute top-8 left-8 bottom-8 w-80 pointer-events-none flex flex-col gap-6">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-slate-900 pointer-events-auto border-t-4 border-t-blue-500">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <CloudRain className={`w-6 h-6 text-blue-600 ${isSimulating ? 'animate-bounce' : ''}`} />
            </div>
            <div>
              <h2 className="text-xs font-black tracking-widest uppercase leading-none text-slate-400">Environment</h2>
              <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">Monsoon Engine</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Rain Intensity</span>
                <span className="text-blue-600">{(intensity * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="1" step="0.1" 
                value={intensity}
                onChange={(e) => setIntensity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Event Duration</span>
                <span className="text-blue-600">{duration} Days</span>
              </div>
              <input 
                type="range" 
                min="5" max="90" step="5" 
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <button 
              onClick={() => setIsSimulating(!isSimulating)}
              className={`w-full py-5 rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${
                isSimulating ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' : 'bg-slate-900 text-white hover:bg-blue-600'
              }`}
            >
              {isSimulating ? <><RefreshCcw className="w-4 h-4 animate-spin" /> ABORT SEQUENCE</> : 'INITIALIZE SIMULATION'}
            </button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-slate-900 pointer-events-auto border-t-4 border-t-blue-500">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ground Saturation</span>
          </div>
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="h-full bg-blue-600 transition-all duration-300" 
              style={{ width: `${saturation * 100}%` }} 
            />
          </div>
          <p className="mt-4 text-[10px] font-bold text-slate-500 italic leading-relaxed">
            {saturation > 0.8 ? 'Critical: Maximum soil retention reached.' : 
             saturation > 0.4 ? 'Optimal: High aquifer recharge rate.' : 
             'Standard: Low moisture levels detected.'}
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 pointer-events-none">
        <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl flex items-center gap-6 border border-white/10">
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Precipitation</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-blue-400">{(intensity * 450).toFixed(0)}</span>
              <span className="text-[10px] font-black text-slate-400">MM</span>
            </div>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Recharge</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-green-400">{(saturation * 100).toFixed(1)}</span>
              <span className="text-[10px] font-black text-slate-400">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
