'use client';

import React, { useState, useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Text, 
  RoundedBox,
  Cylinder,
  Float,
  Environment,
  ContactShadows,
  Sparkles
} from '@react-three/drei';
import * as THREE from 'three';
import { 
  Search, 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Activity, 
  Gauge, 
  Zap,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  RotateCcw,
  Target,
  ShieldCheck,
  Eye,
  TrendingUp,
  Cpu
} from 'lucide-react';

function Digit({ value, position }: { value: number, position: [number, number, number] }) {
  const drumRef = useRef<THREE.Mesh>(null!);
  
  useFrame((_, delta) => {
    if (drumRef.current) {
      const targetRotation = (value - 4.5) * 0.04;
      drumRef.current.rotation.x = THREE.MathUtils.lerp(
        drumRef.current.rotation.x,
        targetRotation,
        delta * 6,
      );
    }
  });

  return (
    <group position={position}>
      <mesh ref={drumRef} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.35, 0.22, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0, 0, 0.36]}>
        <planeGeometry args={[0.24, 0.54]} />
        <meshStandardMaterial color="#020617" />
      </mesh>

      <Text
        position={[0, 0, 0.48]}
        fontSize={0.28}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#0f172a"
      >
        {value}
      </Text>

      <mesh position={[0, 0, 0.56]}>
        <planeGeometry args={[0.24, 0.54]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.08}
          roughness={0}
          metalness={0.1}
          transmission={0.95}
          color="#e2e8f0"
        />
      </mesh>
    </group>
  );
}

function WaterMeter({ reading, flowRate }: { reading: number, flowRate: number }) {
  const digits = reading.toString().padStart(6, '0').split('').map(Number);
  const internalRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (internalRef.current) {
      internalRef.current.rotation.z += flowRate * 0.05;
    }
  });

  return (
    <group rotation={[0.2, -0.2, 0]}>
      <RoundedBox args={[3.2, 2.2, 1.2]} radius={0.3} smoothness={4}>
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
      </RoundedBox>
      
      <mesh position={[0, 0, 0.51]}>
        <planeGeometry args={[2.8, 1.8]} />
        <meshStandardMaterial color="#020617" />
      </mesh>

      <group position={[0, 0.3, 0.55]}>
        <mesh>
          <planeGeometry args={[2.4, 0.7]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <group position={[-0.85, 0, 0.01]}>
          {digits.map((d, i) => (
            <Digit key={i} value={d} position={[i * 0.35, 0, 0]} />
          ))}
        </group>
      </group>

      <group position={[0, -0.4, 0.55]} ref={internalRef}>
        <mesh>
          <circleGeometry args={[0.3, 32]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.8} emissive="#1d4ed8" emissiveIntensity={0.5} />
        </mesh>
        {[0, 1, 2, 3].map(i => (
          <mesh key={i} rotation={[0, 0, i * Math.PI / 2]}>
            <planeGeometry args={[0.05, 0.5]} />
            <meshStandardMaterial color="white" />
          </mesh>
        ))}
      </group>

      <mesh position={[0, 0, 0.7]}>
        <planeGeometry args={[2.8, 1.8]} />
        <meshPhysicalMaterial 
          transparent 
          opacity={0.2} 
          roughness={0} 
          metalness={0.2} 
          transmission={0.9} 
          thickness={0.5} 
          color="#94a3b8"
        />
      </mesh>
    </group>
  );
}

