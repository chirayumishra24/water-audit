'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Plane,
  Grid,
  Html,
  RoundedBox,
  ContactShadows,
  Environment,
  Box
} from '@react-three/drei';
import * as THREE from 'three';
import { BoxSelect, Map, CheckCircle2, Info, Crosshair, Target, Activity, ShieldCheck, Search, Ruler } from 'lucide-react';

function LowPolyBuilding({ position, scale = [1, 1, 1], color = "#cbd5e1" }: { position: [number, number, number], scale?: [number, number, number], color?: string }) {
  return (
    <group position={position}>
      <Box args={[1.2, 2 * scale[1], 1.2]} position={[0, scale[1], 0]}>
        <meshStandardMaterial color={color} roughness={0.1} />
      </Box>
      {/* Windows */}
      {[0.5, 1, 1.5].map((y, i) => (
        <group key={i} position={[0, y * scale[1], 0.61]}>
          <Plane args={[0.8, 0.2]}>
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          </Plane>
        </group>
      ))}
    </group>
  );
}

function Terrain() {
  return (
    <group>
      {/* Schematic City Blocks - Light Theme */}
      <LowPolyBuilding position={[-4, 0, -4]} scale={[1, 1.5, 1]} color="#f1f5f9" />
      <LowPolyBuilding position={[4, 0, -4]} scale={[1, 2.2, 1]} color="#e2e8f0" />
      <LowPolyBuilding position={[-4, 0, 4]} scale={[1, 0.8, 1]} color="#cbd5e1" />
      <LowPolyBuilding position={[4, 0, 4]} scale={[1, 1.2, 1]} color="#f8fafc" />
      <LowPolyBuilding position={[0, 0, 0]} scale={[1.5, 0.4, 1.5]} color="#94a3b8" />

      <Plane args={[40, 40]} position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </Plane>
      <Grid infiniteGrid fadeDistance={30} sectionColor="#e2e8f0" cellColor="#f1f5f9" sectionThickness={1} cellThickness={0.5} />
    </group>
  );
}

function SelectionBox({ start, end }: { start: THREE.Vector3 | null, end: THREE.Vector3 | null }) {
  if (!start || !end) return null;

  const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const size = [
    Math.max(0.1, Math.abs(start.x - end.x)),
    0.05,
    Math.max(0.1, Math.abs(start.z - end.z))
  ];

  return (
    <group position={[center.x, 0.05, center.z]}>
      <mesh>
        <boxGeometry args={[size[0], size[1], size[2]]} />
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.3} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(size[0], size[1], size[2])]} />
        <lineBasicMaterial color="#2563eb" linewidth={2} />
      </lineSegments>
    </group>
  );
}

export function BoundarySandbox() {
  const [startPoint, setStartPoint] = useState<THREE.Vector3 | null>(null);
  const [currentPoint, setCurrentPoint] = useState<THREE.Vector3 | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const onPointerDown = (e: any) => {
    if (confirmed) return;
    setStartPoint(e.point.clone());
    setCurrentPoint(e.point.clone());
    setIsDrawing(true);
  };

  const onPointerMove = (e: any) => {
    if (isDrawing && !confirmed) {
      setCurrentPoint(e.point.clone());
    }
  };

  const onPointerUp = () => {
    setIsDrawing(false);
  };

  const area = useMemo(() => {
    if (!startPoint || !currentPoint) return 0;
    return Math.abs((startPoint.x - currentPoint.x) * (startPoint.z - currentPoint.z)) * 100;
  }, [startPoint, currentPoint]);

  return (
    <div className="w-full h-[700px] bg-slate-50 rounded-[3.5rem] overflow-hidden relative border-[12px] border-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] group">
      <Canvas 
        shadows 
        dpr={[1, 2]}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <PerspectiveCamera makeDefault position={[15, 15, 15]} fov={35} />
        <OrbitControls enableRotate={!isDrawing} enabled={!confirmed} minPolarAngle={0} maxPolarAngle={Math.PI / 2.5} />
        
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 15, 5]} intensity={1.5} color="#ffffff" castShadow />
        <Environment preset="city" />

        <Terrain />
        <SelectionBox start={startPoint} end={currentPoint} />
        
        {startPoint && currentPoint && !confirmed && (
          <Html position={currentPoint} center distanceFactor={10}>
            <div className="bg-white/90 backdrop-blur-md text-blue-600 px-4 py-2 rounded-full text-xs font-black whitespace-nowrap shadow-xl border border-blue-100 flex items-center gap-2">
              <Ruler className="w-3 h-3" />
              {area.toFixed(0)} SQ.M
            </div>
          </Html>
        )}

        <ContactShadows position={[0, -0.01, 0]} opacity={0.2} scale={40} blur={2.5} far={5} />
      </Canvas>

      {/* UI: Light Horizontal HUD */}
      <div className="absolute top-8 left-8 right-8 pointer-events-none flex justify-center">
        <div className="bg-white/80 backdrop-blur-xl p-4 px-10 rounded-full border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-slate-900 pointer-events-auto flex items-center gap-12 border-t-4 border-t-blue-500">
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
              <BoxSelect className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xs font-black tracking-widest uppercase leading-none text-slate-400">Boundary Sandbox</h2>
              <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">Area Selection</p>
            </div>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 text-center">Calculated Footprint</span>
              <span className="text-2xl font-black text-blue-600 leading-none tabular-nums text-center">{area.toFixed(0)} <span className="text-xs">M²</span></span>
            </div>

            <div className="h-10 w-px bg-slate-100" />

            <button 
              disabled={area < 1 || confirmed}
              onClick={() => setConfirmed(true)}
              className={`px-10 py-4 rounded-full font-black text-xs transition-all flex items-center gap-3 shrink-0 tracking-widest uppercase ${
                confirmed ? 'bg-green-50 text-green-600 border border-green-100' : 
                area > 0 ? 'bg-slate-900 text-white hover:bg-blue-600 active:scale-95 shadow-xl' : 'bg-slate-100 text-slate-300'
              }`}
            >
              {confirmed ? <><ShieldCheck className="w-4 h-4" /> BOUNDARY LOCKED</> : 'INITIALIZE SCOPE'}
            </button>
          </div>
        </div>
      </div>

      {!startPoint && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="bg-white/50 backdrop-blur-sm px-10 py-5 rounded-full border border-white/50 text-slate-400 font-black animate-pulse uppercase tracking-[0.4em] text-[10px] flex items-center gap-4">
            <Crosshair className="w-5 h-5" />
            Click and Drag to Define Boundary
          </div>
        </div>
      )}

      {confirmed && (
        <div className="absolute bottom-8 right-8 flex gap-4 pointer-events-auto">
          <button 
            onClick={() => { setConfirmed(false); setStartPoint(null); setCurrentPoint(null); }}
            className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase border border-slate-100 shadow-xl hover:bg-slate-50 transition-all flex items-center gap-3 group"
          >
            <Activity className="w-5 h-5 text-blue-500 group-hover:rotate-180 transition-transform duration-700" />
            Recalibrate Footprint
          </button>
        </div>
      )}
    </div>
  );
}
