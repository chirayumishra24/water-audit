'use client';

import React, { useState, useRef, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Html, 
  RoundedBox,
  Box,
  Cylinder,
  Plane,
  Environment,
  ContactShadows,
  Float,
  SpotLight,
  Sparkles,
  Grid
} from '@react-three/drei';
import * as THREE from 'three';
import { 
  Search, 
  CheckCircle2, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  Eye, 
  RotateCcw,
  AlertCircle,
  ArrowRight,
  Info,
  ChevronRight,
  Droplets,
  Wrench,
  Zap
} from 'lucide-react';

const AUDIT_POINTS = [
  { id: 'kitchen', name: 'Kitchen Sink', pos: [-4, 0.8, -4], type: 'Leak', description: 'Faucet dripping 5 times per minute.', saving: '20L/day', found: false, icon: Droplets },
  { id: 'bathroom', name: 'Toilet Flush', pos: [4, 0.8, -4], type: 'Overflow', description: 'Faulty valve causing constant flow.', saving: '150L/day', found: false, icon: AlertCircle },
  { id: 'garden', name: 'Garden Tap', pos: [0, 0.6, 5], type: 'Corrosion', description: 'External tap leaking into soil.', saving: '40L/day', found: false, icon: Wrench },
  { id: 'tank', name: 'Roof Tank', pos: [0, 3.5, 0], type: 'Sensor Failure', description: 'Tank overflows daily due to missing sensor.', saving: '500L/day', found: false, icon: Zap }
];

