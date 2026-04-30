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
  Award
} from "lucide-react";
import * as THREE from "three";

// --- 3D Components ---

function AudienceMember({ position, reaction }: { position: [number, number, number], reaction: 'happy' | 'neutral' | 'unhappy' }) {
  const color = reaction === 'happy' ? '#22c55e' : reaction === 'unhappy' ? '#ef4444' : '#94a3b8';
  
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.8, 16]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <mesh castShadow position={[0, 1, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
      <Float speed={5} floatIntensity={0.2} rotationIntensity={0.1}>
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </Float>
    </group>
  );
}

function TownHallScene({ engagement, currentSlide }: { engagement: number, currentSlide: any }) {
  const reaction = engagement > 70 ? 'happy' : engagement < 40 ? 'unhappy' : 'neutral';
  
  return (
    <group position={[0, -1, 0]}>
      {/* Hall Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.1} />
      </mesh>
      
      {/* Podium */}
      <mesh castShadow position={[0, 0.5, 4]}>
        <boxGeometry args={[1.5, 1, 0.8]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      {/* Presentation Screen */}
      <group position={[0, 3, 6]}>
        <mesh castShadow>
          <planeGeometry args={[8, 4.5]} />
          <meshStandardMaterial color="#1e293b" emissive="#1e293b" emissiveIntensity={0.2} />
        </mesh>
        <Html transform distanceFactor={5} position={[0, 0, 0.01]}>
          <div className="w-[800px] h-[450px] bg-white p-12 flex flex-col items-center justify-center text-center">
            {currentSlide ? (
              <div className="animate-in fade-in zoom-in duration-500">
                <h1 className="text-6xl font-black text-slate-900 mb-8 tracking-tighter uppercase">{currentSlide.title}</h1>
                <div className="w-24 h-2 bg-blue-600 mb-12" />
                <p className="text-3xl font-bold text-slate-500 leading-relaxed max-w-2xl">{currentSlide.content}</p>
                <div className="mt-16 flex gap-12">
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-black text-blue-600 mb-2">{currentSlide.metric}</div>
                    <div className="text-xl font-bold text-slate-400 uppercase tracking-widest">{currentSlide.label}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Presentation className="w-32 h-32 text-slate-200 mb-8" />
                <h1 className="text-4xl font-black text-slate-300 uppercase tracking-widest">Awaiting Slide...</h1>
              </div>
            )}
          </div>
        </Html>
      </group>

      {/* Audience Rows */}
      {Array.from({ length: 15 }).map((_, i) => (
        <AudienceMember 
          key={i} 
          position={[
            ((i % 5) - 2) * 2,
            0,
            -Math.floor(i / 5) * 2
          ]} 
          reaction={reaction}
        />
      ))}

      <Grid
        infiniteGrid
        fadeDistance={40}
        fadeStrength={5}
        cellSize={1}
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#2563eb"
        cellColor="#94a3b8"
      />
    </group>
  );
}

// --- Main Activity ---

export function TownHallSim() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSlides, setSelectedSlides] = useState<any[]>([]);
  const [engagement, setEngagement] = useState(50);
  const [logic, setLogic] = useState(50);
  const [emotion, setEmotion] = useState(50);
  const [budget, setBudget] = useState(50);

  const availableSlides = [
    { id: 1, title: "Data Audit", content: "Our school wastes 12,000L of water every single day due to hidden leaks.", metric: "12k L", label: "Daily Waste", type: 'logic', impact: { logic: 20, emotion: 5, budget: -5 } },
    { id: 2, title: "The Solution", content: "By installing smart meters and aerators, we can recover 40% of this loss.", metric: "40%", label: "Recovery", type: 'budget', impact: { logic: 10, emotion: 10, budget: 15 } },
    { id: 3, title: "Our Community", content: "Safe water isn't just about plumbing; it's about our students' health.", metric: "1,200", label: "Students", type: 'emotion', impact: { logic: 5, emotion: 25, budget: 0 } },
    { id: 4, title: "Cost Efficiency", content: "The system pays for itself in 6 months through reduced water bills.", metric: "6 mo", label: "ROI", type: 'budget', impact: { logic: 15, emotion: 0, budget: 25 } }
  ];

  const handleSlideSelect = (slide: any) => {
    if (selectedSlides.length < 3 && !selectedSlides.find(s => s.id === slide.id)) {
      setSelectedSlides([...selectedSlides, slide]);
      setLogic(prev => Math.min(prev + slide.impact.logic, 100));
      setEmotion(prev => Math.min(prev + slide.impact.emotion, 100));
      setBudget(prev => Math.min(prev + slide.impact.budget, 100));
      setEngagement(prev => Math.min((logic + emotion + budget) / 1.5, 100));
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setSelectedSlides([]);
    setEngagement(50);
    setLogic(50);
    setEmotion(50);
    setBudget(50);
  };

  return (
    <div className="relative w-full h-[600px] bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
      <Canvas shadows className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 5, 12]} fov={50} />
        <OrbitControls 
          enablePan={false} 
          minDistance={8} 
          maxDistance={18}
          maxPolarAngle={Math.PI / 2.1}
        />
        
        <ambientLight intensity={1.5} />
        <spotLight position={[0, 10, 10]} intensity={200} castShadow />
        
        <Suspense fallback={null}>
          <TownHallScene 
            engagement={engagement} 
            currentSlide={selectedSlides[selectedSlides.length - 1]} 
          />
          <Environment preset="city" />
          <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
        </Suspense>
      </Canvas>

      {/* TOP HUD: GAUGES */}
      <div className="absolute top-6 left-6 right-6 flex items-start justify-between pointer-events-none">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-2xl pointer-events-auto max-w-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Presentation className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tighter">Town Hall Presentation</h2>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                Advocacy Mode
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { label: "Logic", val: logic, icon: <Brain className="w-3 h-3" />, color: "bg-blue-600" },
              { label: "Emotion", val: emotion, icon: <Heart className="w-3 h-3" />, color: "bg-red-500" },
              { label: "Budget", val: budget, icon: <Coins className="w-3 h-3" />, color: "bg-amber-500" }
            ].map((g) => (
              <div key={g.label}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className="text-slate-400">{g.icon}</div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{g.label}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-900">{g.val}%</span>
                </div>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${g.color} transition-all duration-500`} 
                    style={{ width: `${g.val}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-2xl pointer-events-auto w-48 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Audience Engagement</span>
          <div className={`text-4xl font-black ${engagement > 70 ? 'text-green-600' : engagement < 40 ? 'text-red-600' : 'text-blue-600'}`}>
            {engagement.toFixed(0)}%
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${engagement > 70 ? 'bg-green-600' : engagement < 40 ? 'bg-red-600' : 'bg-blue-600'}`} 
              style={{ width: `${engagement}%` }} 
            />
          </div>
          <div className="flex items-center justify-center gap-1 mt-2">
            <Users className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {engagement > 70 ? 'Supportive' : engagement < 40 ? 'Skeptical' : 'Interested'}
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM HUD: SLIDE DECK */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-3xl">
        <div className="bg-white/80 backdrop-blur-xl px-10 py-6 rounded-[3rem] border border-white shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select 3 Strategic Slides</span>
            <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-full">
              {selectedSlides.length} / 3 Selected
            </span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {availableSlides.map((slide) => {
              const isSelected = selectedSlides.find(s => s.id === slide.id);
              return (
                <button
                  key={slide.id}
                  onClick={() => handleSlideSelect(slide)}
                  disabled={isSelected || selectedSlides.length >= 3}
                  className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col justify-between h-28 ${
                    isSelected 
                      ? "bg-blue-50 border-blue-100 opacity-60" 
                      : selectedSlides.length >= 3
                        ? "bg-slate-50 border-slate-50 opacity-40 cursor-not-allowed"
                        : "bg-white border-white hover:border-blue-200 shadow-sm hover:-translate-y-1"
                  }`}
                >
                  <h4 className="text-[10px] font-black uppercase leading-tight text-slate-900">{slide.title}</h4>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400">
                      {slide.type === 'logic' ? <Brain className="w-3 h-3" /> : slide.type === 'emotion' ? <Heart className="w-3 h-3" /> : <Coins className="w-3 h-3" />}
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedSlides.length === 3 && engagement > 70 && (
        <div className="absolute inset-0 bg-blue-600/90 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl mb-8">
            <Award className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Proposal Accepted!</h2>
          <p className="text-blue-50 text-lg max-w-md mb-8">
            The committee was impressed by your balanced presentation. They've agreed to fund the "Smart Metering" project immediately.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={reset}
              className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-all active:scale-95 shadow-xl"
            >
              Review Presentation
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
