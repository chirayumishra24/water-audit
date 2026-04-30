"use client";

import React, { useState, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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
  Play, 
  Pause, 
  RotateCcw, 
  Calendar,
  Settings,
  Droplets,
  AlertTriangle,
  TrendingDown,
  Building2,
  CheckCircle2,
  Info
} from "lucide-react";
import * as THREE from "three";

// --- 3D Components ---

function FacilityModel({ 
  currentWeek, 
  actions, 
  isPlaying 
}: { 
  currentWeek: number, 
  actions: any[], 
  isPlaying: boolean 
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  useCursor(!!hovered);

  // Filter actions that should be active by the current week
  const activeActions = actions.filter(a => a.week <= currentWeek);

  return (
    <group position={[0, -0.5, 0]}>
      {/* Base Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
      </mesh>
      <Grid
        infiniteGrid
        fadeDistance={30}
        fadeStrength={5}
        cellSize={1}
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#2563eb"
        cellColor="#94a3b8"
      />

      {/* Facility Blocks */}
      <mesh castShadow position={[-2, 0.75, -2]}>
        <boxGeometry args={[3, 1.5, 3]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[2, 1, 2]}>
        <boxGeometry args={[4, 2, 4]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>

      {/* Dynamic Indicators for Actions */}
      {activeActions.map((action, i) => (
        <group key={i} position={[action.pos[0], 2.5 + (i * 0.5), action.pos[2]]}>
          <Float speed={2} floatIntensity={0.5}>
            <mesh>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#2563eb" />
            </mesh>
            <Html center distanceFactor={6}>
              <div className="bg-blue-600 text-white text-[8px] font-bold px-2 py-1 rounded-full whitespace-nowrap shadow-xl border border-white/20">
                {action.name} Active
              </div>
            </Html>
          </Float>
        </group>
      ))}

      {/* Leaks - Disappear as repairs happen */}
      {!activeActions.some(a => a.name === "Leak Repair") && (
        <group position={[-1, 0, 1]}>
          {[...Array(3)].map((_, i) => (
            <mesh key={i} position={[Math.random() * 0.5, 0.01, Math.random() * 0.5]}>
              <circleGeometry args={[0.15, 16]} />
              <meshBasicMaterial color="#ef4444" transparent opacity={0.3} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

// --- Main Activity ---

export function ImplementationSimulator() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [plannedActions, setPlannedActions] = useState<any[]>([]);
  const totalWeeks = 12;

  useFrame((state) => {
    // We handle the simulation timing via setInterval in toggleSimulation
    // but we can use useFrame for animations if needed.
  });

  const toggleSimulation = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      const interval = setInterval(() => {
        setCurrentWeek((prev) => {
          if (prev >= totalWeeks) {
            clearInterval(interval);
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsPlaying(false);
    }
  };

  const addAction = (name: string, pos: number[]) => {
    if (plannedActions.length < 5) {
      setPlannedActions([...plannedActions, { 
        name, 
        week: Math.floor(Math.random() * 10) + 1,
        pos 
      }]);
    }
  };

  const reset = () => {
    setCurrentWeek(1);
    setIsPlaying(false);
    setPlannedActions([]);
  };

  const savings = plannedActions.filter(a => a.week <= currentWeek).length * 15;

  return (
    <div className="relative w-full h-[600px] bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
      <Canvas shadows className="w-full h-full">
        <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={50} />
        <OrbitControls 
          enablePan={false} 
          minDistance={5} 
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.1}
        />
        
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 20, 10]} intensity={300} castShadow />
        
        <Suspense fallback={null}>
          <FacilityModel 
            currentWeek={currentWeek} 
            actions={plannedActions}
            isPlaying={isPlaying} 
          />
          <Environment preset="city" />
          <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
        </Suspense>
      </Canvas>

      {/* TOP HUD: TIMELINE */}
      <div className="absolute top-6 left-6 right-6 flex items-start justify-between pointer-events-none">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-2xl pointer-events-auto w-full max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tighter">Implementation Timeline</h2>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                  Week {currentWeek} of {totalWeeks}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={toggleSimulation}
                className={`p-3 rounded-xl transition-all ${isPlaying ? 'bg-amber-100 text-amber-600' : 'bg-blue-600 text-white shadow-lg'}`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button 
                onClick={reset}
                className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="relative h-12 flex items-center px-4">
            <div className="absolute inset-x-0 h-1 bg-slate-100 rounded-full" />
            <div 
              className="absolute h-1 bg-blue-600 rounded-full transition-all duration-1000"
              style={{ width: `${(currentWeek / totalWeeks) * 100}%` }}
            />
            {Array.from({ length: totalWeeks }).map((_, i) => (
              <div 
                key={i} 
                className="flex-1 flex flex-col items-center relative z-10"
              >
                <div className={`w-3 h-3 rounded-full border-2 transition-all ${i + 1 <= currentWeek ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`} />
                <span className={`text-[8px] font-bold mt-2 ${i + 1 === currentWeek ? 'text-blue-600' : 'text-slate-400'}`}>W{i + 1}</span>
                
                {/* Action markers on timeline */}
                {plannedActions.filter(a => a.week === i + 1).map((a, j) => (
                  <div key={j} className="absolute -top-6 w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-2xl pointer-events-auto w-48 text-center shrink-0 ml-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Efficiency Gain</span>
          <div className="text-3xl font-black text-green-600">
            +{savings}%
          </div>
          <div className="flex items-center justify-center gap-1 mt-1 text-green-600">
            <TrendingDown className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Wastage Down</span>
          </div>
        </div>
      </div>

      {/* BOTTOM HUD: ACTIONS */}
      <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-2xl pointer-events-auto flex items-center gap-6">
          <div className="shrink-0 flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Implementation</span>
            <span className="text-xs font-black text-slate-900 uppercase">Palette</span>
          </div>
          <div className="w-[1px] h-10 bg-slate-200" />
          <div className="flex-1 flex gap-3 overflow-x-auto no-scrollbar py-2">
            {[
              { name: "Leak Repair", icon: <Droplets className="w-4 h-4" />, pos: [-1, 0, 1] },
              { name: "Sub-metering", icon: <Settings className="w-4 h-4" />, pos: [2, 0, 2] },
              { name: "Staff Training", icon: <Info className="w-4 h-4" />, pos: [-2, 0, -2] },
              { name: "Low-flow Taps", icon: <Settings className="w-4 h-4" />, pos: [0, 0, 3] },
            ].map((action) => {
              const isAdded = plannedActions.some(a => a.name === action.name);
              return (
                <button
                  key={action.name}
                  onClick={() => !isAdded && addAction(action.name, action.pos)}
                  disabled={isAdded || isPlaying}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all whitespace-nowrap ${
                    isAdded 
                      ? "bg-blue-50 border-blue-100 text-blue-400 opacity-60" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-blue-400 active:scale-95"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isAdded ? 'bg-blue-100' : 'bg-slate-50'}`}>
                    {action.icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-tight">{action.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dependency Alerts */}
      {plannedActions.length > 0 && !plannedActions.some(a => a.name === "Sub-metering") && currentWeek > 4 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500/90 backdrop-blur-xl p-4 rounded-2xl border border-amber-400 shadow-2xl flex items-center gap-4 animate-bounce">
          <AlertTriangle className="w-6 h-6 text-white" />
          <div>
            <p className="text-white text-xs font-black uppercase tracking-widest">Incomplete Data</p>
            <p className="text-amber-50 text-[10px] font-bold">Optimization requires Sub-metering first!</p>
          </div>
        </div>
      )}

      {currentWeek === totalWeeks && (
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-2xl mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Quarterly Results: SUCCESS</h2>
          <p className="text-slate-300 text-sm max-w-sm mb-8 italic">
            "Your implementation plan reduced overall facility wastage by {savings}%. The data from new meters allowed for precision repairs and staff accountability."
          </p>
          <button 
            onClick={reset}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-xl"
          >
            Refine Strategy
          </button>
        </div>
      )}
    </div>
  );
}
