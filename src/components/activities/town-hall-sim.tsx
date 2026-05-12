"use client";

import React, { useState, Suspense, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  Html,
  Grid,
  Float,
  RoundedBox,
  Edges,
  Text,
} from "@react-three/drei";
import { 
  Users, 
  Presentation, 
  MessageSquare, 
  Heart, 
  Brain, 
  Coins, 
  CheckCircle2, 
  RotateCcw,
  BarChart3,
  ArrowRight,
  TrendingUp,
  Award,
  ChevronRight,
  Info,
  Sparkles,
  Target,
  Mic2,
  ThumbsUp,
  Mail,
  FileText,
  UserCheck
} from "lucide-react";
import * as THREE from "three";
import { useRouter } from "next/navigation";

// --- 3D Components ---

function AudienceMember({ position, reaction, delay }: { position: [number, number, number], reaction: 'happy' | 'neutral' | 'unhappy', delay: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const color = reaction === 'happy' ? '#3b82f6' : reaction === 'unhappy' ? '#f43f5e' : '#94a3b8';
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime + delay;
      if (reaction === 'happy') {
        groupRef.current.position.y = Math.abs(Math.sin(time * 4)) * 0.15;
        groupRef.current.rotation.z = Math.sin(time * 2) * 0.05;
      } else if (reaction === 'neutral') {
        groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
      } else {
        groupRef.current.rotation.x = Math.sin(time * 3) * 0.1;
      }
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Body */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.8, 16]} />
        <meshStandardMaterial color={reaction === 'happy' ? '#dbeafe' : '#f1f5f9'} roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 1, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      {/* Dynamic Halo */}
      <mesh position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.25, 0.01, 16, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function TownHallStage({ engagement, currentSlide, audienceSize = 24 }: { engagement: number, currentSlide: any, audienceSize?: number }) {
  const reaction = engagement > 70 ? 'happy' : engagement < 40 ? 'unhappy' : 'neutral';
  
  return (
    <group position={[0, -2, 0]}>
      {/* Floor - Premium Light Aesthetic */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>

      <Grid
        infiniteGrid
        fadeDistance={50}
        fadeStrength={5}
        cellSize={1}
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#e2e8f0"
        cellColor="#f1f5f9"
      />
      
      {/* Professional Podium - Mid-ground */}
      <group position={[0, 0, -2]}>
        <RoundedBox castShadow position={[0, 0.75, 0]} args={[2, 1.5, 0.8]} radius={0.1}>
          <meshStandardMaterial color="#f8fafc" metalness={0.1} roughness={0.5} />
          <Edges color="#3b82f6" threshold={15} />
        </RoundedBox>
        <mesh position={[0, 1.55, 0.2]} rotation={[-Math.PI / 12, 0, 0]}>
          <boxGeometry args={[2.2, 0.1, 1]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* Futuristic Projection Screen - Background */}
      <group position={[0, 5, -12]}>
        {/* Frame */}
        <RoundedBox args={[14, 8, 0.5]} radius={0.2}>
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.1} />
          <Edges color="#e2e8f0" />
        </RoundedBox>
        
        {/* Glass Screen Effect */}
        <mesh position={[0, 0, 0.26]}>
          <planeGeometry args={[13.5, 7.5]} />
          <meshStandardMaterial 
            color="#3b82f6" 
            transparent 
            opacity={0.05} 
            emissive="#3b82f6" 
            emissiveIntensity={0.1} 
          />
        </mesh>

        <Html transform distanceFactor={8} position={[0, 0, 0.3]} className="pointer-events-none">
          <div className="w-[1200px] h-[700px] bg-white p-20 flex flex-col items-center justify-center text-center rounded-[4rem] border-[20px] border-slate-50 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)] relative">
            {currentSlide ? (
              <div className="animate-in fade-in zoom-in slide-in-from-bottom-12 duration-700 w-full">
                <div className="inline-flex items-center justify-center p-6 bg-blue-50 rounded-[2.5rem] mb-12">
                  <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl">
                    {currentSlide.type === 'logic' ? <Brain size={40} className="text-white" /> : currentSlide.type === 'emotion' ? <Heart size={40} className="text-white" /> : <Coins size={40} className="text-white" />}
                  </div>
                  <div className="ml-8 text-left">
                    <span className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] block mb-1">Evidence Node</span>
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">{currentSlide.title}</h1>
                  </div>
                </div>
                
                <p className="text-5xl font-bold text-slate-600 leading-[1.3] max-w-5xl mx-auto mb-16 px-10">
                  {currentSlide.content}
                </p>

                <div className="flex items-center justify-center gap-10">
                  <div className="px-12 py-8 bg-slate-900 rounded-[2.5rem] shadow-2xl">
                    <div className="text-8xl font-black text-white tracking-tighter mb-2">{currentSlide.metric}</div>
                    <div className="text-xl font-black text-blue-400 uppercase tracking-[0.4em]">{currentSlide.label}</div>
                  </div>
                </div>
                
                {/* Floating Decorative Elements */}
                <div className="absolute top-16 left-16 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-16 right-16 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-12" key="no-slide">
                <div className="w-48 h-48 bg-slate-50 rounded-full flex items-center justify-center shadow-inner">
                  <Presentation size={80} className="text-slate-200" />
                </div>
                <div className="space-y-6">
                  <h1 className="text-6xl font-black text-slate-200 uppercase tracking-[0.2em] leading-none">Select Evidence</h1>
                  <p className="text-3xl font-bold text-slate-300">Choose your findings to present</p>
                </div>
              </div>
            )}
          </div>
        </Html>
      </group>

      {/* Audience Grid - More diverse positions */}
      {Array.from({ length: audienceSize }).map((_, i) => (
        <AudienceMember 
          key={i} 
          delay={i * 0.1}
          position={[
            ((i % 6) - 2.5) * 4 + (Math.random() - 0.5),
            0,
            -Math.floor(i / 6) * 3.5 + 4 + (Math.random() - 0.5)
          ]} 
          reaction={reaction}
        />
      ))}
    </group>
  );
}

