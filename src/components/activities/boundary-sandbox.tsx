'use client';

import React, { useMemo, Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Plane,
  Grid,
  ContactShadows,
  Environment,
  Box,
} from '@react-three/drei';
import * as THREE from 'three';
import { 
  BoxSelect, 
  Map, 
  CheckCircle2, 
  Info, 
  Crosshair, 
  Target, 
  Activity, 
  ShieldCheck, 
  Search, 
  Ruler, 
  RotateCcw,
  ArrowRight,
  Shield,
  Layout,
  MousePointer2
} from 'lucide-react';

function LowPolyBuilding({ position, scale = [1, 1, 1], color = "#cbd5e1" }: { position: [number, number, number], scale?: [number, number, number], color?: string }) {
  return (
    <group position={position}>
      <Box args={[1.2, 2 * scale[1], 1.2]} position={[0, scale[1], 0]}>
        <meshStandardMaterial color={color} roughness={0.1} />
      </Box>
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

type ScenePointerHandlers = {
  onPointerDown: (event: ThreeEvent<PointerEvent>) => void;
  onPointerMove: (event: ThreeEvent<PointerEvent>) => void;
  onPointerUp: () => void;
};

function Terrain({ onPointerDown, onPointerMove, onPointerUp }: ScenePointerHandlers) {
  return (
    <group>
      <LowPolyBuilding position={[-4, 0, -4]} scale={[1, 1.5, 1]} color="#f1f5f9" />
      <LowPolyBuilding position={[4, 0, -4]} scale={[1, 2.2, 1]} color="#e2e8f0" />
      <LowPolyBuilding position={[-4, 0, 4]} scale={[1, 0.8, 1]} color="#cbd5e1" />
      <LowPolyBuilding position={[4, 0, 4]} scale={[1, 1.2, 1]} color="#f8fafc" />
      <LowPolyBuilding position={[0, 0, 0]} scale={[1.5, 0.4, 1.5]} color="#94a3b8" />

      <Plane args={[40, 40]} position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </Plane>
      <Plane
        args={[40, 40]}
        position={[0, 0.03, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Plane>
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
  const router = useRouter();
  const [startPoint, setStartPoint] = useState<THREE.Vector3 | null>(null);
  const [currentPoint, setCurrentPoint] = useState<THREE.Vector3 | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const toGroundPoint = (point: THREE.Vector3) => new THREE.Vector3(point.x, 0, point.z);

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (confirmed) return;
    e.stopPropagation();
    const point = toGroundPoint(e.point);
    setStartPoint(point);
    setCurrentPoint(point);
    setIsDrawing(true);
  };

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (isDrawing && !confirmed) {
      e.stopPropagation();
      setCurrentPoint(toGroundPoint(e.point));
    }
  };

  const onPointerUp = () => {
    setIsDrawing(false);
  };

  const area = useMemo(() => {
    if (!startPoint || !currentPoint) return 0;
    return Math.abs((startPoint.x - currentPoint.x) * (startPoint.z - currentPoint.z)) * 100;
  }, [startPoint, currentPoint]);

  const reset = () => {
    setConfirmed(false);
    setStartPoint(null);
    setCurrentPoint(null);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[750px] bg-white rounded-[3.5rem] overflow-hidden border border-slate-200 shadow-2xl relative">
      {/* LEFT: 3D DRAWING PANEL */}
      <div className="relative flex-1 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 overflow-hidden min-h-[450px]">
        <Canvas shadows className="w-full h-full cursor-crosshair">
          <PerspectiveCamera makeDefault position={[12, 12, 12]} fov={35} />
          <OrbitControls 
            enableRotate={!isDrawing && confirmed} 
            enablePan={!isDrawing}
            minDistance={10}
            maxDistance={30}
            maxPolarAngle={Math.PI / 2.1}
          />
          
          <ambientLight intensity={1.5} />
          <spotLight position={[20, 30, 10]} intensity={800} castShadow />
          
          <Suspense fallback={null}>
            <Grid
              infiniteGrid
              fadeDistance={40}
              fadeStrength={5}
              cellSize={1}
              sectionSize={5}
              sectionThickness={1}
              sectionColor="#3b82f6"
              cellColor="#e2e8f0"
            />
            <Terrain
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            />
            <SelectionBox start={startPoint} end={currentPoint} />
            <Environment preset="city" />
            <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={25} blur={2.5} far={10} color="#000000" />
          </Suspense>
        </Canvas>

        {/* HUD Elements */}
        <div className="absolute top-10 left-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <BoxSelect className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">GIS Engine</span>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Boundary Scope</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Interaction Hint */}
        {!confirmed && !isDrawing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-xl px-8 py-4 rounded-full border border-blue-100 shadow-2xl flex items-center gap-4 animate-bounce">
              <MousePointer2 className="w-5 h-5 text-blue-600 animate-pulse" />
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Click & Drag to Define Audit Area</span>
            </div>
          </div>
        )}

        <div className="absolute bottom-10 left-10 pointer-events-none">
          <div className="bg-blue-600/10 backdrop-blur-md px-6 py-3 rounded-full border border-blue-500/20 text-blue-500 flex items-center gap-3">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {confirmed ? 'Boundary Locked' : isDrawing ? 'Measuring Scope...' : 'Awaiting Input'}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: CONFIGURATION SIDEBAR */}
      <div className="w-full lg:w-[450px] bg-white flex flex-col p-12 gap-10 overflow-y-auto no-scrollbar">
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Configuration</h3>
            <div className="p-3 bg-slate-50 rounded-2xl text-blue-600">
              <Shield size={20} />
            </div>
          </div>

          {/* Instructions Card */}
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mission Protocol</span>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-white rounded-xl border border-slate-200 flex items-center justify-center shrink-0 font-black text-xs text-slate-900">1</div>
                <p className="text-xs font-bold text-slate-600 leading-relaxed">
                  Analyze the terrain to identify all shared water entry points (Municipal vs. Ground).
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-white rounded-xl border border-slate-200 flex items-center justify-center shrink-0 font-black text-xs text-slate-900">2</div>
                <p className="text-xs font-bold text-slate-600 leading-relaxed">
                  Drag your cursor across the site to define the physical boundary for audit reconciliation.
                </p>
              </div>
            </div>
          </div>

          {/* Telemetry Stats */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Live Telemetry</h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-3">
                  <Ruler className="w-4 h-4 text-slate-300" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projected Area</span>
                </div>
                <span className="text-base font-black text-slate-900 tracking-tighter">
                  {confirmed ? "1,240 m²" : `${Math.round(area)} m²`}
                </span>
              </div>
              <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-3">
                  <Target className="w-4 h-4 text-slate-300" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Precision</span>
                </div>
                <span className="text-base font-black text-blue-600 tracking-tighter">
                  {confirmed ? "94.2%" : startPoint ? "82.5%" : "0.0%"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto space-y-6">
          <div className="flex items-start gap-4 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <Layout className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              Defining the boundary is critical for calculating the total water intensity (L/m²) later.
            </p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={reset}
              className="p-5 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200 hover:text-slate-600 transition-all active:scale-95"
            >
              <RotateCcw size={20} />
            </button>
            <button 
              disabled={!startPoint || area < 10}
              onClick={() => setConfirmed(!confirmed)}
              className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl ${
                confirmed 
                  ? 'bg-slate-900 text-white hover:bg-slate-800' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
              } disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed`}
            >
              {confirmed ? 'Unlock Boundary' : 'Confirm Audit Scope'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mastery/Confirmation State Overlay */}
      {confirmed && (
        <div className="absolute inset-x-0 bottom-0 p-12 pointer-events-none lg:pointer-events-auto">
          <div className="bg-slate-900/95 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10 max-w-5xl mx-auto animate-in slide-in-from-bottom-12 duration-700">
            <div className="flex items-center gap-8 text-center lg:text-left">
              <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shrink-0">
                <ShieldCheck size={40} className="text-white" />
              </div>
              <div>
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Scope Locked</h4>
                <p className="text-slate-400 text-xs font-medium max-w-md leading-relaxed">
                  Your facility boundary has been successfully digitized. All sub-meters and consumption points will now be reconciled against this area.
                </p>
              </div>
            </div>
            <button 
              onClick={() => router.push('/2-1')}
              className="w-full lg:w-auto px-12 py-6 bg-white text-slate-900 font-black rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-xl text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95"
            >
              Proceed to Metering
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
