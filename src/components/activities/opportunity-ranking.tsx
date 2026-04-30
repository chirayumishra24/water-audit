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
  Sparkles,
  Edges
} from "@react-three/drei";
import { 
  Target, 
  CheckCircle2, 
  RotateCcw, 
  Zap,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Droplets,
  Layers
} from "lucide-react";
import * as THREE from "three";

// --- 3D Visualization: The Abstract Facility ---
function AbstractFacility({ placedIds }: { placedIds: number[] }) {
  const facilityRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (facilityRef.current) {
      facilityRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={facilityRef} position={[0, -1, 0]}>
      {/* Base Platform */}
      <RoundedBox args={[6, 0.4, 6]} radius={0.1} position={[0, -0.2, 0]}>
        <meshStandardMaterial color="#f1f5f9" roughness={0.2} metalness={0.8} />
        <Edges color="#cbd5e1" />
      </RoundedBox>

      {/* Main Building */}
      <RoundedBox args={[2.5, 3, 2.5]} radius={0.1} position={[-1, 1.5, -1]}>
        <MeshTransmissionMaterial 
          backside 
          thickness={0.5} 
          roughness={0.1} 
          transmission={1} 
          ior={1.5} 
          color="#bae6fd" 
        />
        <Edges color="#38bdf8" />
      </RoundedBox>

      {/* Dynamic Elements based on placed findings */}
      
      {/* 1. Fix Restroom Leaks -> Water Particles inside building stop leaking */}
      {placedIds.includes(1) ? (
        <Sparkles count={50} scale={[2, 2, 2]} position={[-1, 1.5, -1]} color="#38bdf8" speed={0.5} size={2} />
      ) : (
        <Sparkles count={100} scale={[2, 0.5, 2]} position={[-1, 0, -1]} color="#ef4444" speed={2} size={4} />
      )}

      {/* 2. Install Sub-meters -> Glowing Rings around the pipes */}
      <group position={[1.5, 0.5, 1.5]}>
        <cylinderGeometry args={[0.2, 0.2, 2]} />
        <meshStandardMaterial color="#94a3b8" />
        {placedIds.includes(2) && (
          <Float speed={5} rotationIntensity={2}>
            <mesh position={[0, 0, 0]}>
              <torusGeometry args={[0.4, 0.05, 16, 32]} />
              <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2} />
            </mesh>
          </Float>
        )}
      </group>

      {/* 3. Greywater Reuse -> New Storage Tank Appears */}
      <Float speed={2} floatIntensity={placedIds.includes(3) ? 1 : 0}>
        <RoundedBox args={[1.5, 2, 1.5]} radius={0.1} position={[1.5, placedIds.includes(3) ? 1 : -2, -1.5]}>
          <meshStandardMaterial color="#10b981" roughness={0.3} metalness={0.5} transparent opacity={placedIds.includes(3) ? 1 : 0} />
          <Edges color="#059669" />
        </RoundedBox>
      </Float>

      {/* 4. Flow Aerators -> Blue cones on top */}
      {placedIds.includes(4) && (
        <group position={[-1, 3.2, -1]}>
          <mesh rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.5, 1, 16]} />
            <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={1} />
          </mesh>
        </group>
      )}

      {/* 6. Borewell Recharge -> Ground glowing pulse */}
      {placedIds.includes(6) && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <ringGeometry args={[1, 2.5, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}

    </group>
  );
}

// --- Main UI Component ---

const FINDINGS = [
  { id: 1, title: "Fix Restroom Leaks", impact: "High", effort: "Low", category: "Maintenance", desc: "Repair all dripping taps and leaking flushes." },
  { id: 2, title: "Install Sub-meters", impact: "High", effort: "High", category: "Measurement", desc: "Add smart meters to cooling towers and blocks." },
  { id: 3, title: "Greywater Reuse", impact: "High", effort: "High", category: "Capital", desc: "Route sink water to flush toilets." },
  { id: 4, title: "Flow Aerators", impact: "Moderate", effort: "Low", category: "Quick Win", desc: "Install 3LPM aerators on all washbasin taps." },
  { id: 5, title: "Garden Timer", impact: "Low", effort: "Low", category: "Quick Win", desc: "Automate sprinklers to run only at night." },
  { id: 6, title: "Borewell Recharge", impact: "High", effort: "Moderate", category: "Capital", desc: "Build recharge pits for rainwater." },
];

