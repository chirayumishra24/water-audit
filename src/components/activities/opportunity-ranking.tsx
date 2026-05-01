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
  Edges,
  Text
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
  Layers,
  ChevronRight,
  BarChart3,
  DollarSign
} from "lucide-react";
import * as THREE from "three";
import { useRouter } from "next/navigation";

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

      {/* 1. Fix Restroom Leaks -> Water Particles stop leaking */}
      {placedIds.includes(1) ? (
        <Sparkles count={50} scale={[2, 2, 2]} position={[-1, 1.5, -1]} color="#38bdf8" speed={0.5} size={2} />
      ) : (
        <Sparkles count={100} scale={[2, 0.5, 2]} position={[-1, 0, -1]} color="#ef4444" speed={2} size={4} />
      )}

      {/* 2. Install Sub-meters -> Smart Meter Nodes */}
      <group position={[1.5, 0.5, 1.5]}>
        <cylinderGeometry args={[0.2, 0.2, 2]} />
        <meshStandardMaterial color="#94a3b8" />
        {placedIds.includes(2) && (
          <Float speed={5} rotationIntensity={2}>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2} />
            </mesh>
            <Text position={[0, 0.5, 0]} fontSize={0.2} color="#f59e0b">METER ACTIVE</Text>
          </Float>
        )}
      </group>

      {/* 3. Greywater Reuse -> Recycling Tank */}
      {placedIds.includes(3) && (
        <Float speed={2}>
          <RoundedBox args={[1.5, 2, 1.5]} radius={0.1} position={[1.5, 1, -1.5]}>
            <meshStandardMaterial color="#10b981" roughness={0.3} metalness={0.5} />
            <Edges color="#059669" />
          </RoundedBox>
          <Text position={[1.5, 2.5, -1.5]} fontSize={0.2} color="#10b981">RECYCLE</Text>
        </Float>
      )}

      {/* 4. Flow Aerators -> Efficiency Markers */}
      {placedIds.includes(4) && (
        <group position={[-1, 3.2, -1]}>
          <Sparkles count={20} scale={[1, 1, 1]} color="#0ea5e9" size={5} />
          <Text position={[0, 0.5, 0]} fontSize={0.2} color="#0ea5e9">EFFICIENT</Text>
        </group>
      )}

      {/* 6. Borewell Recharge -> Ground Ripple */}
      {placedIds.includes(6) && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <ringGeometry args={[1, 2.8, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}

    </group>
  );
}

// --- Main UI Component ---

const FINDINGS = [
  { id: 1, title: "Fix Restroom Leaks", impact: 8, effort: 2, category: "Maintenance", desc: "Repair all dripping taps and leaking flushes." },
  { id: 2, title: "Install Sub-meters", impact: 9, effort: 7, category: "Measurement", desc: "Add smart meters to cooling towers and blocks." },
  { id: 3, title: "Greywater Reuse", impact: 10, effort: 9, category: "Capital", desc: "Route sink water to flush toilets." },
  { id: 4, title: "Flow Aerators", impact: 6, effort: 1, category: "Quick Win", desc: "Install 3LPM aerators on all washbasin taps." },
  { id: 5, title: "Garden Timer", impact: 3, effort: 2, category: "Quick Win", desc: "Automate sprinklers to run only at night." },
  { id: 6, title: "Borewell Recharge", impact: 7, effort: 5, category: "Capital", desc: "Build recharge pits for rainwater." },
];

