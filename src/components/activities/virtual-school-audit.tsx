'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Text, 
  Html, 
  RoundedBox,
  Box,
  Cylinder,
  Plane,
  Environment,
  ContactShadows,
  Float,
  SpotLight,
  Sparkles
} from '@react-three/drei';
import * as THREE from 'three';
import { Home, CheckCircle2, AlertTriangle, Search, ArrowRight, Droplets, MapPin, Activity, Target, ShieldCheck, Crosshair, Settings } from 'lucide-react';

const AUDIT_POINTS = [
  { id: 'kitchen', name: 'Kitchen Sink', pos: [-4, 0.8, -4], type: 'Leak', description: 'Faucet dripping 5 times per minute.', saving: '20L/day', found: false },
  { id: 'bathroom', name: 'Toilet Flush', pos: [4, 0.8, -4], type: 'Overflow', description: 'Faulty valve causing constant flow.', saving: '150L/day', found: false },
  { id: 'garden', name: 'Garden Tap', pos: [0, 0.6, 5], type: 'Corrosion', description: 'External tap leaking into soil.', saving: '40L/day', found: false },
  { id: 'tank', name: 'Roof Tank', pos: [0, 3.5, 0], type: 'Sensor Failure', description: 'Tank overflows daily due to missing sensor.', saving: '500L/day', found: false }
];

function SinkModel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[2, 0.2, 1]} radius={0.05} position={[0, 0, 0]}>
        <meshStandardMaterial color="#f1f5f9" />
      </RoundedBox>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.2, 0.4, 0.6]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.2} />
      </mesh>
      <group position={[0, 0.1, -0.3]}>
        <Cylinder args={[0.05, 0.05, 0.4]} rotation={[0, 0, 0]} position={[0, 0.2, 0]}>
          <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.1} />
        </Cylinder>
        <Cylinder args={[0.05, 0.05, 0.3]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.4, 0.15]}>
          <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.1} />
        </Cylinder>
      </group>
    </group>
  );
}

function ToiletModel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      <RoundedBox args={[0.8, 0.5, 1.2]} radius={0.2} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </RoundedBox>
      <RoundedBox args={[0.8, 0.8, 0.4]} radius={0.1} position={[0, 0.9, -0.4]}>
        <meshStandardMaterial color="#ffffff" />
      </RoundedBox>
      <RoundedBox args={[0.7, 0.1, 1]} radius={0.05} position={[0, 0.55, 0]}>
        <meshStandardMaterial color="#f8fafc" />
      </RoundedBox>
    </group>
  );
}

function WaterTankModel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Cylinder args={[1, 1, 2, 32]} castShadow>
        <meshStandardMaterial color="#64748b" metalness={0.2} roughness={0.5} />
      </Cylinder>
      <Cylinder args={[1.05, 1.05, 0.2]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#475569" />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 3]} position={[0.8, -1.5, 0]}>
        <meshStandardMaterial color="#cbd5e1" />
      </Cylinder>
    </group>
  );
}

function GardenModel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>
      <Cylinder args={[0.05, 0.05, 1]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#64748b" />
      </Cylinder>
      <mesh position={[0, 1, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
    </group>
  );
}

function Wall({ position, args, rotation = [0, 0, 0] }: { position: [number, number, number], args: [number, number, number], rotation?: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation as any} receiveShadow castShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
    </mesh>
  );
}

function Hotspot({ data, onSelect }: { data: typeof AUDIT_POINTS[0], onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (mesh.current && !data.found) {
      mesh.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 5) * 0.2);
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
          onSelect();
        }}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color={data.found ? "#22c55e" : "#3b82f6"} 
          emissive={data.found ? "#22c55e" : "#3b82f6"}
          emissiveIntensity={hovered ? 1.5 : 0.4}
          transparent
          opacity={0.6}
        />
      </mesh>
      <Sparkles count={5} scale={1} size={1} speed={0.4} color={data.found ? "#22c55e" : "#3b82f6"} />
    </group>
  );
}