export function MeterDetective() {
  const [day, setDay] = useState(1);
  const [readings] = useState({ 1: 12450, 30: 13820 });
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error", msg: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const checkAnswer = () => {
    const answer = readings[30] - readings[1];
    if (parseInt(input) === answer) {
      setFeedback({ type: "success", msg: "CONSURE: 1,370 kL. DATA INTEGRITY SECURED." });
    } else {
      setFeedback({ type: "error", msg: "ERROR: CALCULATION DISCREPANCY DETECTED. TRY AGAIN." });
    }
  };

  useEffect(() => {
    setIsScanning(true);
    const timer = setTimeout(() => setIsScanning(false), 1500);
    return () => clearTimeout(timer);
  }, [day]);

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[750px] bg-white rounded-[3.5rem] overflow-hidden border border-slate-200 shadow-2xl relative">
      {/* LEFT: 3D METER PANEL */}
      <div className="relative flex-1 bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-900 overflow-hidden min-h-[450px]">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
        />

        <Canvas shadows className="w-full h-full">
          <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
          <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.8} />
          
          <ambientLight intensity={0.2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={500} color="#60a5fa" castShadow />
          <Environment preset="city" />

          <Suspense fallback={null}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
              <WaterMeter reading={readings[day as 1 | 30]} flowRate={day === 30 ? 5 : 0} />
            </Float>
            <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />
            <Sparkles count={40} scale={5} size={1} speed={0.4} color="#60a5fa" />
          </Suspense>
        </Canvas>

        {/* HUD Elements */}
        <div className="absolute top-10 left-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Gauge className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Unit #042</span>
                <div className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                  Flow Analyzer
                </div>
              </div>
            </div>
          </div>
        </div>

        {isScanning && (
          <div className="absolute inset-x-0 h-[2px] bg-blue-500 shadow-[0_0_15px_#3b82f6] z-10 animate-[scan_1.5s_ease-in-out_infinite]" />
        )}

        <div className="absolute bottom-10 left-10 pointer-events-none">
          <div className="bg-blue-600/10 backdrop-blur-md px-6 py-3 rounded-full border border-blue-500/20 text-blue-400 flex items-center gap-3">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isScanning ? 'Scanning Data...' : 'Stable Monitoring'}</span>
          </div>
        </div>
      </div>

      {/* RIGHT: ANALYSIS PANEL */}
      <div className="w-full lg:w-[450px] bg-white flex flex-col p-12 gap-10 overflow-y-auto no-scrollbar">
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
              Investigation
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl text-blue-600">
              <Search size={20} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-1.5 bg-slate-100 rounded-[2.5rem] flex gap-1">
              {[1, 30].map(d => (
                <button 
                  key={d}
                  onClick={() => { setDay(d); setFeedback(null); }}
                  className={`flex-1 py-4 rounded-[2rem] text-[10px] font-black tracking-widest uppercase transition-all ${
                    day === d 
                      ? 'bg-white text-blue-600 shadow-xl' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  DAY {d.toString().padStart(2, '0')}
                </button>
              ))}
            </div>

            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 relative overflow-hidden group">
              <div className="relative z-10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Meter Reading</span>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter font-mono">{readings[day as 1 | 30]}</span>
                  <span className="text-xs font-black text-blue-600 uppercase mb-2 tracking-widest">kiloLitres</span>
                </div>
                <div className="mt-8 h-2 w-full bg-slate-200 rounded-full overflow-hidden border border-white shadow-inner">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-1000 ease-out" 
                    style={{ width: `${(readings[day as 1 | 30] / readings[30]) * 100}%` }} 
                  />
                </div>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target size={120} />
              </div>
            </div>

            <div className="p-8 md:p-10 bg-blue-600 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6 opacity-80">
                  <Calculator className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Consumption Protocol</span>
                </div>
                <div className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-6 md:mb-8 leading-[1.05]">
                  Determine Monthly Consumption
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:items-stretch">
                  <input 
                    type="number"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="ENTER kL"
                    className="min-w-0 flex-1 bg-white/10 border border-white/20 rounded-[1.5rem] px-6 py-4 md:px-8 md:py-5 text-white font-mono placeholder:text-white/20 focus:outline-none focus:ring-4 focus:ring-white/10 transition-all text-lg md:text-xl"
                  />
                  <button 
                    onClick={checkAnswer}
                    className="sm:shrink-0 min-h-14 px-6 md:px-8 bg-white text-blue-600 font-black rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center group-hover:bg-blue-50"
                  >
                    RUN
                  </button>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-6">
          <div className="flex items-start gap-4 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-blue-600">
              <Cpu size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 leading-relaxed">
                Subtract the initial reading (Day 01) from the final reading (Day 30) to determine total water usage.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => { setInput(''); setFeedback(null); }} 
              className="p-5 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200 hover:text-slate-600 transition-all active:scale-95"
            >
              <RotateCcw size={20} />
            </button>
            <button className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
              Export Audit Log <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Overlay */}
      {feedback && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-12 bg-slate-950/40 backdrop-blur-md pointer-events-none">
          <div className={`pointer-events-auto max-w-sm w-full p-12 rounded-[3.5rem] shadow-2xl border-4 animate-in zoom-in duration-500 ${
            feedback.type === 'success' ? 'bg-white border-emerald-500 shadow-emerald-500/20' : 'bg-white border-rose-500 shadow-rose-500/20'
          }`}>
            <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl ${
              feedback.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}>
              {feedback.type === 'success' ? <ShieldCheck size={48} /> : <AlertTriangle size={48} />}
            </div>
            <div className={`text-3xl font-black text-center mb-4 tracking-tighter uppercase ${
              feedback.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {feedback.type === 'success' ? 'VERIFIED' : 'REJECTED'}
            </div>
            <p className="text-slate-500 text-center text-sm font-medium mb-12 leading-relaxed px-4">
              {feedback.msg}
            </p>
            <button 
              onClick={() => setFeedback(null)}
              className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                feedback.type === 'success' ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
              }`}
            >
              {feedback.type === 'success' ? 'Next Analysis' : 'Try Again'}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