export function OpportunityRanking() {
  const [placedItems, setPlacedItems] = useState<Record<number, string>>({});
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const quadrants = [
    { id: "quick-wins", title: "Quick Wins", color: "bg-emerald-500", border: "border-emerald-500", text: "text-emerald-700", icon: Zap, label: "High Impact, Low Effort" },
    { id: "major-projects", title: "Major Projects", color: "bg-blue-500", border: "border-blue-500", text: "text-blue-700", icon: TrendingUp, label: "High Impact, High Effort" },
    { id: "fill-ins", title: "Fill-ins", color: "bg-amber-500", border: "border-amber-500", text: "text-amber-700", icon: Clock, label: "Low Impact, Low Effort" },
    { id: "thankless", title: "Thankless Tasks", color: "bg-rose-500", border: "border-rose-500", text: "text-rose-700", icon: AlertTriangle, label: "Low Impact, High Effort" },
  ];

  const handlePlace = (quadrantId: string) => {
    if (activeItem !== null) {
      setPlacedItems(prev => ({ ...prev, [activeItem]: quadrantId }));
      setActiveItem(null);
    }
  };

  const placedCount = Object.keys(placedItems).length;
  const isComplete = placedCount === FINDINGS.length;
  const placedIds = Object.keys(placedItems).map(Number);

  return (
    <div className="w-full min-h-[800px] flex flex-col xl:flex-row gap-8 bg-slate-50/50 p-6 md:p-10 rounded-[3rem] border border-slate-200">
      
      {/* LEFT: 2D Interactive Matrix */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Triage Matrix</h3>
            <p className="text-slate-500 font-medium mt-1">Classify the findings to build your action plan.</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <span className="text-blue-600 font-black">{placedCount}</span>
            <span className="text-slate-400 font-bold">/ {FINDINGS.length} Placed</span>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1 min-h-[400px]">
          {quadrants.map(q => {
            const itemsInQuadrant = FINDINGS.filter(f => placedItems[f.id] === q.id);
            const isTarget = activeItem !== null;
            
            return (
              <button
                key={q.id}
                onClick={() => handlePlace(q.id)}
                disabled={activeItem === null}
                className={`relative p-6 rounded-[2rem] border-2 transition-all flex flex-col text-left overflow-hidden
                  ${isTarget ? `hover:scale-[1.02] hover:shadow-xl ${q.border} bg-white shadow-md cursor-pointer animate-pulse` : 'bg-white/50 border-slate-200'}
                `}
              >
                {/* Background Decor */}
                <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full ${q.color} opacity-10 blur-2xl`} />
                
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-xl ${q.color} text-white`}>
                    <q.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{q.title}</h4>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${q.text}`}>{q.label}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 flex-1">
                  {itemsInQuadrant.map(f => (
                    <div key={f.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between shadow-sm animate-in zoom-in duration-300">
                      <span className="text-xs font-bold text-slate-800">{f.title}</span>
                      <CheckCircle2 size={16} className={q.text} />
                    </div>
                  ))}
                  {itemsInQuadrant.length === 0 && !isTarget && (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
                      <span className="text-xs font-bold text-slate-400">Empty</span>
                    </div>
                  )}
                  {itemsInQuadrant.length === 0 && isTarget && (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-blue-400 bg-blue-50/50 rounded-xl">
                      <span className="text-xs font-bold text-blue-600 animate-bounce">Click to place here</span>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* RIGHT: 3D Visualization & Inbox */}
      <div className="w-full xl:w-[500px] flex flex-col gap-6">
        {/* 3D View */}
        <div className="h-[400px] bg-white rounded-[2rem] border border-slate-200 shadow-lg relative overflow-hidden">
          <Canvas camera={{ position: [5, 4, 5], fov: 45 }}>
            <color attach="background" args={["#f8fafc"]} />
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
            <AbstractFacility placedIds={placedIds} />
            <Environment preset="city" />
            <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={10} blur={2} />
            <OrbitControls enableZoom={false} autoRotate={placedCount === FINDINGS.length} autoRotateSpeed={2} />
          </Canvas>
          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 shadow-sm flex items-center gap-2">
            <Layers size={16} className="text-blue-600" />
            Facility Digital Twin
          </div>
        </div>

        {/* Inbox / Deck */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex-1 flex flex-col">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Unclassified Findings</h3>
          
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto no-scrollbar">
            {FINDINGS.filter(f => !placedItems[f.id]).map(f => (
              <button
                key={f.id}
                onClick={() => setActiveItem(activeItem === f.id ? null : f.id)}
                className={`text-left p-4 rounded-2xl border-2 transition-all ${
                  activeItem === f.id 
                    ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]' 
                    : 'border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900">{f.title}</h4>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white px-2 py-1 rounded-full text-slate-500 border border-slate-200">
                    {f.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3">{f.desc}</p>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-blue-600">Impact: {f.impact}</span>
                  <span className="text-amber-600">Effort: {f.effort}</span>
                </div>
              </button>
            ))}

            {isComplete && (
              <div className="flex flex-col items-center justify-center flex-1 text-center animate-in fade-in zoom-in">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">Plan Optimized</h4>
                <p className="text-sm text-slate-500 font-medium mb-6">All findings have been classified.</p>
                <button 
                  onClick={() => { setPlacedItems({}); setActiveItem(null); }}
                  className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
                >
                  <RotateCcw size={14} /> Reset Activity
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
