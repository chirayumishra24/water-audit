'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  OrbitControls, 
  Text, 
  Html,
  Box,
  Cylinder,
  Plane,
  Grid,
  Environment,
  Float,
  RoundedBox,
  ContactShadows,
  Sparkles,
  Torus
} from '@react-three/drei';
import * as THREE from 'three';
import { Eye, Search, AlertCircle, CheckCircle2, MapPin, Activity, Target, ShieldCheck, Crosshair, Droplets } from 'lucide-react';

const LOSS_POINTS = [
  { id: 1, name: 'Dripping Faucet', pos: [-3, 1, 2], description: 'A small leak can waste 2,000L/year.', severity: 'Low', found: false },
  { id: 2, name: 'Tank Overflow', pos: [0, 3.5, -2], description: 'Missing float valve causing water waste.', severity: 'Critical', found: false },
  { id: 3, name: 'Broken Sprinkler', pos: [4, 0.2, 0], description: 'Watering the pavement instead of grass.', severity: 'High', found: false },
  { id: 4, name: 'Corroded Pipe', pos: [-2, 0.5, -3], description: 'Hidden pinhole leak in supply line.', severity: 'Medium', found: false }
];

function FaucetModel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Cylinder args={[0.05, 0.05, 0.5]} rotation={[0, 0, 0]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </Cylinder>
      <Cylinder args={[0.05, 0.05, 0.3]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.5, 0.15]}>
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </Cylinder>
      {/* Base */}
      <RoundedBox args={[0.4, 0.1, 0.4]} radius={0.05} position={[0, 0, 0]}>
        <meshStandardMaterial color="#cbd5e1" />
      </RoundedBox>
    </group>
  );
}

function TankModel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Cylinder args={[1, 1, 2, 32]} castShadow>
        <meshStandardMaterial color="#64748b" />
      </Cylinder>
      <Cylinder args={[1.1, 1.1, 0.2]} position={[0, 1.1, 0]}>
        <meshStandardMaterial color="#475569" />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 1]} rotation={[0, 0, Math.PI / 2]} position={[0.8, 0, 0]}>
        <meshStandardMaterial color="#94a3b8" />
      </Cylinder>
    </group>
  );
}

function SprinklerModel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      <Cylinder args={[0.05, 0.1, 0.3]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#334155" />
      </Cylinder>
      <Torus args={[0.1, 0.02, 16, 32]} position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#94a3b8" />
      </Torus>
    </group>
  );
}

function PipeModel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, Math.PI / 4, 0]}>
      <Cylinder args={[0.1, 0.1, 2]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.15, 0.15, 0.4]} position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#64748b" />
      </Cylinder>
      <Cylinder args={[0.15, 0.15, 0.4]} position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#64748b" />
      </Cylinder>
    </group>
  );
}

function ArchitecturalBase() {
  return (
    <group>
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[15, 0.1, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
      <Grid infiniteGrid fadeDistance={20} sectionColor="#e2e8f0" cellColor="#f1f5f9" sectionThickness={1} />
      
      {/* Subtle Building Outlines */}
      <Box args={[6, 3, 4]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#f1f5f9" transparent opacity={0.3} />
      </Box>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(6, 3, 4)]} />
        <lineBasicMaterial color="#e2e8f0" />
      </lineSegments>
    </group>
  );
}

function Hotspot({ data, onFound }: { data: typeof LOSS_POINTS[0], onFound: (id: number) => void }) {
  const [hovered, setHovered] = useState(false);
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (mesh.current && !data.found) {
      mesh.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.2);
    }
  });

  return (
    <group position={data.pos as any}>
      <mesh 
        ref={mesh}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onFound(data.id);
        }}
      >
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial 
          color={data.found ? "#22c55e" : "#3b82f6"} 
          emissive={data.found ? "#22c55e" : "#3b82f6"}
          emissiveIntensity={hovered ? 1.5 : 0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {hovered && !data.found && (
        <Html distanceFactor={8} position={[0, 0.5, 0]}>
          <div className="bg-white px-3 py-1 rounded-xl shadow-2xl border border-slate-100 text-[10px] font-black whitespace-nowrap text-blue-600 uppercase tracking-widest flex items-center gap-2">
            <Search className="w-3 h-3" />
            Inspect Point
          </div>
        </Html>
      )}
    </group>
  );
}

