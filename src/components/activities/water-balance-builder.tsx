"use client";

import React, { useState, useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Text, 
  Html,
  Float,
  Environment,
  RoundedBox,
  ContactShadows,
  Grid
} from "@react-three/drei";
import * as THREE from "three";
import { 
  ArrowRight, 
  Droplets, 
  Zap, 
  ShieldAlert, 
  CheckCircle2,
  TrendingUp,
  Activity,
  Waves,
  ArrowDownRight,
  Plus,
  RotateCcw
} from "lucide-react";

const NODES = {
  sources: [
    { id: 'borewell', name: 'Borewell', color: '#3b82f6', value: 100, icon: '💧' },
    { id: 'tanker', name: 'Tanker', color: '#2563eb', value: 50, icon: '🚚' }
  ],
  usages: [
    { id: 'cooling', name: 'Cooling', color: '#f87171', value: 40, icon: '❄️' },
    { id: 'domestic', name: 'Domestic', color: '#fbbf24', value: 30, icon: '🏠' },
    { id: 'process', name: 'Process', color: '#4ade80', value: 60, icon: '⚙️' }
  ],
  losses: [
    { id: 'leak', name: 'Leaks', color: '#94a3b8', value: 20, icon: '🚰' }
  ]
};

function FlowLine({ start, end, color, width, flow = true }: { start: [number, number, number], end: [number, number, number], color: string, width: number, flow?: boolean }) {
  const curve = useMemo(() => {
    const vStart = new THREE.Vector3(...start);
    const vEnd = new THREE.Vector3(...end);
    const mid1 = new THREE.Vector3(vStart.x + (vEnd.x - vStart.x) * 0.5, vStart.y, vStart.z);
    const mid2 = new THREE.Vector3(vStart.x + (vEnd.x - vStart.x) * 0.5, vEnd.y, vEnd.z);
    return new THREE.CatmullRomCurve3([vStart, mid1, mid2, vEnd]);
  }, [start, end]);

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 40, width, 8, false]} />
        <meshStandardMaterial color={color} transparent opacity={0.2} />
      </mesh>
      {flow && (
        <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
          <mesh>
            <tubeGeometry args={[curve, 40, width * 1.2, 8, false]} />
            <meshStandardMaterial color={color} transparent opacity={0.6} emissive={color} emissiveIntensity={2} />
          </mesh>
        </Float>
      )}
    </group>
  );
}

function NodeCard({ data, position, type }: { data: any, position: [number, number, number], type: string }) {
  return (
    <group position={position}>
      <RoundedBox args={[2.2, 0.9, 0.4]} radius={0.15} smoothness={4}>
        <meshStandardMaterial color={data.color} metalness={0.5} roughness={0.2} />
      </RoundedBox>
      <Html position={[0, 0, 0.25]} center distanceFactor={6}>
        <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl border border-white shadow-xl w-32 flex items-center gap-2">
          <span className="text-lg">{data.icon}</span>
          <div className="flex-1">
            <div className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{type}</div>
            <div className="text-[10px] font-black text-slate-900 truncate leading-tight">{data.name}</div>
          </div>
        </div>
      </Html>
      <Text position={[0, -0.65, 0]} fontSize={0.18} color="white" font="/fonts/Inter-Black.woff">
        {data.value} kL
      </Text>
    </group>
  );
}

