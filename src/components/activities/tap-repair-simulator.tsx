"use client";

import React, { useState, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Float,
  ContactShadows,
  Html,
  useCursor,
  Grid,
} from "@react-three/drei";
import { 
  Wrench, 
  Droplets, 
  CheckCircle2, 
  RotateCcw, 
  Info,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import * as THREE from "three";

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
      {/* Workbench */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
      </mesh>
      <Grid
        infiniteGrid
        fadeDistance={20}
        fadeStrength={5}
        cellSize={0.5}
        sectionSize={2.5}
        sectionThickness={1.5}
        sectionColor="#2563eb"
        cellColor="#94a3b8"
      />

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
        <mesh 
          castShadow 
          position={[0, 0.9, 0]}
          onPointerOver={() => setHovered('spindle')}
          onPointerOut={() => setHovered(null)}
          onClick={() => onPartClick('spindle')}
        >
          <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
          <meshStandardMaterial 
            color={hovered === 'spindle' ? "#fbbf24" : "#b45309"} 
            metalness={0.9} 
            roughness={0.1} 
          />
          {hovered === 'spindle' && (
            <Html distanceFactor={2}>
              <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded border border-blue-200 text-[10px] font-bold text-blue-600 uppercase tracking-widest shadow-xl whitespace-nowrap">
                Spindle
              </div>
            </Html>
          )}
        </mesh>
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
            <Html distanceFactor={2}>
              <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded border border-blue-200 text-[10px] font-bold text-blue-600 uppercase tracking-widest shadow-xl whitespace-nowrap">
                Tap Handle
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
          <Html distanceFactor={2}>
            <div className="bg-red-500/90 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-widest shadow-xl whitespace-nowrap">
              Worn Washer
            </div>
          </Html>
        </group>
      )}

      {/* Water Drip Effect */}
      {step === 0 && (
        <Float speed={5} rotationIntensity={0} floatIntensity={1}>
          <mesh position={[0.55, 0.5, 0]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color="#60a5fa" transparent opacity={0.6} />
          </mesh>
        </Float>
      )}
    </group>
  );
}

// --- Main Activity ---

export function TapRepairSimulator() {
  const [step, setStep] = useState(0);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [status, setStatus] = useState("Water Pressure: ON");
  const [inventory, setInventory] = useState<string[]>([]);
  
  const steps = [
    { 
      title: "Isolate Water", 
      desc: "Turn off the mains valve before starting repairs.",
      instruction: "Click the status panel to isolate water." 
    },
    { 
      title: "Remove Handle", 
      desc: "Use the screwdriver to loosen the handle screw.",
      instruction: "Select Screwdriver and click the Handle."
    },
    { 
      title: "Extract Spindle", 
      desc: "Use the spanner to unscrew the spindle assembly.",
      instruction: "Select Spanner and click the Spindle."
    },
    { 
      title: "Replace Washer", 
      desc: "Remove the worn washer and install a new one.",
      instruction: "Click the Worn Washer to remove it."
    },
    { 
      title: "Reassemble", 
      desc: "Reverse the steps to put the tap back together.",
      instruction: "Click 'Complete Reassembly' below."
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
    <div className="relative w-full h-[600px] bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
      <Canvas shadows className="w-full h-full">
        <PerspectiveCamera makeDefault position={[3, 3, 3]} fov={50} />
        <OrbitControls 
          enablePan={false} 
          minDistance={2} 
          maxDistance={6}
          maxPolarAngle={Math.PI / 2.1}
        />
        
        <ambientLight intensity={0.8} />
        <spotLight position={[5, 10, 5]} angle={0.15} penumbra={1} intensity={150} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={50} color="#3b82f6" />
        
        <Suspense fallback={null}>
          <TapModel step={step} activeTool={activeTool} onPartClick={handlePartClick} />
          <Environment preset="city" />
          <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
        </Suspense>
      </Canvas>

      {/* TOP HUD: MISSION CONTROL */}
      <div className="absolute top-6 left-6 right-6 flex items-start justify-between pointer-events-none">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-2xl pointer-events-auto max-w-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tighter">Mission 3.1: Tap Repair</h2>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 w-6 rounded-full transition-all duration-500 ${i <= step ? 'bg-blue-600' : 'bg-slate-200'}`} 
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  STEP {step + 1}/5
                </span>
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-1">{steps[step]?.title}</h3>
          <p className="text-sm text-slate-600 mb-4">{steps[step]?.desc}</p>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <p className="text-xs font-medium text-blue-800 italic">{steps[step]?.instruction}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pointer-events-auto">
          <button 
            onClick={toggleWater}
            disabled={step !== 0}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl transition-all shadow-xl group ${
              status.includes("OFF") 
                ? "bg-green-500/10 border-green-200 text-green-700" 
                : "bg-red-500/10 border-red-200 text-red-700 hover:scale-105 active:scale-95"
            }`}
          >
            <ShieldCheck className={`w-5 h-5 ${status.includes("OFF") ? "animate-pulse" : ""}`} />
            <span className="text-sm font-bold tracking-tight">{status}</span>
          </button>

          {step >= 1 && (
            <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-white shadow-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-3">Tactical HUD / Tools</span>
              <div className="flex gap-3">
                <button 
                  onClick={() => setActiveTool(activeTool === "screwdriver" ? null : "screwdriver")}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                    activeTool === "screwdriver" ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-slate-50 border-slate-200 text-slate-400 hover:border-blue-400"
                  }`}
                >
                  <Wrench className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setActiveTool(activeTool === "spanner" ? null : "spanner")}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                    activeTool === "spanner" ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-slate-50 border-slate-200 text-slate-400 hover:border-blue-400"
                  }`}
                >
                  <Wrench className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM HUD: PART TRAY */}
      {step === 4 ? (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-2xl flex flex-col items-center gap-6 max-w-md w-full animate-in fade-in slide-in-from-bottom-10">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-200">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Repair Complete!</h3>
            <p className="text-slate-600 text-sm">You've successfully replaced the worn washer and reassembled the tap. You just saved up to 24 liters of water per day!</p>
          </div>
          <button 
            onClick={reset}
            className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-xl"
          >
            <RotateCcw className="w-4 h-4" />
            Practice Again
          </button>
        </div>
      ) : (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <div className="bg-white/80 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white shadow-2xl flex items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Part Tray</span>
              <div className="w-[1px] h-6 bg-slate-200" />
            </div>
            <div className="flex gap-4">
              {['New Washer', 'O-Ring', 'Jumper Valve'].map((item) => (
                <div key={item} className="group relative">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center text-slate-300 hover:border-blue-400 transition-all cursor-not-allowed">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none uppercase tracking-widest font-bold">
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
