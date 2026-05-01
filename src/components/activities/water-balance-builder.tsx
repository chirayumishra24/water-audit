"use client";

import React, { useState, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  Float,
  RoundedBox,
  MeshTransmissionMaterial,
  Text,
  Edges,
  Sparkles
} from "@react-three/drei";
import { 
  ArrowRight, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Info,
  Layers,
  ChevronRight,
  Target
} from "lucide-react";
import * as THREE from "three";
import { useRouter } from "next/navigation";

// --- 3D Components ---

function Pipe({ position, rotation, color, flow = 0, label }: { position: [number, number, number], rotation: [number, number, number], color: string, flow?: number, label: string }) {
  const particlesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (particlesRef.current && flow > 0) {
      particlesRef.current.position.y = (state.clock.elapsedTime * flow * 2) % 2 - 1;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Label */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.2}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {label}
      </Text>

      {/* Main Pipe */}
      <mesh>
        <cylinderGeometry args={[0.15, 0.15, 3, 32]} />
        <MeshTransmissionMaterial 
          thickness={0.2}
          roughness={0.1}
          transmission={1}
          ior={1.2}
          color={color}
          opacity={0.5}
          transparent
        />
      </mesh>

      {/* Flow Particles */}
      <group ref={particlesRef}>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i} position={[0, (i / 5) - 1, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial 
              color={color} 
              emissive={color} 
              emissiveIntensity={2} 
              transparent 
              opacity={0.6} 
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function AuditHub({ balance, status }: { balance: number, status: 'balanced' | 'unbalanced' | 'leaking' }) {
  const hubRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (hubRef.current) {
      hubRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      if (status !== 'balanced') {
        hubRef.current.position.y = Math.sin(state.clock.elapsedTime * 10) * 0.05;
      }
    }
  });

  const hubColor = status === 'balanced' ? "#10b981" : (status === 'leaking' ? "#ef4444" : "#3b82f6");

  return (
    <group ref={hubRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <RoundedBox args={[1.5, 1.5, 1.5]} radius={0.2} smoothness={4}>
          <MeshTransmissionMaterial 
            backside
            thickness={1}
            roughness={0.1}
            transmission={1}
            ior={1.5}
            color={hubColor}
          />
          <Edges color={hubColor} />
        </RoundedBox>
        
        {/* Core Nucleus */}
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial 
            color={hubColor} 
            emissive={hubColor} 
            emissiveIntensity={2} 
          />
        </mesh>
      </Float>

      {/* Leak Effect */}
      {status === 'leaking' && (
        <Sparkles 
          count={50} 
          scale={[2, 2, 2]} 
          size={5} 
          speed={2} 
          color="#ef4444" 
        />
      )}
    </group>
  );
}

// --- Main Activity ---

const CATEGORIES = [
  { id: "inputs", label: "Total Inputs", icon: Droplets, color: "#3b82f6", unit: "KL/day" },
  { id: "process", label: "Process Use", icon: Layers, color: "#8b5cf6", unit: "KL/day" },
  { id: "domestic", label: "Domestic Use", icon: CheckCircle2, color: "#10b981", unit: "KL/day" },
  { id: "discharge", label: "Discharge", icon: Target, color: "#f59e0b", unit: "KL/day" },
];

export function WaterBalanceBuilder() {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, number>>({
    inputs: 100,
    process: 40,
    domestic: 20,
    discharge: 30,
  });

  const totalOut = values.process + values.domestic + values.discharge;
  const gap = values.inputs - totalOut;
  const gapPercent = (Math.abs(gap) / values.inputs) * 100;
  
  const status = useMemo(() => {
    if (Math.abs(gapPercent) < 2) return 'balanced';
    if (gap > 0) return 'leaking';
    return 'unbalanced';
  }, [gap, gapPercent]);

  const handleValueChange = (id: string, delta: number) => {
    setValues(prev => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta)
    }));
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        
        {/* 3D Visualization Pane */}
        <div className="lg:col-span-8 bg-slate-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-slate-800">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={40} />
            <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={0} />
            
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            
            <AuditHub balance={gap} status={status} />
            
            {/* Input Pipe */}
            <Pipe 
              position={[-3.5, 0, 0]} 
              rotation={[0, 0, Math.PI / 2]} 
              color="#3b82f6" 
              flow={values.inputs / 100}
              label="Inputs"
            />
            
            {/* Process Pipe */}
            <Pipe 
              position={[2.5, 1.5, -1.5]} 
              rotation={[0.5, 0, -Math.PI / 2.5]} 
              color="#8b5cf6" 
              flow={values.process / 100}
              label="Process"
            />

            {/* Domestic Pipe */}
            <Pipe 
              position={[2.5, 0, 0]} 
              rotation={[0, 0, -Math.PI / 2]} 
              color="#10b981" 
              flow={values.domestic / 100}
              label="Domestic"
            />

            {/* Discharge Pipe */}
            <Pipe 
              position={[2.5, -1.5, 1.5]} 
              rotation={[-0.5, 0, -Math.PI / 1.5]} 
              color="#f59e0b" 
              flow={values.discharge / 100}
              label="Discharge"
            />

            <Environment preset="night" />
            <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={15} blur={2.5} />
          </Canvas>

          {/* HUD Overlay */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <div className={`px-4 py-2 rounded-full border backdrop-blur-md flex items-center gap-2 transition-all ${
              status === 'balanced' 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                : (status === 'leaking' ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse' : 'bg-blue-500/20 border-blue-500/50 text-blue-400')
            }`}>
              {status === 'balanced' ? <CheckCircle2 size={16} /> : (status === 'leaking' ? <AlertTriangle size={16} /> : <Info size={16} />)}
              <span className="text-xs font-black uppercase tracking-widest">
                {status === 'balanced' ? 'System Balanced' : (status === 'leaking' ? `Gap: ${gap.toFixed(1)} KL Detected` : 'Balance Required')}
              </span>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-8 text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" /> Inputs
            </div>
            <ArrowRight size={14} />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-400" /> Audit Boundary
            </div>
            <ArrowRight size={14} />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" /> Allocated Uses
            </div>
          </div>
        </div>

        {/* Controls Pane */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Mass Balance Scrutinizer</h3>
              <p className="text-sm text-slate-500 font-medium">Adjust the known flows to match your inputs.</p>
            </div>

            <div className="space-y-4">
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-white shadow-sm`} style={{ color: cat.color }}>
                        <cat.icon size={18} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{cat.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900">{values[cat.id]}</span>
                      <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase">{cat.unit}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleValueChange(cat.id, -5)}
                      className="flex-1 h-8 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors flex items-center justify-center"
                    >
                      -5
                    </button>
                    <button 
                      onClick={() => handleValueChange(cat.id, 5)}
                      className="flex-1 h-8 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors flex items-center justify-center"
                    >
                      +5
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {status === 'balanced' && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 animate-in zoom-in duration-300">
                <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                  <strong>Success!</strong> Your water balance is tight. The data supports your interpretation of the site flows.
                </p>
              </div>
            )}

            {status === 'leaking' && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100 animate-pulse">
                <p className="text-xs text-red-800 font-medium leading-relaxed">
                  <strong>Unexplained Gap:</strong> Your inputs exceed known uses. This usually indicates hidden leaks or unmetered process branches.
                </p>
              </div>
            )}
          </div>

          <div className="bg-slate-900 p-6 rounded-[2rem] text-white flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Action</span>
              {status === 'balanced' && (
                <div className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-black uppercase">Complete</div>
              )}
            </div>
            
            <button
              onClick={() => status === 'balanced' ? router.push('/2-3') : null}
              disabled={status !== 'balanced'}
              className={`w-full h-14 rounded-xl flex items-center justify-center gap-3 font-black transition-all ${
                status === 'balanced'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {status === 'balanced' ? 'Continue to Next Chapter' : 'Balance Required to Proceed'}
              <ChevronRight size={20} />
            </button>

            <button 
              onClick={() => setValues({ inputs: 100, process: 40, domestic: 20, discharge: 30 })}
              className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
            >
              <RotateCcw size={12} /> Reset Simulation
            </button>
          </div>
        </div>
      </div>

      {/* Educational Footer */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Info size={20} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-1">Audit Boundary</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">The central hub represents the boundary of your site. Everything crossing in must be accounted for by everything flowing out.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-1">Unexplained Gaps</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">If inputs {">"} outputs, the "leak" visualizes the missing volume. This is your target for leak detection.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <Target size={20} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-1">Calibration</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">Real-world balances are rarely 100% perfect. A variance of less than 2% is typically considered a high-quality audit.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