export function OpportunityRanking() {
  const router = useRouter();
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

  // ROI Logic
  const totalImpact = useMemo(() => {
    return Object.keys(placedItems).reduce((acc, id) => {
      const finding = FINDINGS.find(f => f.id === Number(id));
      return acc + (finding?.impact || 0);
    }, 0);
  }, [placedItems]);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-[800px]">
        
        {/* LEFT: 2D Interactive Matrix (Col 7) */}
        <div className="xl:col-span-7 flex flex-col gap-6">
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
          <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1 min-h-[500px]">
            {quadrants.map(q => {
              const itemsInQuadrant = FINDINGS.filter(f => placedItems[f.id] === q.id);
              const isTarget = activeItem !== null;
              
              return (
                <button
                  key={q.id}
                  onClick={() => handlePlace(q.id)}
                  disabled={activeItem === null}
                  className={`relative p-6 rounded-[2.5rem] border-2 transition-all flex flex-col text-left overflow-hidden
                    ${isTarget ? `hover:scale-[1.02] hover:shadow-xl ${q.border} bg-white shadow-md cursor-pointer animate-pulse border-dashed` : 'bg-white border-slate-100 shadow-sm'}
                  `}
                >
                  <div className="flex items-center gap-3 mb-2 relative z-10">
                    <div className={`p-2.5 rounded-xl ${q.color} text-white shadow-lg`}>
                      <q.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-tight">{q.title}</h4>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${q.text}`}>{q.label}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 flex-1 relative z-10">
                    {itemsInQuadrant.map(f => (
                      <div key={f.id} className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between shadow-sm animate-in zoom-in duration-300">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800">{f.title}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Impact: {f.impact}/10</span>
                        </div>
                        <CheckCircle2 size={16} className={q.text} />
                      </div>
                    ))}
                    {itemsInQuadrant.length === 0 && !isTarget && (
                      <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Drop Finding Here</span>
                      </div>
                    )}
                    {itemsInQuadrant.length === 0 && isTarget && (
                      <div className="flex-1 flex items-center justify-center border-2 border-dashed border-blue-400 bg-blue-50/50 rounded-3xl">
                        <span className="text-xs font-bold text-blue-600 animate-bounce">Select Target</span>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* RIGHT: 3D Visualization & Inbox (Col 5) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* 3D View */}
          <div className="h-[350px] bg-slate-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-slate-800">
            <Canvas camera={{ position: [5, 4, 5], fov: 45 }}>
              <color attach="background" args={["#0f172a"]} />
              <ambientLight intensity={1.5} />
              <directionalLight position={[10, 10, 5]} intensity={2} />
              <AbstractFacility placedIds={placedIds} />
              <Environment preset="night" />
              <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={10} blur={2} />
              <OrbitControls enableZoom={false} autoRotate={isComplete} autoRotateSpeed={2} />
            </Canvas>
            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-black text-white/70 shadow-sm flex items-center gap-2 uppercase tracking-widest">
              <Layers size={14} className="text-blue-400" />
              Strategic Implementation Twin
            </div>

            {/* Impact Meter */}
            <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 w-48">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black text-white/50 uppercase">Project ROI Impact</span>
                <BarChart3 size={12} className="text-emerald-400" />
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                  style={{ width: `${(totalImpact / 50) * 100}%` }}
                />
              </div>
              <div className="mt-2 text-right">
                <span className="text-xl font-black text-white">{(totalImpact * 12.5).toFixed(0)}</span>
                <span className="text-[10px] font-bold text-white/50 ml-1">KL/YR</span>
              </div>
            </div>
          </div>

          {/* Inbox / Deck */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex-1 flex flex-col max-h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Finding Queue</h3>
              <div className="bg-slate-100 px-2 py-1 rounded text-[10px] font-black text-slate-500">{FINDINGS.length - placedCount} Remaining</div>
            </div>
            
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto no-scrollbar pr-1">
              {FINDINGS.filter(f => !placedItems[f.id]).map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveItem(activeItem === f.id ? null : f.id)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all group ${
                    activeItem === f.id 
                      ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]' 
                      : 'border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{f.title}</h4>
                    <span className="text-[9px] font-black uppercase tracking-widest bg-white px-2 py-1 rounded-full text-slate-400 border border-slate-200">
                      {f.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-4 font-medium leading-relaxed">{f.desc}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-[9px] font-black text-slate-400 uppercase">Impact {f.impact}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="text-[9px] font-black text-slate-400 uppercase">Effort {f.effort}</span>
                    </div>
                  </div>
                </button>
              ))}

              {isComplete && (
                <div className="flex flex-col items-center justify-center flex-1 text-center py-8">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <CheckCircle2 size={40} />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-2">Audit Prioritized</h4>
                  <p className="text-sm text-slate-500 font-medium mb-8 max-w-xs mx-auto">Your roadmap is ready. You have identified the high-impact actions for immediate implementation.</p>
                  
                  <button
                    onClick={() => router.push('/3-2')}
                    className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center gap-3 font-black transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] mb-4"
                  >
                    Build Action Plan
                    <ChevronRight size={20} />
                  </button>

                  <button 
                    onClick={() => { setPlacedItems({}); setActiveItem(null); }}
                    className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]"
                  >
                    <RotateCcw size={14} /> Reset Activity
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Footer */}
      <div className="bg-slate-900 p-10 rounded-[3rem] grid grid-cols-1 md:grid-cols-3 gap-12 text-white">
        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Zap size={24} />
          </div>
          <h4 className="text-lg font-black tracking-tight">Quick Wins</h4>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">Focus on "Low Effort, High Impact" first. These build organizational momentum and prove the audit's value within weeks.</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <DollarSign size={24} />
          </div>
          <h4 className="text-lg font-black tracking-tight">Major Projects</h4>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">Strategic capital investments like recycling or borewell recharge. These require board-level approval and longer timelines.</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Clock size={24} />
          </div>
          <h4 className="text-lg font-black tracking-tight">Maintenance Hygiene</h4>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">Never overlook the small stuff. Leaking restrooms and dripping taps often account for 5-10% of total site waste.</p>
        </div>
      </div>
    </div>
  );
}
