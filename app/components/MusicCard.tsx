"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

type MusicCardProps = {
  index: number;
  title: string;
  tag: string;
  src: string;
  isActive: boolean;
  onToggle: () => void;
  onEnded: () => void;
};

function formatTime(t: number) {
  if (!isFinite(t) || t < 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function MusicCard({ index, title, tag, src, isActive, onToggle, onEnded }: MusicCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isActive) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isActive]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
  }, [onEnded]);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  }

  return (
    <div
      className={`group relative border border-black p-5 flex flex-col gap-4 transition-colors duration-300 ${
        isActive ? "bg-[#111111] text-white" : "bg-white hover:bg-neutral-50"
      }`}
    >
      <audio ref={audioRef} src={src} preload="none" />

      <div className="flex justify-between items-start">
        <span className="font-mono-data text-[9px] tracking-widest uppercase opacity-50">
          {tag} &middot; {String(index).padStart(2, "0")}
        </span>
        <span className="font-mono-data text-[9px] tracking-widest uppercase opacity-50">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex gap-1.5 shrink-0">
          {[0, 1].map((r) => (
            <div
              key={r}
              className={`w-6 h-6 border-2 flex items-center justify-center ${
                isActive ? "border-white animate-spin" : "border-black"
              }`}
              style={isActive ? { animationDuration: "1.8s" } : undefined}
            >
              <div className={`w-1.5 h-1.5 ${isActive ? "bg-white" : "bg-black"}`} />
            </div>
          ))}
        </div>

        <button
          onClick={onToggle}
          aria-label={isActive ? `Pause ${title}` : `Play ${title}`}
          className={`w-10 h-10 border flex items-center justify-center shrink-0 transition-colors ${
            isActive ? "border-white hover:bg-[#CC0000] hover:border-[#CC0000]" : "border-black hover:bg-[#CC0000] hover:text-white hover:border-[#CC0000]"
          }`}
        >
          {isActive ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <h4 className="font-headline text-lg font-bold flex-1 truncate">{title}</h4>
      </div>

      <div onClick={handleSeek} className="h-8 flex items-end gap-[2px] cursor-pointer">
        {Array.from({ length: 40 }).map((_, i) => {
          const barProgress = (i / 40) * 100;
          const filled = barProgress <= progress;
          const h = 20 + ((i * 37) % 60);
          return (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className={`flex-1 transition-colors duration-150 ${
                filled ? (isActive ? "bg-[#CC0000]" : "bg-black") : isActive ? "bg-white/15" : "bg-black/10"
              } ${isActive && filled ? "animate-pulse" : ""}`}
            />
          );
        })}
      </div>
    </div>
  );
}