export function SiteWalkthrough() {
  const [points, setPoints] = useState(LOSS_POINTS);
  const [selected, setSelected] = useState<typeof LOSS_POINTS[0] | null>(null);

  const handleFound = (id: number) => {
    setPoints(prev => prev.map(p => p.id === id ? { ...p, found: true } : p));
    setSelected(points.find(p => p.id === id) || null);
  };

  const foundCount = points.filter(p => p.found).length;

  return (
    <div className="w-full h-[700px] bg-slate-50 rounded-[3.5rem] overflow-hidden relative border-[12px] border-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] group">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[12, 10, 12]} fov={35} />
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} enablePan={false} />
        
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 20, 10]} angle={0.2} penumbra={1} intensity={2} castShadow color="#ffffff" />
        <Environment preset="apartment" />

        <group position={[0, -1, 0]}>
          <ArchitecturalBase />
          
          <FaucetModel position={[-3, 0.1, 2]} />
          <TankModel position={[0, 3, -2]} />
          <SprinklerModel position={[4, 0.1, 0]} />
          <PipeModel position={[-2, 0.2, -3]} />

          {points.map(p => (
            <Hotspot key={p.id} data={p} onFound={handleFound} />
          ))}
        </group>

        <ContactShadows position={[0, -0.99, 0]} opacity={0.3} scale={25} blur={3} far={4} />
      </Canvas>

      {/* UI: Light Horizontal HUD */}
      <div className="absolute top-8 left-8 right-8 pointer-events-none flex justify-center">
        <div className="bg-white/80 backdrop-blur-xl p-4 px-10 rounded-full border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-slate-900 pointer-events-auto flex items-center gap-12 border-t-4 border-t-blue-500">
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xs font-black tracking-widest uppercase leading-none text-slate-400">Site Walkthrough</h2>
              <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">Facility Inspection</p>
            </div>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-6 min-w-[240px]">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest w-full">
                <span className="mr-4">Inspection Progress</span>
                <span className="text-blue-600">{foundCount} / 4 Points</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shrink-0 border border-slate-200">
                <div className="h-full bg-blue-600 transition-all duration-700 ease-out" style={{ width: `${(foundCount / 4) * 100}%` }} />
              </div>
            </div>

            <div className="h-10 w-px bg-slate-100" />

            <div className="flex items-center gap-6">
              {points.map(p => (
                <div key={p.id} className="flex flex-col items-center gap-1.5 group/point">
                  <div className={`w-2 h-2 rounded-full transition-all duration-500 ${p.found ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-slate-200'}`} />
                  <span className={`text-[8px] font-black uppercase tracking-tight transition-colors ${p.found ? 'text-slate-900' : 'text-slate-300'}`}>{p.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inspection Detail Modal (Light) */}
      {selected && (
        <div className="absolute bottom-8 right-8 w-80 bg-white rounded-[3rem] p-8 border border-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.1)] flex flex-col animate-in slide-in-from-right duration-500 ease-out pointer-events-auto">
          <button 
            onClick={() => setSelected(null)}
            className="absolute top-8 right-8 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            ✕
          </button>
          
          <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 bg-blue-50 rounded-3xl flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-1">{selected.name}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-black uppercase tracking-widest ${
                  selected.severity === 'Critical' ? 'text-red-500' : 'text-orange-500'
                }`}>
                  {selected.severity} Severity
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Auditor's Note</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
              "{selected.description}"
            </p>
          </div>

          <button 
            onClick={() => setSelected(null)}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-blue-600 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
          >
            LOG MEASUREMENT
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Success View (Light) */}
      {foundCount === 4 && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-2xl flex items-center justify-center p-12 animate-in fade-in zoom-in duration-700 z-[100]">
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto shadow-sm border border-blue-100">
              <ShieldCheck size={48} className="text-blue-600" />
            </div>
            <h2 className="text-4xl font-black mb-4 tracking-tighter text-slate-900 uppercase">Audit Verified</h2>
            <p className="text-slate-500 mb-10 font-medium text-sm leading-relaxed">
              Facility reconnaissance complete. All critical leakage points have been identified and logged for the final report.
            </p>
            <button 
              onClick={() => { setPoints(LOSS_POINTS); setSelected(null); }}
              className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl transition-all shadow-xl hover:bg-blue-700 active:scale-95 text-lg"
            >
              GENERATE NEW AUDIT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
