"use client";

import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  Html,
  useCursor,
  Grid,
  Float,
} from "@react-three/drei";
import { 
  BarChart3, 
  Target, 
  CheckCircle2, 
  RotateCcw, 
  Zap,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  Coins,
  Droplets
} from "lucide-react";

// --- 3D Components ---

function BoardroomScene({ 
  placedFindings, 
  onZoneClick 
}: { 
  placedFindings: any[], 
  onZoneClick: (zone: string) => void 
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  useCursor(!!hovered);

  const zones = [
    { id: 'quick-wins', pos: [-1.5, 1.5, 0], color: "#22c55e", label: "Quick Wins", quadrant: "High Impact / Low Effort" },
    { id: 'major-projects', pos: [1.5, 1.5, 0], color: "#3b82f6", label: "Major Projects", quadrant: "High Impact / High Effort" },
    { id: 'fill-ins', pos: [-1.5, -1.5, 0], color: "#eab308", label: "Fill-ins", quadrant: "Low Impact / Low Effort" },
    { id: 'thankless', pos: [1.5, -1.5, 0], color: "#ef4444", label: "Thankless Tasks", quadrant: "Low Impact / High Effort" },
  ];

  return (
    <group>
      {/* 3D Matrix Wall */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[6.2, 6.2]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
      
      {/* Grid Lines */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[6.2, 0.05, 0.05]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.05, 6.2, 0.05]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      </group>

      {/* Quadrant Zones */}
      {zones.map((z) => (
        <group 
          key={z.id} 
          position={z.pos as any}
          onPointerOver={() => setHovered(z.id)}
          onPointerOut={() => setHovered(null)}
          onClick={() => onZoneClick(z.id)}
        >
          <mesh>
            <planeGeometry args={[2.8, 2.8]} />
            <meshStandardMaterial 
              color={z.color} 
              transparent 
              opacity={hovered === z.id ? 0.2 : 0.05} 
            />
          </mesh>
          <Html position={[0, 1.1, 0]} center distanceFactor={6}>
            <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tighter whitespace-nowrap transition-all duration-300 ${
              hovered === z.id 
                ? 'bg-slate-900 border-slate-900 text-white scale-110 shadow-xl' 
                : 'bg-white/80 border-slate-200 text-slate-400'
            }`}>
              {z.label}
            </div>
          </Html>
        </group>
      ))}

      {/* Axis Labels */}
      <Html position={[0, 3.4, 0]} center>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <TrendingUp className="w-3 h-3" /> Impact (Low → High)
        </div>
      </Html>
      <Html position={[3.6, 0, 0]} center rotation={[0, 0, -Math.PI / 2]}>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Clock className="w-3 h-3" /> Effort (Low → High)
        </div>
      </Html>

      {/* Placed Findings as 3D Cards */}
      {placedFindings.map((f, i) => (
        <Float key={f.id} speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh 
            position={[
              f.zone === 'quick-wins' || f.zone === 'fill-ins' ? -1.5 : 1.5,
              f.zone === 'quick-wins' || f.zone === 'major-projects' ? 1.5 : -1.5,
              0.1 + (i * 0.05)
            ]}
          >
            <boxGeometry args={[1.2, 0.8, 0.05]} />
            <meshStandardMaterial color="white" metalness={0.1} roughness={0.1} />
            <Html center distanceFactor={4}>
              <div className="bg-white/90 backdrop-blur-sm p-1 rounded border border-blue-100 shadow-lg text-[6px] font-bold text-slate-900 w-16 text-center leading-tight">
                {f.title}
              </div>
            </Html>
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// --- Main Activity ---

export function OpportunityRanking() {
  const [placedFindings, setPlacedFindings] = useState<any[]>([]);
  const [selectedFinding, setSelectedFinding] = useState<any | null>(null);
  
  const findings = [
    { id: 1, title: "Fix Restroom Leaks", impact: "High", effort: "Low", cost: "₹2,000", savings: "1,200L/day" },
    { id: 2, title: "Install Sub-meters", impact: "High", effort: "High", cost: "₹45,000", savings: "Data Clarity" },
    { id: 3, title: "Greywater Reuse", impact: "High", effort: "High", cost: "₹80,000", savings: "3,500L/day" },
    { id: 4, title: "Flow Aerators", impact: "Moderate", effort: "Low", cost: "₹5,000", savings: "800L/day" },
    { id: 5, title: "Garden Timer", impact: "Low", effort: "Low", cost: "₹1,500", savings: "200L/day" },
    { id: 6, title: "Borewell Recharge", impact: "High", effort: "Moderate", cost: "₹12,000", savings: "Groundwater" },
  ];

  const handleZoneClick = (zone: string) => {
    if (selectedFinding && !placedFindings.find(f => f.id === selectedFinding.id)) {
      setPlacedFindings([...placedFindings, { ...selectedFinding, zone }]);
      setSelectedFinding(null);
    }
  };

  const totalSavings = placedFindings.reduce((acc, f) => {
    const val = parseInt(f.savings?.replace(/[^0-9]/g, '') || '0');
    return acc + val;
  }, 0);

  const reset = () => {
    setPlacedFindings([]);
    setSelectedFinding(null);
  };

  return (
    <div className="relative w-full h-[600px] bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
      <Canvas shadows className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <OrbitControls 
          enableRotate={false}
          enablePan={true} 
          minDistance={4} 
          maxDistance={12}
        />
        
        <ambientLight intensity={1} />
        <spotLight position={[5, 5, 5]} intensity={100} castShadow />
        
        <Suspense fallback={null}>
          <BoardroomScene 
            placedFindings={placedFindings} 
            onZoneClick={handleZoneClick} 
          />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>

      {/* TOP HUD: DETAILS */}
      <div className="absolute top-6 left-6 right-6 flex items-start justify-between pointer-events-none">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-2xl pointer-events-auto max-w-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tighter">Strategic Opportunity Ranking</h2>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                Impact-Effort Matrix
              </span>
            </div>
          </div>
          
          {selectedFinding ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedFinding.title}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md">Cost: {selectedFinding.cost}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-green-50 text-green-600 rounded-md">Est. {selectedFinding.savings}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100">
                <Target className="w-4 h-4" />
                <p className="text-xs font-bold">Select a quadrant on the grid to place this finding.</p>
              </div>
            </div>
          ) : (
            <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center">
              <p className="text-xs font-medium text-slate-400 italic">Select a finding from the deck below to analyze and prioritize it.</p>
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-2xl pointer-events-auto w-56">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-3">Strategy ROI</span>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-3 h-3 text-blue-600" />
                <span className="text-[10px] font-bold text-slate-600 uppercase">Savings</span>
              </div>
              <span className="text-sm font-black text-slate-900">{totalSavings} L/d</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-3 h-3 text-amber-600" />
                <span className="text-[10px] font-bold text-slate-600 uppercase">Items</span>
              </div>
              <span className="text-sm font-black text-slate-900">{placedFindings.length} / {findings.length}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-500" 
                style={{ width: `${(placedFindings.length / findings.length) * 100}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM HUD: DECK */}
      <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl border border-white shadow-2xl pointer-events-auto overflow-x-auto no-scrollbar">
          <div className="flex gap-4">
            {findings.map((f) => {
              const isPlaced = placedFindings.find(p => p.id === f.id);
              return (
                <button
                  key={f.id}
                  onClick={() => !isPlaced && setSelectedFinding(f)}
                  disabled={isPlaced}
                  className={`min-w-[160px] p-4 rounded-2xl border-2 transition-all text-left flex flex-col justify-between h-32 ${
                    isPlaced 
                      ? "bg-slate-50 border-slate-100 opacity-40" 
                      : selectedFinding?.id === f.id
                        ? "bg-blue-600 border-blue-600 text-white shadow-xl -translate-y-2"
                        : "bg-white border-white hover:border-blue-200 shadow-sm"
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-black uppercase leading-tight">{f.title}</h4>
                    <p className={`text-[10px] font-bold mt-1 ${selectedFinding?.id === f.id ? 'text-blue-100' : 'text-slate-400'}`}>
                      {f.impact} Impact
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${selectedFinding?.id === f.id ? 'bg-white/20' : 'bg-slate-50'}`}>
                      {isPlaced ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Plus className="w-3 h-3" />}
                    </div>
                    <Zap className={`w-3 h-3 ${selectedFinding?.id === f.id ? 'text-blue-100' : 'text-slate-300'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 right-10 -translate-y-1/2 pointer-events-none flex flex-col items-center gap-1 opacity-20">
        <div className="w-1 h-20 bg-slate-400 rounded-full" />
        <div className="w-2 h-2 bg-slate-400 rounded-full" />
        <div className="w-1 h-20 bg-slate-400 rounded-full" />
      </div>

      {placedFindings.length === findings.length && (
        <div className="absolute inset-0 bg-blue-600/90 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl mb-8">
            <CheckCircle2 className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Strategy Optimized</h2>
          <p className="text-blue-50 text-lg max-w-md mb-8">
            You've successfully prioritized all findings. Your implementation plan focuses on high-impact wins first.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={reset}
              className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-all active:scale-95 shadow-xl"
            >
              Review Board
            </button>
            <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-xl flex items-center gap-2">
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
