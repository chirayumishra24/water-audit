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
  CloudRain, 
  Droplets, 
  CheckCircle2, 
  RotateCcw, 
  Info,
  Layers,
  ArrowDown,
  Wind,
  Trees,
  Mountain,
  Zap
} from "lucide-react";
import * as THREE from "three";

// --- 3D Components ---

function TerrainModel({ 
  structures, 
  rainIntensity, 
  isRaining 
}: { 
  structures: string[], 
  rainIntensity: number, 
  isRaining: boolean 
}) {
  const rainRef = useRef<THREE.Group>(null);
  const aquiferRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (isRaining && rainRef.current) {
      rainRef.current.children.forEach((child: any) => {
        child.position.y -= delta * 5 * rainIntensity;
        if (child.position.y < 0) child.position.y = 10;
      });
    }
    
    if (isRaining && aquiferRef.current) {
      const growth = delta * 0.05 * rainIntensity * (structures.length + 1);
      if (aquiferRef.current.scale.y < 2) {
        aquiferRef.current.scale.y += growth;
        aquiferRef.current.position.y += growth * 0.5;
      }
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {/* Terrain Base - Cross Section */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[10, 1, 6]} />
        <meshStandardMaterial color="#8b4513" roughness={0.9} />
      </mesh>
      
      {/* Surface Layer */}
      <mesh castShadow receiveShadow position={[0, 1.05, 0]}>
        <boxGeometry args={[10, 0.1, 6]} />
        <meshStandardMaterial color="#22c55e" roughness={0.8} />
      </mesh>

      {/* Aquifer Layer (Blue) */}
      <mesh ref={aquiferRef} position={[0, -0.5, 0]} scale={[1, 0.5, 1]}>
        <boxGeometry args={[10, 1, 6]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} />
      </mesh>

      {/* Grid for context */}
      <Grid
        position={[0, 1.1, 0]}
        infiniteGrid
        fadeDistance={20}
        fadeStrength={5}
        cellSize={1}
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#2563eb"
        cellColor="#94a3b8"
      />

      {/* Render Structures */}
      {structures.includes("Check Dam") && (
        <group position={[2, 1.1, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.2, 0.4, 4]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <Html distanceFactor={5} position={[0, 0.5, 0]}>
            <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded border border-slate-200 text-[10px] font-bold text-slate-600 uppercase shadow-xl whitespace-nowrap">
              Check Dam
            </div>
          </Html>
        </group>
      )}

      {/* Rain Particles */}
      {isRaining && (
        <group ref={rainRef}>
          {[...Array(100)].map((_, i) => (
            <mesh key={i} position={[(Math.random() - 0.5) * 10, Math.random() * 10, (Math.random() - 0.5) * 6]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#60a5fa" transparent opacity={0.4} />
            </mesh>
          ))}
        </group>
      )}

      {/* Environmental Props */}
      <group position={[-3, 1.1, -1]}>
        <Float speed={2} floatIntensity={0.5}>
          <mesh castShadow>
            <coneGeometry args={[0.4, 1.2, 8]} />
            <meshStandardMaterial color="#166534" />
          </mesh>
        </Float>
      </group>
    </group>
  );
}

// --- Main Activity ---

export function GroundwaterSandbox() {
  const [structures, setStructures] = useState<string[]>([]);
  const [isRaining, setIsRaining] = useState(false);
  const [intensity, setIntensity] = useState(1);
  const [rechargeVolume, setRechargeVolume] = useState(0);

  const availableStructures = [
    { name: "Check Dam", icon: <Mountain className="w-4 h-4" />, desc: "Slows runoff in streams" },
    { name: "Percolation Tank", icon: <Droplets className="w-4 h-4" />, desc: "Stores runoff for soaking" },
    { name: "Contour Bund", icon: <Zap className="w-4 h-4" />, desc: "Breaks slope flow" },
    { name: "Recharge Well", icon: <ArrowDown className="w-4 h-4" />, desc: "Direct path to aquifer" }
  ];

  const addStructure = (name: string) => {
    if (!structures.includes(name)) {
      setStructures([...structures, name]);
    } else {
      setStructures(structures.filter(s => s !== name));
    }
  };

  const reset = () => {
    setStructures([]);
    setIsRaining(false);
    setIntensity(1);
    setRechargeVolume(0);
  };

  return (
    <div className="relative w-full h-[600px] bg-[#f8fafc] rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
      <Canvas shadows className="w-full h-full">
        <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={50} />
        <OrbitControls 
          enablePan={false} 
          minDistance={5} 
          maxDistance={15}
          maxPolarAngle={Math.PI / 2.1}
        />
        
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={250} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={100} color="#3b82f6" />
        
        <Suspense fallback={null}>
          <TerrainModel 
            structures={structures} 
            isRaining={isRaining} 
            rainIntensity={intensity} 
          />
          <Environment preset="park" />
          <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
        </Suspense>
      </Canvas>

      {/* TOP HUD: STRUCTURES */}
      <div className="absolute top-6 left-6 right-6 flex items-start justify-between pointer-events-none">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-2xl pointer-events-auto max-w-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tighter">Groundwater Recharge</h2>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">
                Architecture Mode
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Available Structures</span>
            <div className="grid grid-cols-2 gap-2">
              {availableStructures.map((s) => (
                <button
                  key={s.name}
                  onClick={() => addStructure(s.name)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-left ${
                    structures.includes(s.name) 
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" 
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-400"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${structures.includes(s.name) ? "bg-white/20" : "bg-white border border-slate-200"}`}>
                    {s.icon}
                  </div>
                  <span className="text-[10px] font-bold leading-tight">{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-2xl pointer-events-auto w-48 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Aquifer Recharge</span>
          <div className="text-3xl font-black text-blue-600">
            {isRaining ? (Math.random() * 500).toFixed(0) : "0"}
            <span className="text-xs ml-1 font-bold text-slate-400">m³</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-1000" 
              style={{ width: isRaining ? '60%' : '20%' }} 
            />
          </div>
        </div>
      </div>

      {/* BOTTOM HUD: SIMULATION CONTROLS */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl px-8 py-6 rounded-[2.5rem] border border-white shadow-2xl flex items-center gap-12 w-full max-w-2xl">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Monsoon Intensity</span>
            <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-full">
              {intensity === 1 ? "Light" : intensity === 2 ? "Moderate" : "Torrential"}
            </span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="3" 
            step="1"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => setIsRaining(!isRaining)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl ${
              isRaining 
                ? "bg-slate-900 text-white hover:bg-slate-800" 
                : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95"
            }`}
          >
            {isRaining ? (
              <>
                <Wind className="w-5 h-5 animate-bounce" />
                Stop Rain
              </>
            ) : (
              <>
                <CloudRain className="w-5 h-5" />
                Initialize Monsoon
              </>
            )}
          </button>
          
          <button 
            onClick={reset}
            className="p-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-3 p-3 bg-white/60 backdrop-blur-md rounded-xl border border-white/40 shadow-sm pointer-events-none">
        <Info className="w-3 h-3 text-slate-500" />
        <p className="text-[10px] font-medium text-slate-600 italic">
          Tip: Structures like Check Dams capture surface runoff, allowing it to seep into the aquifer over time.
        </p>
      </div>
    </div>
  );
}
