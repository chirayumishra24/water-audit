'use client';

import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  Float, 
  ContactShadows, 
  Html, 
  useCursor, 
  Grid,
  RoundedBox,
  Cylinder,
  Box
} from '@react-three/drei';
import * as THREE from 'three';
import { 
  Wrench, 
  Droplets, 
  CheckCircle2, 
  RotateCcw, 
  Info,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Scissors,
  Hammer,
  Settings,
  Activity,
  Zap,
  ChevronRight,
  Box as BoxIcon
} from 'lucide-react';

// --- 3D Components ---

function TapModel({ 
  step, 
  activeTool, 
  onPartClick 
}: { 
  step: number, 
  activeTool: string | null,
  onPartClick: (part: string) => void 
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  useCursor(!!hovered);

  return (
    <group position={[0, -0.5, 0]}>
      {/* Workbench Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.1} />
      </mesh>

      {/* Tap Body - Fixed Base */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.8, 32]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Tap Spout */}
      <mesh castShadow position={[0.3, 0.7, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 32]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Internal: Spindle (Brass) - Visible when handle removed */}
      {step >= 2 && (
        <group 
          position={[0, 0.9, 0]}
          onPointerOver={() => setHovered('spindle')}
          onPointerOut={() => setHovered(null)}
          onClick={() => onPartClick('spindle')}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
            <meshStandardMaterial 
              color={hovered === 'spindle' ? "#fbbf24" : "#b45309"} 
              metalness={0.9} 
              roughness={0.1} 
            />
          </mesh>
          {hovered === 'spindle' && (
            <Html distanceFactor={4} position={[0, 0.3, 0]}>
              <div className="bg-white/95 backdrop-blur-xl px-4 py-2 rounded-2xl border-2 border-blue-600 text-[10px] font-black text-blue-600 uppercase tracking-widest shadow-2xl whitespace-nowrap animate-in zoom-in">
                Spindle Component
              </div>
            </Html>
          )}
        </group>
      )}

      {/* Handle - Removed in Step 2 */}
      {step < 2 && (
        <group 
          position={[0, 1.1, 0]}
          onPointerOver={() => setHovered('handle')}
          onPointerOut={() => setHovered(null)}
          onClick={() => onPartClick('handle')}
        >
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.1, 0.1]} />
            <meshStandardMaterial 
              color={hovered === 'handle' ? "#3b82f6" : "#cbd5e1"} 
              metalness={0.8} 
              roughness={0.2} 
            />
          </mesh>
          <mesh castShadow position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
            <meshStandardMaterial 
              color={hovered === 'handle' ? "#3b82f6" : "#cbd5e1"} 
              metalness={0.8} 
              roughness={0.2} 
            />
          </mesh>
          {hovered === 'handle' && (
            <Html distanceFactor={4} position={[0, 0.3, 0]}>
              <div className="bg-white/95 backdrop-blur-xl px-4 py-2 rounded-2xl border-2 border-blue-600 text-[10px] font-black text-blue-600 uppercase tracking-widest shadow-2xl whitespace-nowrap animate-in zoom-in">
                Handle Module
              </div>
            </Html>
          )}
        </group>
      )}

      {/* Washer - Visible/Interactable in Step 3 */}
      {step === 3 && (
        <group 
          position={[0.8, 0.05, 0.8]}
          onPointerOver={() => setHovered('washer')}
          onPointerOut={() => setHovered(null)}
          onClick={() => onPartClick('washer')}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
            <meshStandardMaterial 
              color={hovered === 'washer' ? "#ef4444" : "#1f2937"} 
              roughness={0.8} 
            />
          </mesh>
          <Html distanceFactor={4} position={[0, 0.2, 0]}>
            <div className="bg-rose-500/90 backdrop-blur-xl px-4 py-2 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest shadow-2xl whitespace-nowrap animate-bounce">
              Worn Washer (Defective)
            </div>
          </Html>
        </group>
      )}

      {/* Water Drip Effect */}
      {step === 0 && (
        <group position={[0.55, 0.5, 0]}>
          <Float speed={5} rotationIntensity={0} floatIntensity={1}>
            <mesh>
              <sphereGeometry args={[0.02, 16, 16]} />
              <meshStandardMaterial color="#60a5fa" transparent opacity={0.6} />
            </mesh>
          </Float>
        </group>
      )}
    </group>
  );
}

