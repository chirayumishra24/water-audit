"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

export function CustomVideoPlayer({ src, title }: { src: string; title?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Toggle play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  // Handle metadata loaded
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    videoRef.current.volume = vol;
    setIsMuted(vol === 0);
  };

  // Toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    videoRef.current.muted = newMuted;
  };

  // Toggle fullscreen
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  // Handle track end
  const handleEnded = () => {
    setIsPlaying(false);
  };

  // Auto-hide controls on mouse idle
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      return;
    }

    let idleTimer: NodeJS.Timeout;
    
    const resetIdleTimer = () => {
      setShowControls(true);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 2500);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", resetIdleTimer);
      container.addEventListener("click", resetIdleTimer);
    }

    // Set initial timer
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      if (container) {
        container.removeEventListener("mousemove", resetIdleTimer);
        container.removeEventListener("click", resetIdleTimer);
      }
    };
  }, [isPlaying]);

  // Format time (MM:SS)
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video rounded-[2rem] overflow-hidden bg-slate-950 border border-white/10 shadow-2xl group/player select-none my-12"
    >
      {/* Video Element */}
      <video 
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        playsInline
      />

      {/* Large Center Play Overlay */}
      <div 
        className={`absolute inset-0 flex items-center justify-center bg-black/25 pointer-events-none transition-opacity duration-300 ${isPlaying ? "opacity-0" : "opacity-100"}`}
      >
        <button 
          onClick={togglePlay}
          className="pointer-events-auto w-20 h-20 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-[0_0_30px_rgba(33,86,218,0.5)] border border-white/20 transform hover:scale-110 active:scale-95 transition-all duration-300"
        >
          {isPlaying ? <Pause size={36} fill="white" /> : <Play size={36} fill="white" className="ml-1" />}
        </button>
      </div>

      {/* Title Bar overlay */}
      {title && (
        <div className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-6 transition-transform duration-300 ${showControls ? "translate-y-0" : "-translate-y-full"}`}>
          <h4 className="text-white text-base font-bold tracking-wide m-0 drop-shadow-md">{title}</h4>
        </div>
      )}

      {/* Bottom Controls Panel */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-4 transition-transform duration-300 ${showControls ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Progress bar container */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs font-semibold text-slate-300 font-mono select-none">{formatTime(currentTime)}</span>
          <input 
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-grow h-1.5 rounded-lg appearance-none bg-slate-600/50 cursor-pointer accent-blue-500 focus:outline-none transition-all hover:h-2"
            style={{
              background: `linear-gradient(to right, #2156da 0%, #2156da ${(currentTime / (duration || 1)) * 100}%, rgba(71, 85, 105, 0.5) ${(currentTime / (duration || 1)) * 100}%, rgba(71, 85, 105, 0.5) 100%)`
            }}
          />
          <span className="text-xs font-semibold text-slate-300 font-mono select-none">{formatTime(duration)}</span>
        </div>

        {/* Lower control row */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            {/* Play/Pause Button */}
            <button 
              onClick={togglePlay}
              className="text-white hover:text-blue-400 transition-colors focus:outline-none"
            >
              {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 group/volume">
              <button 
                onClick={toggleMute}
                className="text-white hover:text-blue-400 transition-colors focus:outline-none"
              >
                {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </button>
              <input 
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-12 h-1 rounded-lg appearance-none bg-slate-600 cursor-pointer accent-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Fullscreen Button */}
            <button 
              onClick={toggleFullscreen}
              className="text-white hover:text-blue-400 transition-colors focus:outline-none"
            >
              {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
