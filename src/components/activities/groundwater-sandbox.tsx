"use client";

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
  Cylinder,
  Sparkles,
  Edges,
  MeshTransmissionMaterial
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
  Mountain,
  Waves,
  Activity,
  ChevronRight,
  TrendingUp,
  MapPin,
  Trees,
  Cloud
} from 'lucide-react';
import { useRouter } from "next/navigation";

// --- 3D Components ---

function TerrainSection({ 
  structures, 
  rainIntensity, 
  isRaining,
  saturation 
}: { 
  structures: string[], 
  rainIntensity: number, 
  isRaining: boolean,
  saturation: number 
}) {
  const rainRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (isRaining && rainRef.current) {
      rainRef.current.children.forEach((child: any) => {
        child.position.y -= delta * 8 * rainIntensity;
        if (child.position.y < 0) child.position.y = 8;
      });
    }
  });

  return (
    <group position={[0, -2, 0]}>
      {/* Top Soil (Green) */}
      <RoundedBox args={[10, 0.2, 6]} radius={0.05} position={[0, 4.1, 0]}>
        <meshStandardMaterial color="#22c55e" roughness={0.8} />
      </RoundedBox>

      {/* Earth Layers (Cross Section) */}
      <mesh position={[0, 2, 0]} receiveShadow>
        <boxGeometry args={[10, 4, 6]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
        <Edges color="#451a03" />
      </mesh>

      {/* Aquifer (Water Table) */}
      <mesh position={[0, 0.5 + (saturation * 2), 0]}>
        <boxGeometry args={[10.1, 0.1, 6.1]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          transparent 
          opacity={0.6} 
          emissive="#3b82f6"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Water Fill Visual */}
      <mesh position={[0, (saturation * 2) / 2, 0]}>
        <boxGeometry args={[10, saturation * 2, 6]} />
        <MeshTransmissionMaterial 
          thickness={1}
          roughness={0.1}
          transmission={1}
          ior={1.2}
          color="#60a5fa"
          opacity={0.3}
          transparent
        />
      </mesh>

      {/* Interventions */}
      {structures.includes("Check Dam") && (
        <group position={[2.5, 4.3, 0]}>
          <RoundedBox args={[0.4, 0.8, 5]} radius={0.1}>
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
            <Edges color="#475569" />
          </RoundedBox>
          <Text label="CHECK DAM" pos={[0, 0.6, 0]} />
        </group>
      )}

      {structures.includes("Contour Bund") && (
        <group position={[-2.5, 4.2, 0]}>
          <RoundedBox args={[0.5, 0.4, 6]} radius={0.2}>
            <meshStandardMaterial color="#166534" />
          </RoundedBox>
          <Text label="CONTOUR BUND" pos={[0, 0.4, 0]} />
        </group>
      )}

      {structures.includes("Recharge Well") && (
        <group position={[0, 4.2, 1.5]}>
          <Cylinder args={[0.3, 0.3, 4.5]} position={[0, -2.25, 0]}>
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.1} transparent opacity={0.6} />
          </Cylinder>
          <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.4, 0.1, 16, 32]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <Text label="BOREWELL" pos={[0, 0.5, 0]} />
        </group>
      )}

      {/* Percolation Tank */}
      {structures.includes("Percolation Tank") && (
        <group position={[0, 4.1, -1.5]}>
          <RoundedBox args={[3, 0.2, 2]} radius={0.1} position={[0, -0.1, 0]}>
            <meshStandardMaterial color="#60a5fa" transparent opacity={0.8} emissive="#60a5fa" emissiveIntensity={0.5} />
          </RoundedBox>
          <Text label="TANK" pos={[0, 0.3, 0]} />
        </group>
      )}

      {/* Rain Particles */}
      {isRaining && (
        <group ref={rainRef}>
          {[...Array(150)].map((_, i) => (
            <mesh key={i} position={[(Math.random() - 0.5) * 10, Math.random() * 8, (Math.random() - 0.5) * 6]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshBasicMaterial color="#60a5fa" transparent opacity={0.4} />
            </mesh>
          ))}
        </group>
      )}

      {/* Percolation Particles (Inside earth) */}
      {isRaining && (
        <Sparkles 
          count={structures.length * 20 + 20} 
          scale={[10, 4, 6]} 
          position={[0, 2, 0]} 
          color="#60a5fa" 
          size={2} 
          speed={0.5} 
        />
      )}
    </group>
  );
}

function Text({ label, pos }: { label: string, pos: [number, number, number] }) {
  return (
    <Html position={pos} center distanceFactor={10}>
      <div className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/20 text-[6px] font-black text-white whitespace-nowrap uppercase tracking-widest">
        {label}
      </div>
    </Html>
  );
}

// --- Main Activity ---

const STRUCTURES = [
  { id: "Check Dam", name: "Check Dam", icon: Mountain, color: "text-blue-500", desc: "Barriers across streams to slow water speed." },
  { id: "Percolation Tank", name: "Percolation Tank", icon: Droplets, color: "text-emerald-500", desc: "Man-made basins to capture and soak runoff." },
  { id: "Contour Bund", name: "Contour Bund", icon: MapPin, color: "text-amber-500", desc: "Soil ridges built along elevation lines." },
  { id: "Recharge Well", name: "Borewell Recharge", icon: ArrowDown, color: "text-purple-500", desc: "Direct injection of filtered water into aquifers." }
];