export function VirtualSchoolAudit() {
  const [points, setPoints] = useState(AUDIT_POINTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const handleFound = (id: string) => {
    setPoints(prev => prev.map(p => p.id === id ? { ...p, found: true } : p));
    setSelectedId(null);
  };

  const foundCount = points.filter(p => p.found).length;
  const selectedData = points.find(p => p.id === selectedId);
  const totalSaving = points.filter(p => p.found).reduce((acc, p) => acc + parseInt(p.saving), 0);

  return (
    <div className="w-full h-[750px] bg-slate-50 rounded-[3.5rem] overflow-hidden relative border-[12px] border-white shadow-[0_50px_100px_rgba(0,0,0,0.1)]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[12, 12, 12]} fov={40} />
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} enablePan={false} />
        
        <ambientLight intensity={1.5} />
        <SpotLight position={[10, 20, 10]} angle={0.3} penumbra={1} intensity={2} castShadow color="#ffffff" />
        <Environment preset="city" />

        <group position={[0, -1.5, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[40, 40]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <Plane args={[18, 14]} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </Plane>

          <Wall position={[0, 1.5, -7]} args={[18, 3, 0.2]} /> 
          <Wall position={[-9, 1.5, 0]} args={[0.2, 3, 14]} /> 
          <Wall position={[9, 1.5, 0]} args={[0.2, 3, 14]} /> 
          <Wall position={[0, 1.5, 7]} args={[18, 3, 0.2]} /> 

          <SinkModel position={[-4, 0.1, -4]} />
          <ToiletModel position={[4, 0, -4]} />
          <GardenModel position={[0, 0, 5]} />
          <WaterTankModel position={[0, 4.5, 0]} />

          <Box args={[4, 0.2, 4]} position={[0, 3, 0]} receiveShadow castShadow>
            <meshStandardMaterial color="#f1f5f9" />
          </Box>

          {points.map(p => (
            <Hotspot 
              key={p.id} 
              data={p} 
              onSelect={() => setSelectedId(p.id)} 
            />
          ))}
        </group>

        <ContactShadows position={[0, -1.45, 0]} opacity={0.2} scale={20} blur={2.5} far={4.5} />
      </Canvas>

      {/* UI: Light Horizontal HUD */}
      <div className="absolute top-8 left-8 right-8 pointer-events-none flex justify-center">
        <div className="bg-white/80 backdrop-blur-xl p-4 px-10 rounded-full border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-slate-900 pointer-events-auto flex items-center gap-12 border-t-4 border-t-blue-500">
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xs font-black tracking-widest uppercase leading-none text-slate-400">Virtual Audit</h2>
              <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">Facility Tracker</p>
            </div>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-6 min-w-[200px]">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest w-full">
                <span className="mr-4">Protocol</span>
                <span className="text-blue-600 font-bold">{foundCount} / 4</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shrink-0 border border-slate-200">
                <div className="h-full bg-blue-600 transition-all duration-700" style={{ width: `${(foundCount / 4) * 100}%` }} />
              </div>
            </div>

            <div className="h-10 w-px bg-slate-100" />

            <div className="flex items-center gap-6">
              {points.map(p => (
                <div key={p.id} className="flex flex-col items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${p.found ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]' : 'bg-slate-200'}`} />
                  <span className={`text-[8px] font-black uppercase tracking-tight ${p.found ? 'text-slate-900' : 'text-slate-300'}`}>{p.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>

            <div className="h-10 w-px bg-slate-100" />

            <div className="text-right shrink-0">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Recovered</p>
              <p className="text-lg font-black text-blue-600 leading-none">{totalSaving} <span className="text-[10px]">LPD</span></p>
            </div>
          </div>
        </div>
      </div>

      {selectedData && (
        <div className="absolute bottom-8 right-8 w-80 bg-white rounded-[3rem] p-8 border border-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.1)] flex flex-col animate-in slide-in-from-right duration-500 ease-out pointer-events-auto">
          <button 
            onClick={() => setSelectedId(null)}
            className="absolute top-8 right-8 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
          >
            ✕
          </button>

          <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Search className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase mb-1">{selectedData.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Inspection Required</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-8 flex-1">
            <p className="text-slate-600 text-[11px] leading-relaxed font-medium italic mb-6">
              "{selectedData.description}"
            </p>
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact</p>
                <p className="text-2xl font-black text-blue-600">{selectedData.saving}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <button 
            onClick={() => handleFound(selectedData.id)}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-blue-600 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
          >
            CONFIRM REPAIR
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      )}

      {foundCount === 4 && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-2xl flex items-center justify-center p-12 animate-in fade-in zoom-in duration-700 z-[100]">
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto shadow-sm border border-blue-100">
              <ShieldCheck size={48} className="text-blue-600" />
            </div>
            <h2 className="text-4xl font-black mb-4 tracking-tighter text-slate-900 uppercase">Audit Completed</h2>
            <p className="text-slate-500 mb-10 font-medium text-sm leading-relaxed">
              Facility water integrity restored. All identified leaks have been rectified.
            </p>
            <button 
              onClick={() => { setPoints(AUDIT_POINTS); setSelectedId(null); }}
              className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl transition-all shadow-xl hover:bg-blue-700 active:scale-95 text-lg"
            >
              RESET MISSION
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
