'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
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
  MeshDistortMaterial,
  Sparkles
} from '@react-three/drei';
import * as THREE from 'three';
import { Search, Calculator, CheckCircle2, AlertTriangle, ArrowRight, Activity, Gauge, Zap } from 'lucide-react';

function Digit({ value, position }: { value: number, position: [number, number, number] }) {
  const mesh = useRef<THREE.Group>(null!);
  
  useFrame((state, delta) => {
    if (mesh.current) {
      const targetRotation = (value * Math.PI * 2) / 10;
      mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, targetRotation, delta * 8);
    }
  });

  return (
    <group position={position} ref={mesh}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <Text
          key={n}
          position={[0, 0, 0.4]}
          rotation={[-(n * Math.PI * 2) / 10, 0, 0]}
          fontSize={0.28}
          font="/fonts/Inter-Black.woff"
          color="white"
          anchorY="middle"
        >
          {n}
        </Text>
      ))}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.35, 0.22, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function WaterPipe({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main Pipe */}
      <mesh>
        <cylinderGeometry args={[0.35, 0.35, 4, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Flange */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />
        <meshStandardMaterial color="#64748b" metalness={1} roughness={0} />
      </mesh>
      {/* Bolts */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[Math.cos(i * Math.PI / 3) * 0.4, -1.8, Math.sin(i * Math.PI / 3) * 0.4]}>
          <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      ))}
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
    <group rotation={[0, -0.4, 0]}>
      <WaterPipe position={[-3.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
      <WaterPipe position={[3.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]} />

      {/* Outer Case */}
      <RoundedBox args={[3.2, 2.2, 1.2]} radius={0.3} smoothness={4}>
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
      </RoundedBox>
      
      {/* Inset Area */}
      <mesh position={[0, 0, 0.51]}>
        <planeGeometry args={[2.8, 1.8]} />
        <meshStandardMaterial color="#020617" />
      </mesh>

      {/* Brass Connections */}
      <Cylinder args={[0.45, 0.45, 1, 32]} rotation={[0, 0, Math.PI / 2]} position={[2.1, 0, 0]}>
        <meshStandardMaterial color="#b45309" metalness={0.9} roughness={0.1} />
      </Cylinder>
      <Cylinder args={[0.45, 0.45, 1, 32]} rotation={[0, 0, Math.PI / 2]} position={[-2.1, 0, 0]}>
        <meshStandardMaterial color="#b45309" metalness={0.9} roughness={0.1} />
      </Cylinder>

      {/* Main Dial Window */}
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

      {/* Spinning Internal Turbine (Visual only) */}
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

      {/* Decorative Labels */}
      <Text position={[-0.8, -0.4, 0.6]} fontSize={0.08} color="#64748b" font="/fonts/Inter-Bold.woff">FLOW</Text>
      <Text position={[0.8, -0.4, 0.6]} fontSize={0.08} color="#64748b" font="/fonts/Inter-Bold.woff">RATE</Text>

      {/* Glass Cover */}
      <mesh position={[0, 0, 0.7]}>
        <planeGeometry args={[2.8, 1.8]} />
        <meshPhysicalMaterial 
          transparent 
          opacity={0.3} 
          roughness={0} 
          metalness={0.2} 
          transmission={0.9} 
          thickness={0.5} 
          color="#94a3b8"
        />
      </mesh>

      <Sparkles count={20} scale={3} size={1} speed={0.4} color="#60a5fa" />
    </group>
  );
}

