'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Volume2, VolumeX } from 'lucide-react';

interface AquamanHelperProps {
  title: string;
}

const AQUAMAN_TIPS = [
  {
    tag: "01 WATER WASTE",
    tagColor: "bg-[#60a5fa]",
    title: "A dripping faucet wastes up to 2,000 gallons of water a year!"
  },
  {
    tag: "02 HUMAN BODY",
    tagColor: "bg-[#34d399]",
    title: "A jellyfish is 95% water, and human bones are 31% water!"
  },
  {
    tag: "03 GLOBAL SUPPLY",
    tagColor: "bg-[#fbbf24]",
    title: "Only 1% of the world's water is usable for all of humanity's needs."
  }
];

export function AquamanHelper({ title }: AquamanHelperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleTTS = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const textToRead = `Aqua Man's Tips for ${title}. ` + AQUAMAN_TIPS.map(tip => `${tip.tag}. ${tip.title}`).join(" ");
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div 
      className={`w-full transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-300 to-blue-500 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)] z-10 animate-bounce hover:animate-none cursor-pointer overflow-hidden border-2 border-white">
            <img 
              src="/images/aquaman.png" 
              alt="Aquaman" 
              className="w-full h-full object-cover rounded-full"
            />
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-0.5 border border-white z-20">
              <Sparkles className="w-3 h-3 text-orange-600" />
            </div>
          </div>
          <h3 className="font-extrabold text-xl text-slate-800">Aqua Man's Tips</h3>
        </div>
        <button 
          onClick={handleTTS}
          className={`shrink-0 p-2.5 rounded-full transition-colors shadow-sm border border-slate-100 ${
            isPlaying ? 'bg-blue-100 text-blue-600' : 'bg-white hover:bg-slate-50 text-slate-500'
          }`}
          title={isPlaying ? "Stop listening" : "Listen to tips"}
        >
          {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {AQUAMAN_TIPS.map((tip, idx) => (
          <div 
            key={idx} 
            className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white flex flex-col items-start gap-3"
          >
            <span className={`${tip.tagColor} text-white font-bold text-[9px] tracking-widest uppercase px-3 py-1 rounded-full shadow-sm`}>
              {tip.tag}
            </span>
            <h4 className="text-sm md:text-base font-bold text-slate-800 leading-snug">
              {tip.title}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
}
