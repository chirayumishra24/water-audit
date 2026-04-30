'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Text, 
  Html, 
  Sphere,
  Float,
  Stars,
  PresentationControls,
  useTexture
} from '@react-three/drei';
import * as THREE from 'three';
import Link from 'next/link';
import { MapPin, AlertTriangle, Droplets, Info, Globe, ArrowRight } from 'lucide-react';

const WATER_CRISIS_DATA = [
  { name: "Delhi", coords: [77.2090, 28.6139], status: "Critical", depletion: "95%", info: "Groundwater expected to run out soon." },
  { name: "Chennai", coords: [80.2707, 13.0827], status: "Zero Day", depletion: "99%", info: "Reached 'Zero Day' in 2019." },
  { name: "Bangalore", coords: [77.5946, 12.9716], status: "Critical", depletion: "88%", info: "Vast majority of borewells have gone dry." },
  { name: "Hyderabad", coords: [78.4867, 17.3850], status: "High Stress", depletion: "75%", info: "Rapid urbanization straining resources." },
  { name: "Mumbai", coords: [72.8777, 19.0760], status: "High Stress", depletion: "60%", info: "Saltwater intrusion into groundwater." },
  { name: "Kolkata", coords: [88.3639, 22.5726], status: "High Stress", depletion: "65%", info: "Arsenic contamination in deep aquifers." }
];

// Convert Lat/Lon to 3D Cartesian on Sphere
function latLonToVector3(lon: number, lat: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

function Earth({ radius }: { radius: number }) {
  const [colorMap, normalMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg'
  ]);

  return (
    <group>
      <mesh receiveShadow castShadow>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial 
          map={colorMap}
          normalMap={normalMap}
          roughness={0.7} 
          metalness={0.2}
        />
      </mesh>
      
      {/* Atmosphere Glow */}
      <mesh scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial 
          color="#60a5fa" 
          transparent 
          opacity={0.15} 
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function Marker({ data, radius, onSelect }: { data: typeof WATER_CRISIS_DATA[0], radius: number, onSelect: (d: any) => void }) {
  const pos = useMemo(() => latLonToVector3(data.coords[0], data.coords[1], radius), [data, radius]);
  const [hovered, setHovered] = useState(false);
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.scale.setScalar(1 + Math.sin(t * 5) * 0.1);
    }
  });

  return (
    <group position={pos}>
      <mesh 
        ref={mesh}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(data)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial 
          color={data.status === "Zero Day" ? "#ef4444" : "#f59e0b"} 
          emissive={data.status === "Zero Day" ? "#ef4444" : "#f59e0b"}
          emissiveIntensity={hovered ? 3 : 1}
        />
      </mesh>
      {hovered && (
        <Html distanceFactor={10} zIndexRange={[100, 0]}>
          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-2xl border border-white/20 whitespace-nowrap pointer-events-none">
            <p className="text-[10px] font-black uppercase tracking-tighter text-white">{data.name}</p>
            <p className={`text-[8px] font-bold ${data.status === "Zero Day" ? 'text-red-400' : 'text-orange-400'}`}>{data.status}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

export function WaterMapExplorer() {
  const [selected, setSelected] = useState<typeof WATER_CRISIS_DATA[0] | null>(null);
  const globeRadius = 3;

  return (
    <div className="w-full h-[700px] bg-[#020617] rounded-[3rem] overflow-hidden relative border-8 border-slate-900 shadow-2xl">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={3} color="#60a5fa" />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />

        <PresentationControls
          global
          snap
          rotation={[0.3, -Math.PI / 3, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 2, Math.PI / 2]}
        >
          <React.Suspense fallback={null}>
            <group rotation={[0, -Math.PI / 2, 0]}>
              <Earth radius={globeRadius} />
              
              {/* Markers */}
              <group>
                {WATER_CRISIS_DATA.map((city, idx) => (
                  <Marker key={idx} data={city} radius={globeRadius} onSelect={setSelected} />
                ))}
              </group>
            </group>
          </React.Suspense>
        </PresentationControls>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>

      {/* UI Overlay: Title & Description */}
      <div className="absolute top-8 left-8 pointer-events-none">
        <h2 className="text-3xl font-black text-white leading-tight mb-1 drop-shadow-2xl italic tracking-tighter">
          INDIA'S <span className="text-blue-500 not-italic">WATER</span> CRISIS
        </h2>
        <p className="text-slate-500 text-[10px] max-w-[200px] font-bold uppercase tracking-wider">
          Spin the globe and click hotspots
        </p>
      </div>

      {/* UI Overlay: Stats Panel (Bottom Left - Compact) */}
      <div className="absolute bottom-8 left-8 w-60">
        <div className="bg-black/60 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-blue-500" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">National Status</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Critical Cities</span>
              <span className="text-white font-mono font-black text-sm">21</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 w-[85%]" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Time to Zero</span>
              <span className="text-red-500 font-mono font-black text-sm">2030</span>
            </div>
          </div>
        </div>
      </div>

      {/* UI Overlay: Selected City (Right Sidebar - Compact) */}
      {selected && (
        <div className="absolute top-8 bottom-8 right-8 w-[320px] bg-white rounded-[2.5rem] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.6)] flex flex-col animate-in slide-in-from-right duration-500 ease-out">
          <button 
            onClick={() => setSelected(null)}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200"
          >
            ✕
          </button>
          
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              selected.status === "Zero Day" ? 'bg-red-50' : 'bg-orange-50'
            }`}>
              <AlertTriangle className={`w-8 h-8 ${selected.status === "Zero Day" ? 'text-red-500' : 'text-orange-500'}`} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-1">{selected.name}</h3>
              <div className={`inline-flex px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                selected.status === "Zero Day" ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
              }`}>
                {selected.status}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Depletion</p>
              <p className="text-xl font-black text-slate-900">{selected.depletion}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Risk</p>
              <p className="text-xl font-black text-red-600 uppercase">Extreme</p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-[1.5rem] border border-blue-100 mb-6 flex-1">
            <p className="text-slate-700 text-sm leading-relaxed font-medium italic">
              "{selected.info}"
            </p>
          </div>

          <Link 
            href="/1-3"
            className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-blue-600 transition-all shadow-lg flex items-center justify-center gap-2 group no-underline text-xs"
          >
            OPEN CASE STUDY
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}

      {/* Legend (Top Right - Compact) */}
      {!selected && (
        <div className="absolute top-8 right-8 flex flex-col gap-2">
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-2xl">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
            <span className="text-[8px] font-black text-white uppercase tracking-widest">Zero Day</span>
          </div>
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-2xl">
            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
            <span className="text-[8px] font-black text-white uppercase tracking-widest">Critical</span>
          </div>
        </div>
      )}
    </div>
  );
}
