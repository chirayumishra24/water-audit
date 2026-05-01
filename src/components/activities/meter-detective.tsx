"use client";

import React, { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  Float,
  RoundedBox,
  Text,
  Edges,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { 
  Search, 
  Clock, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Droplets,
  Calculator,
  ChevronRight
} from "lucide-react";
import * as THREE from "three";
import { useRouter } from "next/navigation";

// --- 3D Meter Components ---

function MeterDial({ value, index }: { value: number, index: number }) {
  const dialRef = useRef<THREE.Group>(null);
  const targetRotation = (value / 10) * Math.PI * 2;
  
  useFrame(() => {
    if (dialRef.current) {
      dialRef.current.rotation.y = THREE.MathUtils.lerp(dialRef.current.rotation.y, -targetRotation, 0.1);
    }
  });

  return (
    <group position={[index * 0.8 - 1.2, 0, 0]} ref={dialRef}>
      <mesh>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Numbers */}
      {Array.from({ length: 10 }).map((_, i) => (
        <Text
          key={i}
          position={[
            Math.sin((i / 10) * Math.PI * 2) * 0.22,
            Math.cos((i / 10) * Math.PI * 2) * 0.22,
            0.06
          ]}
          fontSize={0.08}
          color="#1e293b"
          font="/fonts/Inter-Bold.woff"
        >
          {i}
        </Text>
      ))}

      {/* Pointer */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.02, 0.15, 0.02]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

function WaterMeter({ reading }: { reading: number[] }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Meter Body */}
      <RoundedBox args={[3.5, 1.2, 0.6]} radius={0.1} position={[0, 0, -0.2]}>
        <meshStandardMaterial color="#1e293b" roughness={0.1} metalness={0.8} />
        <Edges color="#334155" />
      </RoundedBox>

      {/* Display Glass */}
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[3.2, 0.8, 0.05]} />
        <MeshTransmissionMaterial 
          thickness={0.2}
          roughness={0}
          transmission={1}
          ior={1.5}
          color="#94a3b8"
        />
      </mesh>

      {/* Dials */}
      {reading.map((val, i) => (
        <MeterDial key={i} value={val} index={i} />
      ))}

      {/* Label */}
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.15}
        color="#94a3b8"
        font="/fonts/Inter-Medium.woff"
      >
        Industrial Grade Pulse Meter (KL)
      </Text>
    </group>
  );
}

// --- Main Component ---

const SCENARIOS = [
  {
    id: 1,
    title: "The Weekend Drift",
    context: "Production stopped on Friday 6 PM. Check the meter on Monday 8 AM.",
    initialReading: [1, 2, 4, 5],
    finalReading: [1, 2, 6, 8],
    hint: "If the meter moved while machines were off, what does that imply?",
    expectedDelta: 23,
    interpretation: "Baseline Leakage Detected",
    desc: "A change of 23 KL during non-production hours indicates a significant leak or uncontrolled process makeup."
  },
  {
    id: 2,
    title: "Shift Comparison",
    context: "Night shift claims zero water use for cleaning. Check meter from 10 PM to 6 AM.",
    initialReading: [2, 5, 8, 0],
    finalReading: [2, 6, 1, 2],
    hint: "Calculate the total volume used during the 8-hour shift.",
    expectedDelta: 32,
    interpretation: "Unauthorized Consumption",
    desc: "The 32 KL consumption contradicts the 'zero use' claim, suggesting unrecorded cleaning cycles."
  }
];

export function MeterDetective() {
  const router = useRouter();
  const [activeScenario, setActiveScenario] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<null | { type: 'success' | 'error', message: string }>(null);

  const scenario = SCENARIOS[activeScenario];
  
  const handleCheck = () => {
    const val = parseInt(userInput);
    if (val === scenario.expectedDelta) {
      setFeedback({ type: 'success', message: `Correct! ${scenario.interpretation}.` });
      setShowResult(true);
    } else {
      setFeedback({ type: 'error', message: `Incorrect calculation. Try again.` });
    }
  };

  const nextScenario = () => {
    if (activeScenario < SCENARIOS.length - 1) {
      setActiveScenario(prev => prev + 1);
      setShowResult(false);
      setUserInput("");
      setFeedback(null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        
        {/* 3D Meter Display */}
        <div className="lg:col-span-8 bg-slate-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-slate-800">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={35} />
            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
            
            <ambientLight intensity={0.5} />
            <pointLight position={[5, 5, 5]} intensity={1.5} />
            <spotLight position={[-5, 5, 5]} angle={0.2} penumbra={1} intensity={1} />
            
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
              <WaterMeter reading={showResult ? scenario.finalReading : scenario.initialReading} />
            </Float>

            <Environment preset="studio" />
            <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} />
          </Canvas>

          {/* HUD Overlay */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 text-white/80">
              <Clock size={16} className="text-blue-400" />
              <span className="text-xs font-black uppercase tracking-widest">
                {showResult ? 'Reading: Final' : 'Reading: Initial'}
              </span>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center w-full px-12">
            <h4 className="text-white font-black text-xl mb-2">{scenario.title}</h4>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-md mx-auto">{scenario.context}</p>
          </div>
        </div>

        {/* Investigation Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                <Search size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Case Investigation</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Your Calculation</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="number"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enter KL volume..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <button 
                    onClick={handleCheck}
                    className="h-14 w-14 bg-blue-600 rounded-xl text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                  >
                    <Calculator size={24} />
                  </button>
                </div>
              </div>

              {feedback && (
                <div className={`p-4 rounded-2xl flex gap-3 animate-in slide-in-from-top-2 ${
                  feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                }`}>
                  {feedback.type === 'success' ? <CheckCircle2 className="shrink-0" /> : <AlertCircle className="shrink-0" />}
                  <p className="text-xs font-bold leading-relaxed">{feedback.message}</p>
                </div>
              )}

              {showResult && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-blue-900 animate-in zoom-in">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} />
                    <span className="text-xs font-black uppercase">Interpretation</span>
                  </div>
                  <p className="text-xs font-medium leading-relaxed">{scenario.desc}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-[2rem] text-white flex flex-col gap-4">
            {showResult ? (
              activeScenario < SCENARIOS.length - 1 ? (
                <button
                  onClick={nextScenario}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center gap-3 font-black transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                >
                  Next Investigation
                  <ArrowRight size={20} />
                </button>
              ) : (
                <button
                  onClick={() => router.push('/2-4')}
                  className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center gap-3 font-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                >
                  Complete Module
                  <CheckCircle2 size={20} />
                </button>
              )
            ) : (
              <button
                disabled
                className="w-full h-14 bg-white/10 text-white/30 rounded-xl flex items-center justify-center gap-3 font-black cursor-not-allowed"
              >
                Solve Case to Proceed
              </button>
            )}

            <button 
              onClick={() => {
                setActiveScenario(0);
                setShowResult(false);
                setUserInput("");
                setFeedback(null);
              }}
              className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
            >
              <RotateCcw size={12} /> Reset Activity
            </button>
          </div>
        </div>
      </div>

      {/* Audit Best Practices */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Droplets size={20} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-1">Billing vs Line</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">Billing meters tell you what the utility sees; line meters tell you what actually enters a branch.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-1">Interval Logging</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">Reading meters at consistent intervals (e.g. shift start/end) is critical for identifying leaks.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-1">Baseline Flow</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">Flow during idle periods (night/weekends) is your biggest clue for identifying hidden system losses.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
