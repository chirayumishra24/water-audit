'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Text, 
  Html, 
  Sphere,
  Float,
  Stars,
  PresentationControls,
  useTexture
} from '@react-three/drei';
import * as THREE from 'three';
import Link from 'next/link';
import { MapPin, AlertTriangle, Droplets, Info, Globe, ArrowRight } from 'lucide-react';

const WATER_CRISIS_DATA = [
  { name: "Delhi", coords: [77.2090, 28.6139], baselineDepletion: 65, growthRate: 1.2, info: "Groundwater depletion is critical due to massive urban demand and over-extraction." },
  { name: "Chennai", coords: [80.2707, 13.0827], baselineDepletion: 85, growthRate: 0.5, info: "Faced 'Zero Day' in 2019; now relies on desalination and seasonal monsoon recharge." },
  { name: "Bangalore", coords: [77.5946, 12.9716], baselineDepletion: 55, growthRate: 1.5, info: "The 'Silicon Valley' is losing its lakes and borewells at an alarming rate." },
  { name: "Hyderabad", coords: [78.4867, 17.3850], baselineDepletion: 45, growthRate: 1.1, info: "Hard rock aquifers and rapid construction are straining the city's water table." },
  { name: "Mumbai", coords: [72.8777, 19.0760], baselineDepletion: 30, growthRate: 0.9, info: "Coastal city facing saltwater intrusion and aging infrastructure leaks." },
  { name: "Kolkata", coords: [88.3639, 22.5726], baselineDepletion: 40, growthRate: 0.7, info: "Deep aquifers face arsenic contamination risks as water levels drop." }
];