function DrippingWater({ position, speed = 1 }: { position: [number, number, number], speed?: number }) {
  const [drops, setDrops] = useState<{ id: number, y: number, opacity: number }[]>([]);
  const nextId = useRef(0);

  useFrame((state, delta) => {
    // Spawn new drop
    if (state.clock.getElapsedTime() % (0.5 / speed) < 0.02) {
      setDrops(prev => [...prev, { id: nextId.current++, y: 0, opacity: 1 }]);
    }

    // Update existing drops
    setDrops(prev => prev
      .map(drop => ({
        ...drop,
        y: drop.y - delta * 3,
        opacity: drop.opacity - delta * 0.5
      }))
      .filter(drop => drop.y > -2 && drop.opacity > 0)
    );
  });

  return (
    <group position={position}>
      {drops.map(drop => (
        <mesh key={drop.id} position={[0, drop.y, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#60a5fa" transparent opacity={drop.opacity} />
        </mesh>
      ))}
    </group>
  );
}

function SinkModel({ position, isLeaking }: { position: [number, number, number], isLeaking?: boolean }) {
  return (
    <group position={position}>
      {/* Countertop */}
      <RoundedBox args={[3, 0.2, 1.5]} radius={0.05} position={[0, 0, 0]}>
        <meshStandardMaterial color="#f8fafc" />
      </RoundedBox>
      
      {/* Sink Basin */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.5, 0.4, 0.8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.1} />
      </mesh>

      {/* Faucet */}
      <group position={[0, 0.1, -0.4]}>
        <Cylinder args={[0.06, 0.06, 0.6]} position={[0, 0.3, 0]}>
          <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.1} />
        </Cylinder>
        <Cylinder args={[0.06, 0.06, 0.4]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.6, 0.2]}>
          <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.1} />
        </Cylinder>
        {isLeaking && <DrippingWater position={[0, 0.55, 0.4]} speed={2} />}
      </group>

      {/* Handles */}
      <group position={[-0.3, 0.1, -0.4]}>
        <Cylinder args={[0.04, 0.04, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#94a3b8" metalness={1} />
        </Cylinder>
      </group>
      <group position={[0.3, 0.1, -0.4]}>
        <Cylinder args={[0.04, 0.04, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#94a3b8" metalness={1} />
        </Cylinder>
      </group>
    </group>
  );
}

function ToiletModel({ position, isLeaking }: { position: [number, number, number], isLeaking?: boolean }) {
  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      {/* Base */}
      <RoundedBox args={[1, 0.5, 1.4]} radius={0.3} position={[0, 0.25, 0.1]}>
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </RoundedBox>
      {/* Tank */}
      <RoundedBox args={[1, 1, 0.5]} radius={0.1} position={[0, 1, -0.4]}>
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </RoundedBox>
      {/* Lid */}
      <RoundedBox args={[0.9, 0.1, 1.1]} radius={0.05} position={[0, 0.55, 0.1]}>
        <meshStandardMaterial color="#f1f5f9" />
      </RoundedBox>
      {/* Flush Handle */}
      <mesh position={[0.4, 1.2, -0.1]}>
        <boxGeometry args={[0.2, 0.05, 0.05]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
      </mesh>
      {isLeaking && (
        <Sparkles 
          count={10} 
          scale={[0.8, 0.8, 0.8]} 
          size={2} 
          speed={0.5} 
          color="#60a5fa" 
          position={[0, 0.5, 0]} 
        />
      )}
    </group>
  );
}

function WaterTankModel({ position, isLeaking }: { position: [number, number, number], isLeaking?: boolean }) {
  return (
    <group position={position}>
      {/* Main Cylinder */}
      <Cylinder args={[1.2, 1.2, 2.5, 32]} castShadow>
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.2} />
      </Cylinder>
      {/* Top Lid */}
      <Cylinder args={[1.25, 1.25, 0.3]} position={[0, 1.25, 0]}>
        <meshStandardMaterial color="#1e293b" />
      </Cylinder>
      {/* Support Stand */}
      <group position={[0, -1.25, 0]}>
        <Box args={[0.2, 1, 0.2]} position={[0.8, -0.5, 0.8]}><meshStandardMaterial color="#475569" /></Box>
        <Box args={[0.2, 1, 0.2]} position={[-0.8, -0.5, 0.8]}><meshStandardMaterial color="#475569" /></Box>
        <Box args={[0.2, 1, 0.2]} position={[0.8, -0.5, -0.8]}><meshStandardMaterial color="#475569" /></Box>
        <Box args={[0.2, 1, 0.2]} position={[-0.8, -0.5, -0.8]}><meshStandardMaterial color="#475569" /></Box>
      </group>
      {/* Overflow Pipe */}
      <group position={[1.2, 0.8, 0]}>
        <Cylinder args={[0.08, 0.08, 0.4]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#cbd5e1" />
        </Cylinder>
        <Cylinder args={[0.08, 0.08, 2]} position={[0.2, -1, 0]}>
          <meshStandardMaterial color="#cbd5e1" />
        </Cylinder>
        {isLeaking && <DrippingWater position={[0.2, -2, 0]} speed={4} />}
      </group>
    </group>
  );
}

function GardenModel({ position, isLeaking }: { position: [number, number, number], isLeaking?: boolean }) {
  return (
    <group position={position}>
      {/* Grass patch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial color="#22c55e" roughness={1} />
      </mesh>
      {/* Pipe */}
      <Cylinder args={[0.06, 0.06, 1.2]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#475569" />
      </Cylinder>
      {/* Tap head */}
      <group position={[0, 1.2, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <Cylinder args={[0.08, 0.08, 0.3]}>
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </Cylinder>
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        {/* Handle */}
        <mesh position={[0, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.3, 0.04, 0.08]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        {isLeaking && <DrippingWater position={[0, 0, 0.15]} speed={1.5} />}
      </group>
    </group>
  );
}

function Wall({ position, args, rotation = [0, 0, 0] }: { position: [number, number, number], args: [number, number, number], rotation?: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation as any} receiveShadow castShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#ffffff" roughness={0.8} />
    </mesh>
  );
}

function Hotspot({ data, onSelect }: { data: typeof AUDIT_POINTS[0], onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  const color = data.found ? "#22c55e" : hovered ? "#3b82f6" : "#60a5fa";

  return (
    <group position={data.pos as any}>
      <Float speed={5} floatIntensity={0.5}>
        <mesh 
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={hovered ? 2 : 0.5}
            transparent
            opacity={0.4}
          />
        </mesh>
        {!data.found && (
          <Html distanceFactor={10} position={[0, 1, 0]} center>
            <div className={`px-5 py-2.5 rounded-2xl bg-white shadow-2xl border-2 transition-all duration-300 whitespace-nowrap flex items-center gap-3 cursor-pointer group ${
              hovered ? 'border-blue-600 scale-110 -translate-y-2' : 'border-slate-100 opacity-80'
            }`}>
              <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Search className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">Audit Point</span>
            </div>
          </Html>
        )}
      </Float>
      <Sparkles count={8} scale={1.2} size={2} speed={0.6} color={color} />
    </group>
  );
}

export function VirtualSchoolAudit() {
  const router = useRouter();
  const [points, setPoints] = useState(AUDIT_POINTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const handleFound = (id: string) => {
    setPoints(prev => prev.map(p => p.id === id ? { ...p, found: true } : p));
    setSelectedId(null);
  };

  const foundCount = points.filter(p => p.found).length;
  const selectedData = points.find(p => p.id === selectedId);
  const totalSaving = points.filter(p => p.found).reduce((acc, p) => acc + parseInt(p.saving), 0);
  const progress = (foundCount / AUDIT_POINTS.length) * 100;

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[750px] bg-white rounded-[3.5rem] overflow-hidden border border-slate-200 shadow-2xl relative">
      {/* LEFT: 3D SITE PANEL */}
      <div className="relative flex-1 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 overflow-hidden min-h-[450px]">
        <Canvas shadows className="w-full h-full">
          <PerspectiveCamera makeDefault position={[12, 12, 12]} fov={35} />
          <OrbitControls 
            enablePan={true}
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
            
            <group position={[0, -1.5, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color="#f1f5f9" />
              </mesh>
              
              {/* Plot Base */}
              <Plane args={[22, 18]} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <meshStandardMaterial color="#ffffff" roughness={0.1} />
              </Plane>

              {/* Building Walls - More Structured */}
              <group position={[0, 1.5, -2]}>
                <Wall position={[0, 0, -5]} args={[18, 4, 0.4]} /> {/* Back Wall */}
                <Wall position={[-9, 0, 2]} args={[0.4, 4, 14]} /> {/* Left Wall */}
                <Wall position={[9, 0, 2]} args={[0.4, 4, 14]} />  {/* Right Wall */}
                
                {/* Interior Partition */}
                <Wall position={[0, 0, 2]} args={[0.4, 4, 6]} /> 
              </group>

              {/* Roof Section */}
              <Box args={[18, 0.4, 6]} position={[0, 4.5, -4]} receiveShadow castShadow>
                <meshStandardMaterial color="#f8fafc" />
              </Box>

              {/* Models with leak state */}
              <SinkModel position={[-5, 0.1, -4]} isLeaking={!points.find(p => p.id === 'kitchen')?.found} />
              <ToiletModel position={[5, 0, -4]} isLeaking={!points.find(p => p.id === 'bathroom')?.found} />
              <GardenModel position={[0, 0, 6]} isLeaking={!points.find(p => p.id === 'garden')?.found} />
              <WaterTankModel position={[0, 6, -4]} isLeaking={!points.find(p => p.id === 'tank')?.found} />

              {points.map(p => (
                <Hotspot 
                  key={p.id} 
                  data={p} 
                  onSelect={() => setSelectedId(p.id)} 
                />
              ))}
            </group>
            
            <Environment preset="apartment" />
            <ContactShadows position={[0, -1.45, 0]} opacity={0.6} scale={30} blur={2} far={10} color="#1e293b" />
          </Suspense>
        </Canvas>

        {/* HUD Elements */}
        <div className="absolute top-10 left-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Audit Engine</span>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">School Campus Audit</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 pointer-events-none">
          <div className="bg-blue-600/10 backdrop-blur-md px-6 py-3 rounded-full border border-blue-500/20 text-blue-500 flex items-center gap-3">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {foundCount === AUDIT_POINTS.length ? 'Campus Audit Complete' : `Locate ${AUDIT_POINTS.length - foundCount} more points`}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: REGISTRY PANEL */}
      <div className="w-full lg:w-[450px] bg-white flex flex-col p-12 gap-10 overflow-y-auto no-scrollbar">
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Campus Registry</h3>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <MapPin className="w-5 h-5 text-slate-300" />
            </div>
          </div>

          <div className="flex-1 space-y-4 min-h-[300px]">
            {foundCount === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-12 border-4 border-dashed border-slate-50 rounded-[3rem] h-full">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Eye className="w-10 h-10 text-slate-200" />
                </div>
                <h4 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-2">No Points Audited</h4>
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                  Rotate the 3D campus view and click on the markers to begin the facility audit.
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                {points.filter(p => p.found).map(p => (
                  <div key={p.id} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-start gap-5 group hover:bg-white hover:shadow-xl transition-all">
                    <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform text-blue-600">
                      {p.icon ? <p.icon size={24} /> : <CheckCircle2 size={24} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-black uppercase tracking-tight text-slate-900">{p.name}</h4>
                        <span className="text-[8px] font-black px-2 py-1 bg-emerald-100 text-emerald-600 rounded-md uppercase tracking-widest">
                          Audited
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 leading-relaxed mb-3">{p.description}</p>
                      <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Savings Potential</span>
                        <span className="text-xs font-black text-blue-600">{p.saving}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Point Detail */}
        {selectedData && !selectedData.found && (
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl animate-in slide-in-from-bottom-8 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-base font-black uppercase tracking-tighter leading-none mb-1">{selectedData.name}</h4>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Inspection Active</span>
                </div>
              </div>
              <p className="text-xs font-bold text-slate-400 leading-relaxed mb-8 italic">
                "{selectedData.description}"
              </p>
              <button 
                onClick={() => handleFound(selectedData.id)}
                className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-500 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 text-[10px] uppercase tracking-widest"
              >
                LOG REPAIR ACTION
                <ShieldCheck className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>
        )}

        <div className="mt-auto space-y-6">
          {/* Progress Widget */}
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campus Coverage</span>
              <div className="text-2xl font-black text-slate-900">{Math.round(progress)}%</div>
            </div>
            <div className="h-2 w-full bg-white rounded-full overflow-hidden mb-6 border border-slate-200">
              <div 
                className="h-full bg-blue-600 transition-all duration-1000 ease-out" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Savings</p>
                <p className="text-xl font-black text-blue-600 tracking-tighter">{totalSaving} LPD</p>
              </div>
              <button 
                onClick={() => setPoints(AUDIT_POINTS)} 
                className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              Identify all anomalies to unlock the comprehensive campus efficiency score.
            </p>
          </div>

          <button 
            onClick={() => router.push('/1-3')}
            disabled={foundCount < AUDIT_POINTS.length}
            className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 ${
              foundCount < AUDIT_POINTS.length 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02]'
            }`}
          >
            Finalize Campus Audit <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Completion Mastery Overlay */}
      {foundCount === AUDIT_POINTS.length && (
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center p-12 z-50 animate-in fade-in zoom-in duration-700">
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto shadow-2xl border-4 border-white/20">
              <ShieldCheck size={48} className="text-white" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase leading-none">Campus Audited</h2>
            <p className="text-slate-400 mb-10 font-medium text-sm leading-relaxed">
              You have successfully identified all critical water inefficiencies in the school campus. Your recovery plan is ready.
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => router.push('/1-3')}
                className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl transition-all shadow-xl hover:bg-blue-700 active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-3"
              >
                Continue to Next Chapter
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPoints(AUDIT_POINTS)}
                className="w-full py-5 bg-white/5 text-slate-400 font-black rounded-2xl transition-all hover:bg-white/10 text-xs uppercase tracking-widest"
              >
                Reset Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
