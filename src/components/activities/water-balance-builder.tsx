'use client';

import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Text, 
  Html,
  Float,
  Environment,
  RoundedBox
} from '@react-three/drei';
import * as THREE from 'three';
import { ArrowRight, Droplets, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';

const NODES = {
  sources: [
    { id: 'borewell', name: 'Borewell', color: '#60a5fa', value: 100 },
    { id: 'tanker', name: 'Tanker', color: '#3b82f6', value: 50 }
  ],
  usages: [
    { id: 'cooling', name: 'Cooling Tower', color: '#f87171', value: 40 },
    { id: 'domestic', name: 'Domestic', color: '#fbbf24', value: 30 },
    { id: 'process', name: 'Process', color: '#4ade80', value: 60 }
  ],
  losses: [
    { id: 'leak', name: 'Leaks', color: '#94a3b8', value: 20 }
  ]
};

function Connection({ start, end, color, width }: { start: [number, number, number], end: [number, number, number], color: string, width: number }) {
  const curve = useMemo(() => {
    const vStart = new THREE.Vector3(...start);
    const vEnd = new THREE.Vector3(...end);
    const mid1 = new THREE.Vector3(vStart.x + (vEnd.x - vStart.x) / 2, vStart.y, vStart.z);
    const mid2 = new THREE.Vector3(vStart.x + (vEnd.x - vStart.x) / 2, vEnd.y, vEnd.z);
    return new THREE.CatmullRomCurve3([vStart, mid1, mid2, vEnd]);
  }, [start, end]);

  return (
    <mesh>
      <tubeGeometry args={[curve, 20, width, 8, false]} />
      <meshStandardMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

function Node({ data, position, type }: { data: any, position: [number, number, number], type: string }) {
  return (
    <group position={position}>
      <RoundedBox args={[2, 0.8, 0.5]} radius={0.1} smoothness={4}>
        <meshStandardMaterial color={data.color} />
      </RoundedBox>
      <Text
        position={[0, 0, 0.3]}
        fontSize={0.2}
        color="white"
      >
        {data.name}
      </Text>
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.15}
        color="#64748b"
      >
        {data.value} kL
      </Text>
    </group>
  );
}

export function WaterBalanceBuilder() {
  const [active, setActive] = useState(false);

  const totalInput = NODES.sources.reduce((acc, n) => acc + n.value, 0);
  const totalOutput = NODES.usages.reduce((acc, n) => acc + n.value, 0) + NODES.losses.reduce((acc, n) => acc + n.value, 0);
  const balance = totalInput - totalOutput;

  return (
    <div className="w-full h-[650px] bg-slate-900 rounded-[3rem] overflow-hidden relative border-8 border-slate-800 shadow-2xl">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <OrbitControls enableZoom={false} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#60a5fa" />
        <Environment preset="night" />

        <group position={[-1, 0, 0]}>
          {/* Sources */}
          {NODES.sources.map((node, i) => (
            <Node key={node.id} data={node} position={[-5, 2 - i * 4, 0]} type="source" />
          ))}

          {/* Usage/Losses */}
          {NODES.usages.map((node, i) => (
            <Node key={node.id} data={node} position={[5, 3 - i * 2, 0]} type="usage" />
          ))}
          {NODES.losses.map((node, i) => (
            <Node key={node.id} data={node} position={[5, -3, 0]} type="loss" />
          ))}

          {/* Connections (Static for demo, but represent the logic) */}
          <Connection start={[-4, 2, 0]} end={[4, 3, 0]} color="#60a5fa" width={0.1} />
          <Connection start={[-4, 2, 0]} end={[4, 1, 0]} color="#60a5fa" width={0.08} />
          <Connection start={[-4, -2, 0]} end={[4, -1, 0]} color="#3b82f6" width={0.12} />
          <Connection start={[-4, -2, 0]} end={[4, -3, 0]} color="#3b82f6" width={0.05} />
        </group>

        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <Text
            position={[0, 4.5, 0]}
            fontSize={0.4}
            color="white"
          >
            3D WATER BALANCE
          </Text>
        </Float>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-6 left-6 w-72 pointer-events-none">
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl pointer-events-auto">
          <h2 className="text-xl font-black text-white mb-4 tracking-tight">BALANCE <span className="text-blue-500">SHEET</span></h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Total Input</span>
              <span className="text-blue-400 font-mono text-lg">{totalInput} kL</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Total Output</span>
              <span className="text-red-400 font-mono text-lg">{totalOutput} kL</span>
            </div>
            <div className="h-px bg-white/5 w-full" />
            <div className={`p-3 rounded-xl flex items-center justify-between ${balance === 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              <span className="text-[10px] font-black uppercase">Gap</span>
              <span className="font-mono text-lg">{balance} kL</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 left-6 md:left-auto md:w-80">
        <div className="bg-blue-600 p-6 rounded-[2rem] shadow-2xl text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="shrink-0 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <p className="font-bold text-xs leading-tight">Close the gap between input and output. 0 kL means perfection!</p>
          </div>
          <button className="w-full bg-white text-blue-600 font-black py-3 rounded-xl shadow-xl hover:scale-105 transition-transform text-sm">
            RECONCILE DATA
          </button>
        </div>
      </div>
    </div>
  );
}