// --- Main Activity ---

export function TapRepairSimulator() {
  const [step, setStep] = useState(0);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [status, setStatus] = useState("Water Pressure: ON");
  
  const steps = [
    { 
      title: "Isolate Water", 
      desc: "Before any mechanical intervention, the primary supply line must be isolated.",
      instruction: "Locate and toggle the Pressure Valve to OFF." 
    },
    { 
      title: "Remove Handle", 
      desc: "The handle must be detached to expose the internal spindle mechanism.",
      instruction: "Select the Screwdriver and engage the Handle Module."
    },
    { 
      title: "Extract Spindle", 
      desc: "The spindle assembly regulates flow and contains the defective washer.",
      instruction: "Equip the Spanner and extract the Spindle Component."
    },
    { 
      title: "Replace Washer", 
      desc: "Deteriorated washers are the primary cause of residential leaks.",
      instruction: "Physically remove the Worn Washer from the assembly."
    },
    { 
      title: "Verify Repair", 
      desc: "System integrity must be validated after reassembly.",
      instruction: "Confirm reassembly to finalize the simulation."
    }
  ];

  const handlePartClick = (part: string) => {
    if (step === 1 && part === "handle" && activeTool === "screwdriver") {
      setStep(2);
      setActiveTool(null);
    } else if (step === 2 && part === "spindle" && activeTool === "spanner") {
      setStep(3);
      setActiveTool(null);
    } else if (step === 3 && part === "washer") {
      setStep(4);
    }
  };

  const toggleWater = () => {
    if (step === 0) {
      setStatus("Water Pressure: OFF");
      setStep(1);
    }
  };

  const reset = () => {
    setStep(0);
    setActiveTool(null);
    setStatus("Water Pressure: ON");
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[750px] bg-white rounded-[3.5rem] overflow-hidden border border-slate-200 shadow-2xl relative">
      {/* LEFT: 3D WORKBENCH PANEL */}
      <div className="relative flex-1 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 overflow-hidden min-h-[450px]">
        <Canvas shadows className="w-full h-full">
          <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={35} />
          <OrbitControls 
            enablePan={false}
            minDistance={4}
            maxDistance={12}
            maxPolarAngle={Math.PI / 2.1}
          />
          
          <ambientLight intensity={1.5} />
          <spotLight position={[10, 15, 10]} intensity={800} castShadow />
          
          <Suspense fallback={null}>
            <Grid
              infiniteGrid
              fadeDistance={30}
              fadeStrength={5}
              cellSize={1}
              sectionSize={5}
              sectionThickness={1}
              sectionColor="#3b82f6"
              cellColor="#e2e8f0"
            />
            
            <TapModel step={step} activeTool={activeTool} onPartClick={handlePartClick} />
            <Environment preset="city" />
            <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={20} blur={2.5} far={10} color="#000000" />
          </Suspense>
        </Canvas>

        {/* HUD Elements */}
        <div className="absolute top-10 left-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Repair Protocol</span>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Tactical Tap Repair</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 pointer-events-none">
          <div className="bg-blue-600/10 backdrop-blur-md px-6 py-3 rounded-full border border-blue-500/20 text-blue-500 flex items-center gap-3">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {step === 4 ? 'Repair Successfully Validated' : `Objective: ${steps[step].title}`}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: CONTROL PANEL */}
      <div className="w-full lg:w-[450px] bg-white flex flex-col p-12 gap-10 overflow-y-auto no-scrollbar">
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Mission Log</h3>
            <div className="p-3 bg-slate-50 rounded-2xl text-blue-600">
              <Settings size={20} />
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="grid grid-cols-5 gap-2">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-700 ${
                  i < step ? 'bg-emerald-500' : 
                  i === step ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 
                  'bg-slate-100'
                }`} 
              />
            ))}
          </div>

          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Step</span>
            </div>
            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">{steps[step].title}</h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed mb-6">{steps[step].desc}</p>
            
            <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-blue-100">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[10px] font-black text-blue-800 uppercase tracking-tight leading-normal">
                {steps[step].instruction}
              </p>
            </div>
          </div>

          {/* Tools / Actions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toolkit</span>
              <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">Manual Ops</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setStep(step === 0 ? 1 : step)} // Simplified toggle water logic for now
                disabled={step !== 0}
                className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-4 group ${
                  status.includes("OFF") 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                    : "bg-rose-50 border-rose-100 text-rose-600 hover:scale-105 active:scale-95"
                } disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                  status.includes("OFF") ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                }`}>
                  <ShieldCheck size={24} className={status.includes("OFF") ? "animate-pulse" : ""} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tight text-center leading-tight">
                  {status}
                </span>
              </button>

              <button 
                onClick={() => setActiveTool(activeTool === "screwdriver" ? null : "screwdriver")}
                disabled={step < 1 || step >= 4}
                className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-4 group ${
                  activeTool === "screwdriver" 
                    ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200" 
                    : "bg-slate-50 border-slate-100 text-slate-400 hover:border-blue-200 hover:bg-white"
                } disabled:opacity-30 disabled:scale-100`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                  activeTool === "screwdriver" ? "bg-white text-blue-600" : "bg-white text-slate-300 group-hover:scale-110 transition-transform"
                }`}>
                  <Wrench size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tight">Screwdriver</span>
              </button>

              <button 
                onClick={() => setActiveTool(activeTool === "spanner" ? null : "spanner")}
                disabled={step < 2 || step >= 4}
                className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-4 group ${
                  activeTool === "spanner" 
                    ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200" 
                    : "bg-slate-50 border-slate-100 text-slate-400 hover:border-blue-200 hover:bg-white"
                } disabled:opacity-30 disabled:scale-100`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                  activeTool === "spanner" ? "bg-white text-blue-600" : "bg-white text-slate-300 group-hover:scale-110 transition-transform"
                }`}>
                  <Hammer size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tight">Spanner</span>
              </button>

              <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-200">
                  <BoxIcon size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-tight text-center">Part Tray Locked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="mt-auto space-y-6">
          <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact Potential</p>
                <p className="text-3xl font-black text-emerald-400 tracking-tighter">24L <span className="text-xs text-slate-500 uppercase">Per Day</span></p>
              </div>
              <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                <Droplets className="text-blue-400 animate-pulse" size={32} />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={reset}
              className="p-5 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200 hover:text-slate-600 transition-all active:scale-95"
            >
              <RotateCcw size={20} />
            </button>
            <button 
              disabled={step < 4}
              onClick={() => setStep(0)}
              className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl ${
                step === 4 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              Finalize Repair
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mastery/Completion Overlay */}
      {step === 4 && (
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center p-12 z-50 animate-in fade-in zoom-in duration-700">
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto shadow-2xl border-4 border-white/20">
              <CheckCircle2 size={48} className="text-white" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase leading-none">Repair Success</h2>
            <p className="text-slate-400 mb-10 font-medium text-sm leading-relaxed">
              You have successfully replaced the worn washer and reassembled the unit. You just saved 24 liters of water per day.
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setStep(0)}
                className="w-full py-5 bg-white text-slate-900 font-black rounded-2xl transition-all shadow-xl hover:bg-blue-600 hover:text-white active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-3"
              >
                Log Skill Completion
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={reset}
                className="w-full py-5 bg-white/5 text-slate-400 font-black rounded-2xl transition-all hover:bg-white/10 text-xs uppercase tracking-widest"
              >
                Practice Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