export function MeterDetective() {
  const [day, setDay] = useState(1);
  const [readings] = useState({ 1: 12450, 30: 13820 });
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const checkAnswer = () => {
    const answer = readings[30] - readings[1];
    if (parseInt(input) === answer) {
      setFeedback({ type: 'success', msg: "SYSTEM SECURED: DATA VERIFIED" });
    } else {
      setFeedback({ type: 'error', msg: "ERROR: CALCULATION MISMATCH" });
    }
  };

  useEffect(() => {
    setIsScanning(true);
    const timer = setTimeout(() => setIsScanning(false), 1500);
    return () => clearTimeout(timer);
  }, [day]);

  const progress = (day === 1 ? 0 : 100);

  return (
    <div className="w-full h-[700px] bg-[#020617] rounded-[3.5rem] overflow-hidden relative border-[12px] border-[#0f172a] shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 7]} />
        <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.8} />
        
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#60a5fa" castShadow />
        <pointLight position={[-10, -5, -10]} intensity={1} color="#1d4ed8" />
        <Environment preset="city" />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <WaterMeter reading={readings[day as 1 | 30]} flowRate={day === 30 ? 5 : 0} />
        </Float>

        <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />
      </Canvas>

      {/* Cyber HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none border-[1px] border-blue-500/20 m-6 rounded-[2.5rem]">
        {/* Scan Line Animation */}
        {isScanning && (
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/40 shadow-[0_0_20px_#3b82f6] animate-[scan_1.5s_ease-in-out_infinite]" />
        )}

        {/* HUD Elements */}
        <div className="absolute top-8 left-8 flex items-center gap-4 bg-black/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-blue-400">
          <Activity className="w-5 h-5 animate-pulse" />
          <div>
            <div className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">Status</div>
            <div className="text-xs font-black tracking-widest">{isScanning ? 'SCANNING...' : 'MONITORING'}</div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 text-right bg-black/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-slate-400">
          <div className="text-[8px] font-black uppercase tracking-[0.2em] mb-1">System Version</div>
          <div className="text-[10px] font-mono tracking-widest">v4.2.0-STITCH</div>
        </div>
      </div>

      {/* Main Control HUD */}
      <div className="absolute top-8 left-8 right-8 bottom-8 pointer-events-none flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="bg-slate-900/80 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl text-white pointer-events-auto w-72">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/40">
                <Gauge className="text-blue-400 w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white italic tracking-tighter">DATA <span className="text-blue-500">AUDIT</span></h2>
            </div>
            
            <div className="flex gap-3 mb-8">
              {[1, 30].map(d => (
                <button 
                  key={d}
                  onClick={() => { setDay(d); setFeedback(null); }}
                  className={`flex-1 py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all ${day === d ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                  DAY {d.toString().padStart(2, '0')}
                </button>
              ))}
            </div>

            <div className="space-y-4 mb-8 bg-black/40 p-5 rounded-3xl border border-white/5">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Current Reading</span>
                <div className="text-right">
                  <span className="text-2xl font-mono font-black text-white">{readings[day as 1 | 30]}</span>
                  <span className="text-xs font-black text-blue-500 ml-2 italic">kL</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-1000 ease-out" style={{ width: `${(readings[day as 1 | 30] / readings[30]) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">Submit Calculation</label>
              <div className="flex gap-3">
                <input 
                  type="number" 
                  placeholder="CONS."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/10"
                />
                <button 
                  onClick={checkAnswer}
                  className="bg-white text-black hover:bg-blue-500 hover:text-white px-6 rounded-2xl font-black text-[10px] transition-all shadow-xl active:scale-95"
                >
                  RUN
                </button>
              </div>
            </div>
          </div>

          {/* Formula HUD */}
          <div className="bg-black/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 text-white flex flex-col items-center gap-4 pointer-events-auto">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Calculator className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-center">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Protocol</p>
              <p className="text-sm font-black italic tracking-tight">V(f) - V(i)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Modal */}
      {feedback && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 pointer-events-none">
          <div className={`pointer-events-auto max-w-sm w-full p-8 rounded-[3rem] border-2 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in duration-300 ${
            feedback.type === 'success' ? 'bg-[#020617]/95 border-green-500/50' : 'bg-[#020617]/95 border-red-500/50'
          }`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
              feedback.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {feedback.type === 'success' ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>
            <h3 className={`text-xl font-black text-center mb-2 tracking-widest ${
              feedback.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>
              {feedback.type === 'success' ? 'VERIFIED' : 'FAILED'}
            </h3>
            <p className="text-white/60 text-center text-sm font-medium mb-8 leading-relaxed">
              {feedback.msg}
            </p>
            <button 
              onClick={() => setFeedback(null)}
              className={`w-full py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all ${
                feedback.type === 'success' ? 'bg-green-600 text-white' : 'bg-slate-800 text-white'
              }`}
            >
              {feedback.type === 'success' ? 'PROCEED TO MODULE 3' : 'RECALIBRATE'}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