// --- Logic & Data ---

const AUDIENCES = [
  { 
    id: 'principal', 
    name: 'School Principal', 
    title: 'Dr. Anita Desai',
    focus: 'Safety & Future', 
    difficulty: 'Easy',
    weights: { logic: 0.4, emotion: 0.4, budget: 0.2 },
    goal: "Ensuring long-term resource stability for students."
  },
  { 
    id: 'ceo', 
    name: 'Factory CEO', 
    title: 'Mr. Vikram Singhania',
    focus: 'Cost & Efficiency', 
    difficulty: 'Medium',
    weights: { logic: 0.3, emotion: 0.1, budget: 0.6 },
    goal: "Reducing operational overhead and utility bills."
  },
  { 
    id: 'ward', 
    name: 'Ward Officer', 
    title: 'Officer S. K. Gupta',
    focus: 'Policy & Public Good', 
    difficulty: 'Hard',
    weights: { logic: 0.6, emotion: 0.2, budget: 0.2 },
    goal: "Meeting municipal targets and preventing local shortages."
  }
];

const EVIDENCE_CARDS = [
  { 
    id: 1, 
    title: "The Leak Crisis", 
    content: "Audit identified 23 hidden leaks causing 23,000L of invisible loss daily.", 
    metric: "23k L", 
    label: "Daily Waste", 
    type: 'logic', 
    values: { logic: 35, emotion: 15, budget: 10 } 
  },
  { 
    id: 2, 
    title: "Financial ROI", 
    content: "Investment in sensor-based taps pays for itself in just 110 days via water savings.", 
    metric: "110d", 
    label: "Payback", 
    type: 'budget', 
    values: { logic: 10, emotion: 5, budget: 45 } 
  },
  { 
    id: 3, 
    title: "The Zero Date", 
    content: "Current consumption rates will deplete the local borewell by summer 2027.", 
    metric: "2027", 
    label: "Depletion", 
    type: 'emotion', 
    values: { logic: 15, emotion: 40, budget: 5 } 
  },
  { 
    id: 4, 
    title: "Smart Network", 
    content: "Installing 4 ultrasonic meters provides real-time detection of 95% of future leaks.", 
    metric: "95%", 
    label: "Detected", 
    type: 'logic', 
    values: { logic: 40, emotion: 10, budget: 10 } 
  },
  { 
    id: 5, 
    title: "Greywater Reuse", 
    content: "Recycling AC condensate can provide 100% of landscaping water needs.", 
    metric: "100%", 
    label: "Recycled", 
    type: 'budget', 
    values: { logic: 15, emotion: 20, budget: 25 } 
  },
  { 
    id: 6, 
    title: "Community Impact", 
    content: "82% of local residents are concerned about water quality and support this change.", 
    metric: "82%", 
    label: "Support", 
    type: 'emotion', 
    values: { logic: 10, emotion: 45, budget: 5 } 
  }
];