export function GroundwaterSandbox() {
  const router = useRouter();
  const [structures, setStructures] = useState<string[]>([]);
  const [isRaining, setIsRaining] = useState(false);
  const [intensity, setIntensity] = useState(1);
  const [saturation, setSaturation] = useState(0.2);
  
  useFrame((state, delta) => {
    if (isRaining) {
      const rate = (intensity * (structures.length + 1) * 0.01) * delta;
      setSaturation(prev => Math.min(1, prev + rate));
    }
  }, [isRaining, intensity, structures]);

  const toggleStructure = (id: string) => {
    setStructures(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const reset = () => {
    setStructures([]);
    setIsRaining(false);
    setIntensity(1);
    setSaturation(0.2);
  };

  const isComplete = saturation >= 0.95;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[750px]">
        
        {/* LEFT: 3D Visualization */}
        <div className="lg:col-span-8 bg-slate-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-slate-800">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[12, 10, 12]} fov={35} />
            <OrbitControls 
              enablePan={false}
              minDistance={10}
              maxDistance={25}
              maxPolarAngle={Math.PI / 2.1}
            />
            
            <ambientLight intensity={1} />
            <spotLight position={[20, 30, 10]} intensity={1000} castShadow />
            <pointLight position={[-10, 10, -10]} intensity={0.5} />
            
            <Suspense fallback={null}>
              <TerrainSection 
                structures={structures} 
                isRaining={isRaining} 
                rainIntensity={intensity} 
                saturation={saturation}
              />
              <Environment preset="park" />
              <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={25} blur={2.5} far={10} color="#000000" />
            </Suspense>
          </Canvas>

          {/* HUD Overlay */}
          <div className="absolute top-8 left-8 flex flex-col gap-3">
            <div className="bg-white/10 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 shadow-2xl min-w-[200px]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aquifer Saturation</span>
                <Activity size={14} className={isRaining ? "text-blue-400 animate-pulse" : "text-slate-600"} />
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all duration-300"
                  style={{ width: `${saturation * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-black text-white">{(saturation * 100).toFixed(0)}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Capacity</span>
              </div>
            </div>

            {isRaining && (
              <div className="bg-blue-600 px-4 py-2 rounded-full border border-blue-400 flex items-center gap-2 animate-in slide-in-from-left">
                <CloudRain size={16} className="text-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Recharge in Progress</span>
              </div>
            )}
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/40 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10">
            <button 
              onClick={() => setIsRaining(!isRaining)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                isRaining ? 'bg-white text-slate-900' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              }`}
            >
              {isRaining ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">
                <span>Mist</span>
                <span>Torrential</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="3" 
                step="0.1"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-48 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <button 
              onClick={reset}
              className="w-14 h-14 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </div>

        {/* RIGHT: Control Panel */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex-1 flex flex-col overflow-y-auto no-scrollbar">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 shadow-sm">
                <Layers size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Intervention Sandbox</h3>
            </div>

            <div className="space-y-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Passive Augmentation</span>
              <div className="grid grid-cols-1 gap-3">
                {STRUCTURES.map(s => {
                  const isActive = structures.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleStructure(s.id)}
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all group ${
                        isActive 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100 scale-[1.02]' 
                          : 'bg-slate-50 border-slate-100 hover:border-blue-300 hover:bg-white'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isActive ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                        <s.icon className={isActive ? 'text-white' : s.color} size={24} />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="text-xs font-black uppercase tracking-tight">{s.name}</h4>
                        <p className={`text-[10px] font-bold leading-tight mt-1 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                          {s.desc}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {isComplete && (
              <div className="mt-8 p-6 bg-emerald-50 border border-emerald-100 rounded-3xl animate-in zoom-in duration-500">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="text-emerald-500" />
                  <span className="text-xs font-black text-emerald-900 uppercase">Aquifer Restored</span>
                </div>
                <p className="text-[11px] font-medium text-emerald-800 leading-relaxed">
                  Excellent work. By combining surface runoff management with direct recharge, you have stabilized the local water table even during intense monsoon cycles.
                </p>
              </div>
            )}
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                <Trees size={20} className="text-emerald-400" />
              </div>
              <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                Groundwater is a "shared bank account." Augmentation structures allow us to "deposit" rainwater that would otherwise be lost to surface evaporation or runoff.
              </p>
            </div>

            <button
              onClick={() => isComplete ? router.push('/4-1') : setIsRaining(true)}
              className={`w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-black transition-all ${
                isComplete
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
              }`}
            >
              {isComplete ? 'Complete Module' : 'Initialize Simulation'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Engineering Footer */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex gap-5">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
            <TrendingUp size={28} />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 tracking-tight">Percolation Rate</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">Sandy soil percolates faster than clay. Check dams and bunds are essential in high-clay areas to give water the time it needs to soak in.</p>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-amber-100">
            <Activity size={28} />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 tracking-tight">Direct Recharge</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">Borewell recharge bypasses surface layers to deliver filtered water directly to the aquifer. This is the fastest way to restore deep water tables.</p>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-emerald-100">
            <Cloud size={28} />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 tracking-tight">Climate Resilience</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">In areas with short, intense monsoons, capturing runoff is critical. Without storage and recharge, up to 90% of rainwater is lost to the sea.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