export function WaterBalanceBuilder() {
  const [active, setActive] = useState(false);
  
  const totalInput = useMemo(() => NODES.sources.reduce((acc, n) => acc + n.value, 0), []);
  const totalOutput = useMemo(() => 
    NODES.usages.reduce((acc, n) => acc + n.value, 0) + 
    NODES.losses.reduce((acc, n) => acc + n.value, 0), 
  []);
  const balance = totalInput - totalOutput;

  const reset = () => {
    setActive(false);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[750px] bg-white rounded-[3.5rem] overflow-hidden border border-slate-200 shadow-2xl relative">
      {/* LEFT: 3D FLOW PANEL */}
      <div className="relative flex-1 bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-900 overflow-hidden min-h-[450px]">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <Canvas shadows className="w-full h-full">
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
          <OrbitControls enableRotate={true} enablePan={true} minDistance={5} maxDistance={15} />
          
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={200} color="#3b82f6" />
          <Environment preset="night" />

          <group position={[0, 0, 0]}>
            {/* Source Column */}
            {NODES.sources.map((node, i) => (
              <NodeCard key={node.id} data={node} position={[-4, 1.5 - i * 3, 0]} type="SOURCE" />
            ))}

            {/* Hub Node */}
            <group position={[0, 0, 0]}>
              <RoundedBox args={[1.5, 1.5, 0.8]} radius={0.2}>
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.1} />
              </RoundedBox>
              <Text position={[0, 0, 0.5]} fontSize={0.2} color="#3b82f6" fontWeight="900">HUB</Text>
              <Sparkles count={50} scale={2} size={2} speed={0.4} color="#3b82f6" />
            </group>

            {/* Output Column */}
            {NODES.usages.map((node, i) => (
              <NodeCard key={node.id} data={node} position={[4, 2.5 - i * 2, 0]} type="USAGE" />
            ))}
            {NODES.losses.map((node, i) => (
              <NodeCard key={node.id} data={node} position={[4, -3, 0]} type="LOSS" />
            ))}

            {/* Connection Lines */}
            {/* Sources to Hub */}
            <FlowLine start={[-3, 1.5, 0]} end={[-0.75, 0, 0]} color="#3b82f6" width={0.12} />
            <FlowLine start={[-3, -1.5, 0]} end={[-0.75, 0, 0]} color="#3b82f6" width={0.08} />
            
            {/* Hub to Usages */}
            <FlowLine start={[0.75, 0, 0]} end={[3, 2.5, 0]} color="#fbbf24" width={0.06} />
            <FlowLine start={[0.75, 0, 0]} end={[3, 0.5, 0]} color="#fbbf24" width={0.06} />
            <FlowLine start={[0.75, 0, 0]} end={[3, -1.5, 0]} color="#4ade80" width={0.1} />
            <FlowLine start={[0.75, 0, 0]} end={[3, -3, 0]} color="#ef4444" width={0.05} />
          </group>

          <ContactShadows position={[0, -4.5, 0]} opacity={0.6} scale={20} blur={2.5} far={10} color="#000000" />
        </Canvas>

        {/* HUD Elements */}
        <div className="absolute top-10 left-10 pointer-events-none space-y-4">
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">System Flow</span>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Mass Balance</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 pointer-events-none">
          <div className="bg-emerald-500/10 backdrop-blur-md px-6 py-3 rounded-full border border-emerald-500/20 text-emerald-400 flex items-center gap-3">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Real-Time Flow Monitoring Active</span>
          </div>
        </div>
      </div>

      {/* RIGHT: DATA ANALYSIS PANEL */}
      <div className="w-full lg:w-[450px] bg-white flex flex-col p-12 gap-10 overflow-y-auto no-scrollbar">
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Balance Sheet</h3>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <Plus className="w-5 h-5 text-slate-300" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group">
              <div className="relative z-10 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Supply</span>
                  <div className="text-3xl font-black text-blue-600 tracking-tighter">{totalInput} <span className="text-xs uppercase">kL</span></div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Droplets className="w-6 h-6" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group">
              <div className="relative z-10 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Consumption</span>
                  <div className="text-3xl font-black text-slate-900 tracking-tighter">{totalOutput} <span className="text-xs uppercase">kL</span></div>
                </div>
                <div className="w-12 h-12 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform">
                  <ArrowDownRight className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className={`p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden ${
              balance === 0 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-900' 
                : 'bg-red-50 border-red-100 text-red-900'
            }`}>
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black opacity-60 uppercase tracking-widest block mb-1">Unaccounted Gap</span>
                  <div className="text-4xl font-black tracking-tighter">{balance} <span className="text-sm uppercase">kL</span></div>
                </div>
                <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-xl ${
                  balance === 0 ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-red-500 text-white shadow-red-200 animate-pulse'
                }`}>
                  {balance === 0 ? <CheckCircle2 className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl">
            <h4 className="text-sm font-black uppercase tracking-widest mb-4 text-blue-400">Audit Protocol</h4>
            <p className="text-xs font-medium text-slate-400 leading-relaxed mb-6">
              A water balance is only "closed" when Input = Usage + Loss. Any positive gap suggests hidden leaks or unmetered connections.
            </p>
            <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all active:scale-95 shadow-xl">
              Reconcile Audit Data
            </button>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={reset}
              className="p-5 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200 hover:text-slate-600 transition-all active:scale-95"
            >
              <RotateCcw size={20} />
            </button>
            <button 
              onClick={() => setActive(!active)}
              className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl ${
                active 
                  ? 'bg-slate-900 text-white hover:bg-slate-800' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
              }`}
            >
              {active ? 'Lock Reconciliation' : 'Activate Flow Loop'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkles({ count = 20, scale = 1, size = 1, speed = 1, color = 'white' }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * scale;
      p[i * 3 + 1] = (Math.random() - 0.5) * scale;
      p[i * 3 + 2] = (Math.random() - 0.5) * scale;
    }
    return p;
  }, [count, scale]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={size * 0.1} color={color} transparent opacity={0.6} />
    </points>
  );
}