// --- Main Redesigned Component ---

export function TownHallSim() {
  const router = useRouter();
  const [phase, setPhase] = useState<'setup' | 'presenting' | 'result'>('setup');
  const [targetAudience, setTargetAudience] = useState(AUDIENCES[0]);
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<number[]>([]);
  const [stats, setStats] = useState({ logic: 20, emotion: 20, budget: 20 });
  
  // Calculate weighted engagement based on audience profile
  const engagement = useMemo(() => {
    const { logic, emotion, budget } = stats;
    const { weights } = targetAudience;
    const total = (logic * weights.logic) + (emotion * weights.emotion) + (budget * weights.budget);
    return Math.min(total * 2, 100); // Scale for impact
  }, [stats, targetAudience]);

  const handleSelectEvidence = (id: number) => {
    if (selectedEvidenceIds.includes(id)) return;
    if (selectedEvidenceIds.length >= 3) return;

    const evidence = EVIDENCE_CARDS.find(e => e.id === id);
    if (evidence) {
      setSelectedEvidenceIds([...selectedEvidenceIds, id]);
      setStats(prev => ({
        logic: Math.min(prev.logic + evidence.values.logic, 100),
        emotion: Math.min(prev.emotion + evidence.values.emotion, 100),
        budget: Math.min(prev.budget + evidence.values.budget, 100),
      }));
    }
  };

  const activeEvidence = useMemo(() => 
    EVIDENCE_CARDS.find(e => e.id === selectedEvidenceIds[selectedEvidenceIds.length - 1]), 
    [selectedEvidenceIds]
  );

  const reset = () => {
    setSelectedEvidenceIds([]);
    setStats({ logic: 20, emotion: 20, budget: 20 });
    setPhase('setup');
  };

  const isSuccess = selectedEvidenceIds.length === 3 && engagement >= 70;

  // --- RENDERING PHASES ---

  if (phase === 'setup') {
    return (
      <div className="flex flex-col w-full lg:aspect-[16/9] bg-white rounded-[4rem] border border-slate-200 shadow-2xl relative overflow-hidden">
        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 bg-slate-50 overflow-y-auto p-12 md:p-20 custom-scrollbar">
          <div className="text-center space-y-8 mb-16">
            <div className="inline-flex items-center gap-3 px-8 py-3 bg-blue-600 text-white rounded-full text-[12px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-600/20">
              <Sparkles size={16} /> Mission Briefing
            </div>
            <h2 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">Choose Your Audience</h2>
            <p className="text-2xl font-bold text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Advocacy is about tailoring your findings to the person who can make the decision. Who are you presenting to today?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {AUDIENCES.map(audience => (
              <button
                key={audience.id}
                onClick={() => setTargetAudience(audience)}
                className={`group relative p-10 rounded-[3rem] border-2 transition-all text-left overflow-hidden ${
                  targetAudience.id === audience.id 
                    ? 'bg-white border-blue-600 shadow-2xl scale-105' 
                    : 'bg-slate-100 border-transparent hover:bg-white hover:shadow-xl'
                }`}
              >
                {targetAudience.id === audience.id && (
                  <div className="absolute top-6 right-6 w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <UserCheck size={20} />
                  </div>
                )}
                <div className="space-y-6">
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-inner ${targetAudience.id === audience.id ? 'bg-blue-50 text-blue-600' : 'bg-white text-slate-300'}`}>
                    <Users size={32} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{audience.difficulty} Mode</span>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">{audience.title}</h4>
                    <p className="text-xs font-bold text-blue-500 uppercase mt-2 tracking-widest">{audience.focus}</p>
                  </div>
                  <p className="text-xs font-bold text-slate-400 leading-relaxed italic">"{audience.goal}"</p>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-12 flex justify-center pb-12">
            <button 
              onClick={() => setPhase('presenting')}
              className="px-20 py-10 bg-slate-900 text-white rounded-[3rem] font-black text-2xl uppercase tracking-widest hover:bg-blue-600 hover:shadow-[0_20px_50px_rgba(37,99,235,0.4)] transition-all flex items-center gap-8 group shadow-2xl"
            >
              Start Presentation <ArrowRight className="group-hover:translate-x-3 transition-transform" size={28} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Simulation Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-10 py-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex flex-col items-center justify-center shadow-xl shadow-blue-600/20">
            <Users className="text-white animate-pulse" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-1">Town Hall Sim</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live: {targetAudience.title}</span>
            </div>
          </div>
        </div>

        {/* Header HUD: Approval & Controls */}
        <div className="flex items-center gap-4 no-print">
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
             <div className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all ${engagement > 70 ? 'bg-emerald-500 text-white' : engagement > 40 ? 'bg-blue-600 text-white' : 'bg-rose-500 text-white'}`}>
                <Users size={16} />
                <span className="text-xs font-black uppercase tracking-widest">{engagement.toFixed(0)}% Approval</span>
             </div>
             <button onClick={reset} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                <RotateCcw size={18} />
             </button>
          </div>

          <div className="hidden lg:flex gap-3">
            {[
              { icon: RotateCcw, label: "View", sub: "Orbit", color: "bg-blue-600" },
              { icon: Info, label: "Guide", sub: "Data", color: "bg-slate-900" }
            ].map((hud, idx) => (
              <div key={idx} className="px-4 py-2 bg-white rounded-xl border border-slate-100 flex items-center gap-3 group hover:shadow-md transition-all cursor-help">
                <div className={`w-8 h-8 ${hud.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                  <hud.icon size={14} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none mb-0.5">{hud.label}</span>
                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none">{hud.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div> 
      </div>

      {/* Main Simulation View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:min-h-[600px]">
        
        {/* 3D Visualizer */}
        <div className="lg:col-span-8 min-h-[400px] bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
          <Canvas shadows dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 8, 16]} fov={35} />
            <OrbitControls 
              enablePan={false} 
              minDistance={10} 
              maxDistance={25}
              maxPolarAngle={Math.PI / 2.1}
              minPolarAngle={Math.PI / 6}
              target={[0, 2, 0]}
            />
            
            <ambientLight intensity={1.2} />
            <spotLight position={[0, 20, 10]} intensity={1200} angle={0.5} penumbra={1} castShadow />
            <pointLight position={[5, 10, 5]} intensity={500} color="#3b82f6" />
            <pointLight position={[-5, 5, 5]} intensity={200} color="#f43f5e" />
            
            <Suspense fallback={null}>
              <TownHallStage engagement={engagement} currentSlide={activeEvidence} />
              <Environment preset="city" />
              <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={50} blur={2.5} far={20} color="#000000" />
            </Suspense>
          </Canvas>

          {/* Instructions Overlay */}
          <div className="absolute top-8 left-8 z-10 pointer-events-none">
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-5 rounded-2xl space-y-3 shadow-2xl">
              <div className="flex items-center gap-3 text-blue-400">
                <Info size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">How to Present</span>
              </div>
              <ul className="space-y-2">
                {[
                  "Select 3 pieces of evidence to build your case.",
                  "Observe the approval rating in the header.",
                  "Reach 70% approval to succeed."
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70 text-[9px] font-bold">
                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interaction Guide - Integrated Bottom Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
            <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-2xl px-8 py-4 rounded-2xl border border-white/10 flex items-center justify-between shadow-2xl">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-500 ${selectedEvidenceIds.length >= i ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 scale-110' : 'bg-white/5 text-white/20 border border-white/5'}`}>
                    {i}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] leading-none mb-1 ${selectedEvidenceIds.length >= i ? 'text-blue-400' : 'text-white/20'}`}>
                      {i === 1 ? 'Phase 01' : i === 2 ? 'Phase 02' : 'Phase 03'}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${selectedEvidenceIds.length >= i ? 'text-white' : 'text-white/20'}`}>
                      {i === 1 ? 'Opening' : i === 2 ? 'Evidence' : 'Impact'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deck Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4 lg:max-h-[600px]">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl flex-1 overflow-y-auto custom-scrollbar relative">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Strategy Panel</span>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Select Evidence</h3>
              </div>
              <Target size={24} className="text-slate-200" />
            </div>

            {/* Impact Gauges */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Data", val: stats.logic, icon: Brain, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Impact", val: stats.emotion, icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
                { label: "Cost", val: stats.budget, icon: Coins, color: "text-amber-600", bg: "bg-amber-50" }
              ].map(g => (
                <div key={g.label} className={`p-4 ${g.bg} rounded-[2rem] border border-white/50 flex flex-col items-center gap-3`}>
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <g.icon className={g.color} size={20} />
                  </div>
                  <div className="h-20 w-2 bg-white/50 rounded-full overflow-hidden relative">
                    <div 
                      className={`absolute bottom-0 w-full ${g.color.replace('text-', 'bg-')} transition-all duration-1000 ease-out`}
                      style={{ height: `${g.val}%` }}
                    />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">{g.label}</span>
                </div>
              ))}
            </div>

            {/* Available Evidence */}
            <div className="space-y-4">
              {EVIDENCE_CARDS.map(card => {
                const isSelected = selectedEvidenceIds.includes(card.id);
                const isFull = selectedEvidenceIds.length >= 3;
                return (
                  <button
                    key={card.id}
                    onClick={() => handleSelectEvidence(card.id)}
                    disabled={isSelected || isFull}
                    className={`w-full p-6 rounded-3xl border-2 text-left transition-all group flex items-center gap-5 ${
                      isSelected 
                        ? 'bg-slate-900 border-slate-900 text-white opacity-40 grayscale' 
                        : isFull
                          ? 'bg-slate-50 border-slate-50 opacity-50 cursor-not-allowed'
                          : 'bg-white border-slate-100 hover:border-blue-500 hover:translate-x-2'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/10' : 'bg-slate-50 shadow-inner'}`}>
                      {card.type === 'logic' ? <Brain size={24} /> : card.type === 'emotion' ? <Heart size={24} /> : <Coins size={24} />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black uppercase tracking-tight">{card.title}</h4>
                      <p className={`text-[10px] font-bold mt-1 line-clamp-1 ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                        {card.content}
                      </p>
                    </div>
                    {!isSelected && !isFull && <ChevronRight className="text-slate-200 group-hover:text-blue-500 transition-colors" />}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6 shadow-2xl relative overflow-hidden">
            {/* Success Decorative Glow */}
            {isSuccess && <div className="absolute inset-0 bg-blue-600/20 blur-[100px] animate-pulse" />}
            
            <div className="relative z-10 flex items-start gap-6">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/5">
                <BarChart3 size={24} className="text-blue-400" />
              </div>
              <p className="text-xs font-bold text-blue-300 leading-relaxed">
                Strategic Note: {targetAudience.name} focuses on <strong>{targetAudience.focus}</strong>. Use high-impact evidence that aligns with these priorities.
              </p>
            </div>

            <button
              onClick={() => isSuccess ? router.push('/4-3') : reset()}
              disabled={selectedEvidenceIds.length < 3}
              className={`w-full h-20 rounded-[2rem] flex items-center justify-center gap-4 font-black text-sm uppercase tracking-widest transition-all relative z-10 ${
                selectedEvidenceIds.length === 3
                  ? isSuccess
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_20px_50px_rgba(37,99,235,0.4)]'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_20px_50px_rgba(244,63,94,0.4)]'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {isSuccess ? (
                <>Mission Accomplished <CheckCircle2 size={24} /></>
              ) : (
                selectedEvidenceIds.length === 3 ? (
                  <>Retry Advocacy <RotateCcw size={20} /></>
                ) : (
                  <>Selection Incomplete <Target size={20} className="animate-pulse" /></>
                )
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Strategic Advocacy Guidelines */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-10 shadow-xl relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50/50 rounded-full blur-3xl -ml-32 -mb-32" />

        {[
          { 
            icon: Mail, 
            color: "text-blue-600", 
            bg: "bg-blue-50", 
            title: "Audience Profiling", 
            desc: "Every stakeholder has a different 'Currency of Care'. A Municipal Officer values legal compliance, while a Parent values safety. Identify their main concern before picking your data." 
          },
          { 
            icon: BarChart3, 
            color: "text-emerald-600", 
            bg: "bg-emerald-50", 
            title: "Data Integrity", 
            desc: "Emotional stories get attention, but audited data builds trust. Always support your claims with specific volumes, cost-savings, and measured wastage from your actual field audit." 
          },
          { 
            icon: Award, 
            color: "text-amber-600", 
            bg: "bg-amber-50", 
            title: "Clear Call to Action", 
            desc: "Don't just present a problem. End every advocacy pitch with a clear, achievable solution—like installing 5 aerators or running a greywater pilot for a single garden bed." 
          }
        ].map((item, idx) => (
          <div key={idx} className="relative z-10 flex flex-col gap-6">
            <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-[1.8rem] flex items-center justify-center shadow-inner`}>
              <item.icon size={32} />
            </div>
            <div className="space-y-3">
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">{item.title}</h4>
              <p className="text-sm text-slate-500 font-bold leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