function latLonToVector3(lon: number, lat: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function Earth({ radius }: { radius: number }) {
  return (
    <group>
      <Sphere args={[radius, 64, 64]}>
        <meshStandardMaterial 
          color="#1e293b" 
          metalness={0.1} 
          roughness={0.8}
          wireframe={false}
        />
      </Sphere>
      <Sphere args={[radius + 0.05, 64, 64]}>
        <meshStandardMaterial 
          color="#3b82f6" 
          transparent 
          opacity={0.1} 
          wireframe
        />
      </Sphere>
    </group>
  );
}

function Marker({ data, radius, onSelect, year }: { data: any, radius: number, onSelect: (d: any) => void, year: number }) {
  const pos = useMemo(() => latLonToVector3(data.coords[0], data.coords[1], radius), [data, radius]);
  const [hovered, setHovered] = useState(false);
  const mesh = useRef<THREE.Mesh>(null!);

  const currentDepletion = Math.min(100, data.baselineDepletion + (year - 2000) * data.growthRate);
  const isZeroDay = currentDepletion > 95;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.scale.setScalar(isZeroDay ? 1.5 + Math.sin(t * 8) * 0.2 : 1 + Math.sin(t * 5) * 0.1);
    }
  });

  return (
    <group position={pos}>
      <mesh 
        ref={mesh}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect({ ...data, currentDepletion, isZeroDay })}
      >
        <sphereGeometry args={[isZeroDay ? 0.12 : 0.08, 16, 16]} />
        <meshStandardMaterial 
          color={isZeroDay ? "#ef4444" : currentDepletion > 75 ? "#f59e0b" : "#3b82f6"} 
          emissive={isZeroDay ? "#ef4444" : currentDepletion > 75 ? "#f59e0b" : "#3b82f6"}
          emissiveIntensity={hovered ? 4 : isZeroDay ? 2 : 1}
        />
      </mesh>
      {(hovered || isZeroDay) && (
        <Html distanceFactor={10} zIndexRange={[100, 0]}>
          <div className={`backdrop-blur-md px-3 py-2 rounded-xl shadow-2xl border border-white/20 whitespace-nowrap pointer-events-none transition-all ${
            isZeroDay ? 'bg-red-500/20 scale-110' : 'bg-slate-900/90'
          }`}>
            <p className="text-[10px] font-black uppercase tracking-tighter text-white">{data.name}</p>
            <p className={`text-[8px] font-bold ${isZeroDay ? 'text-red-400' : currentDepletion > 75 ? 'text-orange-400' : 'text-blue-400'}`}>
              {isZeroDay ? 'ZERO DAY' : `${currentDepletion.toFixed(0)}% Depleted`}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

export function WaterMapExplorer() {
  const [selected, setSelected] = useState<any | null>(null);
  const [year, setYear] = useState(2024);
  const globeRadius = 3;

  return (
    <div className="w-full lg:aspect-[16/9] bg-[#020617] rounded-[4rem] overflow-hidden relative border-8 border-slate-900 shadow-2xl">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={3} color="#60a5fa" />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />

        <PresentationControls
          global
          snap
          rotation={[0.3, -Math.PI / 3, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 2, Math.PI / 2]}
        >
          <React.Suspense fallback={null}>
            <group rotation={[0, -Math.PI / 2, 0]}>
              <Earth radius={globeRadius} />
              <group>
                {WATER_CRISIS_DATA.map((city, idx) => (
                  <Marker key={idx} data={city} radius={globeRadius} onSelect={setSelected} year={year} />
                ))}
              </group>
            </group>
          </React.Suspense>
        </PresentationControls>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={!selected} autoRotateSpeed={0.3} />
      </Canvas>

      {/* Year Slider Overlay */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-xl px-12 z-20">
        <div className="bg-black/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Timeline Forecast</span>
            <span className="text-4xl font-black text-white italic tracking-tighter tabular-nums">{year}</span>
          </div>
          <input 
            type="range" 
            min="2000" 
            max="2050" 
            step="1" 
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
          />
          <div className="flex justify-between mt-3 px-1">
            <span className="text-[8px] font-bold text-blue-300">2000</span>
            <span className="text-[8px] font-bold text-blue-300">2025</span>
            <span className="text-[8px] font-bold text-blue-300">2050</span>
          </div>
        </div>
      </div>

      {/* UI Overlay: Title */}
      <div className="absolute top-8 left-10 pointer-events-none">
        <h2 className="text-4xl font-black text-sky-400 leading-tight mb-2 drop-shadow-2xl italic tracking-tighter">
          CRISIS <span className="text-sky-500 not-italic">FORECAST</span> 2050
        </h2>
        <p className="text-slate-500 text-[10px] max-w-[250px] font-bold uppercase tracking-[0.2em] leading-relaxed">
          Predicting groundwater depletion using time-series growth models
        </p>
      </div>

      {/* HUD: Controls/Guide */}
      <div className="absolute top-8 right-10 flex gap-4 no-print pointer-events-auto z-20">
        <div className="px-6 py-4 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-4 group hover:bg-slate-900/60 transition-all">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
            <Globe size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Navigation</span>
            <span className="text-[8px] font-bold text-white uppercase tracking-widest leading-none">Rotate Earth</span>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-4 group hover:bg-slate-900/60 transition-all">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <MapPin size={20} className="text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Guide</span>
            <span className="text-[8px] font-bold text-white uppercase tracking-widest leading-none">Select City</span>
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      {!selected && (
        <div className="absolute top-8 right-10 w-64 space-y-4">
          <div className="bg-black/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">National Risk</span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[8px] text-slate-500 font-bold uppercase">Critical Zones</span>
                  <span className="text-white font-mono font-black text-sm">{Math.floor((year - 2000) / 2)}</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${Math.min(100, (year - 2000) * 2)}%` }} />
                </div>
              </div>
              <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase italic">
                {year > 2030 ? "Severe nationwide scarcity predicted." : "Escalating groundwater stress in urban centers."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Selected City Sidebar */}
      {selected && (
        <div className="absolute top-8 bottom-8 right-10 w-[380px] bg-white rounded-[3rem] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.6)] flex flex-col animate-in slide-in-from-right duration-500 ease-out z-30">
          <button onClick={() => setSelected(null)} className="absolute top-8 right-8 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">✕</button>
          <div className="mb-8">
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 ${selected.isZeroDay ? 'bg-red-50 shadow-xl shadow-red-100' : 'bg-blue-50 shadow-xl shadow-blue-100'}`}>
              <Droplets className={`w-8 h-8 ${selected.isZeroDay ? 'text-red-500' : 'text-blue-500'}`} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{selected.name}</h3>
            <div className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${selected.isZeroDay ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
              Year {year} Status: {selected.isZeroDay ? 'CRITICAL' : 'HIGH STRESS'}
            </div>
          </div>
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Groundwater Level</span>
              <span className={`text-2xl font-black tabular-nums ${selected.isZeroDay ? 'text-red-600' : 'text-blue-600'}`}>
                {selected.currentDepletion.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${selected.isZeroDay ? 'bg-red-500' : 'bg-blue-500'}`} 
                style={{ width: `${selected.currentDepletion}%` }} 
              />
            </div>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed font-medium italic border-l-4 border-blue-500 pl-6 mb-8">"{selected.info}"</p>
          <Link href={`/chapters/scale-of-volume-and-audit`} className="mt-auto w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-blue-600 transition-all shadow-xl flex items-center justify-center gap-3 no-underline text-xs tracking-widest uppercase">
            ANALYZE SITE DATA <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
