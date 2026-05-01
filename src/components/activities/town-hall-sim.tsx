"use client";

import React, { useState, Suspense, useMemo, useRef } from "react";
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
  MeshTransmissionMaterial,
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
  BarChart,
  ArrowRight,
  TrendingUp,
  Award,
  ChevronRight,
  Info,
  Sparkles,
  Target,
  Mic2,
  ThumbsUp
} from "lucide-react";
import * as THREE from "three";
import { useRouter } from "next/navigation";

// --- 3D Components ---

function AudienceMember({ position, reaction }: { position: [number, number, number], reaction: 'happy' | 'neutral' | 'unhappy' }) {
  const groupRef = useRef<THREE.Group>(null);
  const color = reaction === 'happy' ? '#22c55e' : reaction === 'unhappy' ? '#ef4444' : '#64748b';
  
  useFrame((state) => {
    if (groupRef.current && reaction === 'happy') {
      groupRef.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 5 + position[0])) * 0.2;
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Body */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.8, 16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 1, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
      </mesh>
      {/* Reaction Icon */}
      <Float speed={4} floatIntensity={0.2} rotationIntensity={0.1}>
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </Float>
    </group>
  );
}

function TownHallStage({ engagement, currentSlide }: { engagement: number, currentSlide: any }) {
  const reaction = engagement > 70 ? 'happy' : engagement < 40 ? 'unhappy' : 'neutral';
  
  return (
    <group position={[0, -2, 0]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

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
      
      {/* Podium */}
      <mesh castShadow position={[0, 0.8, 6]}>
        <boxGeometry args={[2, 1.6, 1]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.1} />
        <Edges color="#3b82f6" />
      </mesh>

      {/* Screen Holder */}
      <group position={[0, 5, 10]}>
        <RoundedBox args={[12, 7, 0.4]} radius={0.1}>
          <meshStandardMaterial color="#1e293b" />
        </RoundedBox>
        
        {/* Actual Slide Content */}
        <Html transform distanceFactor={7} position={[0, 0, 0.25]}>
          <div className="w-[1200px] h-[700px] bg-white p-24 flex flex-col items-center justify-center text-center rounded-[3rem] border-[15px] border-slate-900 overflow-hidden shadow-2xl relative">
            {currentSlide ? (
              <div className="animate-in fade-in zoom-in duration-500 w-full">
                <div className="flex items-center justify-center gap-10 mb-16">
                  <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40">
                    {currentSlide.type === 'logic' ? <Brain size={48} className="text-white" /> : currentSlide.type === 'emotion' ? <Heart size={48} className="text-white" /> : <Coins size={48} className="text-white" />}
                  </div>
                  <h1 className="text-8xl font-black text-slate-900 tracking-tighter uppercase leading-none">{currentSlide.title}</h1>
                </div>
                <p className="text-5xl font-bold text-slate-500 leading-tight max-w-5xl mx-auto mb-20">{currentSlide.content}</p>
                <div className="flex items-center justify-center gap-32">
                  <div className="text-center">
                    <div className="text-9xl font-black text-blue-600 mb-6">{currentSlide.metric}</div>
                    <div className="text-3xl font-black text-slate-300 uppercase tracking-[0.4em]">{currentSlide.label}</div>
                  </div>
                </div>
                
                {/* Visual Accent */}
                <div className="absolute top-10 right-10 flex gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-100" />
                  <div className="w-4 h-4 rounded-full bg-slate-100" />
                  <div className="w-4 h-4 rounded-full bg-slate-100" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-12 opacity-10">
                <Presentation size={200} className="text-slate-400" />
                <h1 className="text-7xl font-black text-slate-400 uppercase tracking-widest">Select Your Evidence</h1>
              </div>
            )}
          </div>
        </Html>
      </group>

      {/* Audience Grid */}
      {Array.from({ length: 24 }).map((_, i) => (
        <AudienceMember 
          key={i} 
          position={[
            ((i % 6) - 2.5) * 3,
            0,
            -Math.floor(i / 6) * 3 + 2
          ]} 
          reaction={reaction}
        />
      ))}
    </group>
  );
}

// --- Main Activity ---

const AUDIENCES = [
  { id: 'principal', name: 'School Principal', focus: 'Safety & Future', difficulty: 'Easy' },
  { id: 'ceo', name: 'Factory CEO', focus: 'Cost & Efficiency', difficulty: 'Medium' },
  { id: 'ward', name: 'Local Ward Officer', focus: 'Policy & Public Good', difficulty: 'Hard' }
];

const SLIDES = [
  { id: 1, title: "Massive Waste", content: "Our audit detected 23,000L of daily waste due to invisible piping leaks.", metric: "23k L", label: "Daily Loss", type: 'logic', impact: { logic: 30, emotion: 10, budget: -10 } },
  { id: 2, title: "Economic ROI", content: "Fixing these leaks has a payback period of just 4 months through utility savings.", metric: "4 Mo", label: "Payback", type: 'budget', impact: { logic: 10, emotion: 0, budget: 40 } },
  { id: 3, title: "Shared Future", content: "If we don't act now, the local borewells will be dry within 3 years.", metric: "2029", label: "Dry Date", type: 'emotion', impact: { logic: 5, emotion: 40, budget: 0 } },
  { id: 4, title: "Tech Upgrade", content: "Smart ultrasonic meters can pinpoint leaks before they become catastrophic.", metric: "0.1L", label: "Precision", type: 'logic', impact: { logic: 20, emotion: 5, budget: 15 } },
  { id: 5, title: "Zero Waste", content: "We can recycle 100% of our greywater for cooling and landscaping.", metric: "100%", label: "Recycled", type: 'budget', impact: { logic: 10, emotion: 20, budget: 20 } }
];

export function TownHallSim() {
  const router = useRouter();
  const [selectedSlideIds, setSelectedSlideIds] = useState<number[]>([]);
  const [logic, setLogic] = useState(30);
  const [emotion, setEmotion] = useState(30);
  const [budget, setBudget] = useState(30);
  const [targetAudience, setTargetAudience] = useState(AUDIENCES[0]);

  const engagement = useMemo(() => {
    return Math.min((logic + emotion + budget) / 1.8, 100);
  }, [logic, emotion, budget]);

  const handleSelect = (id: number) => {
    if (selectedSlideIds.includes(id)) return;
    if (selectedSlideIds.length >= 3) return;

    const slide = SLIDES.find(s => s.id === id);
    if (slide) {
      setSelectedSlideIds([...selectedSlideIds, id]);
      setLogic(prev => Math.min(prev + slide.impact.logic, 100));
      setEmotion(prev => Math.min(prev + slide.impact.emotion, 100));
      setBudget(prev => Math.min(prev + slide.impact.budget, 100));
    }
  };

  const reset = () => {
    setSelectedSlideIds([]);
    setLogic(30);
    setEmotion(30);
    setBudget(30);
  };

  const activeSlide = useMemo(() => 
    SLIDES.find(s => s.id === selectedSlideIds[selectedSlideIds.length - 1]), 
    [selectedSlideIds]
  );

  const isSuccess = selectedSlideIds.length === 3 && engagement > 75;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[800px]">
        
        {/* LEFT: 3D Stage (Col 8) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-[3rem] relative overflow-hidden shadow-2xl border border-slate-800">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 10, 22]} fov={35} />
            <OrbitControls 
              enablePan={false} 
              minDistance={12} 
              maxDistance={30}
              maxPolarAngle={Math.PI / 2.2}
              minPolarAngle={Math.PI / 6}
            />
            
            <ambientLight intensity={1} />
            <spotLight position={[0, 20, 10]} intensity={1000} castShadow />
            <pointLight position={[0, 5, 10]} intensity={200} color="#3b82f6" />
            
            <Suspense fallback={null}>
              <TownHallStage engagement={engagement} currentSlide={activeSlide} />
              <Environment preset="studio" />
              <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={30} blur={2.5} far={10} color="#000000" />
            </Suspense>
          </Canvas>

          {/* HUD Overlay */}
          <div className="absolute top-8 left-8 flex flex-col gap-4">
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Mic2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Live Presentation</span>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{targetAudience.name}</h2>
                </div>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl min-w-[200px]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Audience Engagement</span>
                <ThumbsUp size={16} className={engagement > 70 ? "text-emerald-400 animate-bounce" : "text-slate-600"} />
              </div>
              <div className="text-4xl font-black text-white leading-none">{engagement.toFixed(0)}%</div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mt-4">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000"
                  style={{ width: `${engagement}%` }}
                />
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">
            <span className={selectedSlideIds.length >= 1 ? 'text-blue-400' : ''}>Intro</span>
            <ChevronRight size={14} />
            <span className={selectedSlideIds.length >= 2 ? 'text-blue-400' : ''}>Evidence</span>
            <ChevronRight size={14} />
            <span className={selectedSlideIds.length >= 3 ? 'text-blue-400' : ''}>Call to Action</span>
          </div>
        </div>

        {/* RIGHT: Deck Builder (Col 4) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex-1 flex flex-col overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Deck Strategy</h3>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <Target size={20} className="text-slate-300" />
              </div>
            </div>

            {/* Gauges */}
            <div className="grid grid-cols-3 gap-3 mb-10">
              {[
                { label: "Logic", val: logic, icon: Brain, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Emotion", val: emotion, icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
                { label: "Budget", val: budget, icon: Coins, color: "text-amber-600", bg: "bg-amber-50" }
              ].map(g => (
                <div key={g.label} className={`p-4 ${g.bg} rounded-3xl border border-white/50 flex flex-col items-center gap-3`}>
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <g.icon className={g.color} size={18} />
                  </div>
                  <div className="h-20 w-1.5 bg-white/50 rounded-full overflow-hidden relative">
                    <div 
                      className={`absolute bottom-0 w-full ${g.color.replace('text-', 'bg-')} transition-all duration-700 ease-out`}
                      style={{ height: `${g.val}%` }}
                    />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{g.label}</span>
                </div>
              ))}
            </div>

            {/* Slide Selection */}
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Slides</span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{selectedSlideIds.length}/3</span>
              </div>
              <div className="flex flex-col gap-3">
                {SLIDES.map(slide => {
                  const isSelected = selectedSlideIds.includes(slide.id);
                  return (
                    <button
                      key={slide.id}
                      onClick={() => handleSelect(slide.id)}
                      disabled={isSelected || selectedSlideIds.length >= 3}
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all group ${
                        isSelected 
                          ? 'bg-slate-900 border-slate-900 text-white opacity-50' 
                          : selectedSlideIds.length >= 3
                            ? 'bg-slate-50 border-slate-50 opacity-40 cursor-not-allowed'
                            : 'bg-white border-slate-100 hover:border-blue-400 hover:bg-blue-50/30'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/10' : 'bg-slate-50 shadow-inner'}`}>
                        {slide.type === 'logic' ? <Brain size={24} /> : slide.type === 'emotion' ? <Heart size={24} /> : <Coins size={24} />}
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="text-xs font-black uppercase tracking-tight">{slide.title}</h4>
                        <p className={`text-[10px] font-bold mt-1 line-clamp-1 ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                          {slide.content}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                <Info size={20} className="text-blue-400" />
              </div>
              <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                Advocacy requires a balanced message. Use <strong>Logic</strong> for technical proof, <strong>Emotion</strong> for social buy-in, and <strong>Budget</strong> for management approval.
              </p>
            </div>

            <button
              onClick={() => isSuccess ? router.push('/4-3') : reset()}
              disabled={selectedSlideIds.length < 3}
              className={`w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-black transition-all ${
                selectedSlideIds.length === 3
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {isSuccess ? 'Continue to Career Path' : (selectedSlideIds.length === 3 ? 'Retry Strategy' : 'Finalize Deck')}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Strategic Footer */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-12 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
            <Presentation size={28} />
          </div>
          <h4 className="text-lg font-black text-slate-900 tracking-tight">Know Your Audience</h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">Different stakeholders care about different outcomes. A Ward Officer values public benefit, while a CEO values ROI. Tailor your evidence to their priorities.</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
            <BarChart size={28} />
          </div>
          <h4 className="text-lg font-black text-slate-900 tracking-tight">Evidence-Based Advocacy</h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">Passion is important, but data wins arguments. Always lead with audited findings and measured wastage before proposing high-budget interventions.</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner">
            <Award size={28} />
          </div>
          <h4 className="text-lg font-black text-slate-900 tracking-tight">The Call to Action</h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">Don't just point out problems. Every advocacy communication must end with a clear, achievable next step—like a pilot project or a technical review meeting.</p>
        </div>
      </div>
    </div>
  );
}
