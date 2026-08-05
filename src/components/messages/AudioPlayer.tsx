"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  src: string;
  isMe?: boolean;
  durationHint?: number;
}

export function AudioPlayer({ src, isMe, durationHint }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(durationHint ?? 0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrent(audio.currentTime);
    const onDurationChange = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onEnded = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
    };
  }, [src]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = Number(e.target.value);
    audio.currentTime = t;
    setCurrent(t);
  };

  const formatT = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-2 py-1" style={{ minWidth: 180 }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        type="button"
        onClick={toggle}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isMe
            ? "bg-white/20 text-white hover:bg-white/30"
            : "bg-primary-100 text-primary-700 hover:bg-primary-200",
        )}
        aria-label={playing ? "Pause" : "Lecture"}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>

      <div className="flex flex-1 flex-col gap-0.5">
        <input
          type="range"
          min={0}
          max={duration || 1}
          step={0.1}
          value={current}
          onChange={handleSeek}
          className="h-1 w-full cursor-pointer accent-current"
          aria-label="Progression audio"
          style={
            {
              background: isMe
                ? `linear-gradient(to right, rgba(255,255,255,0.9) ${progress}%, rgba(255,255,255,0.3) ${progress}%)`
                : `linear-gradient(to right, #22c55e ${progress}%, #d1fae5 ${progress}%)`,
            } as React.CSSProperties
          }
        />
        <span
          className={cn(
            "text-right text-[10px]",
            isMe ? "text-white/60" : "text-neutral-400",
          )}
        >
          {formatT(current)} / {formatT(duration)}
        </span>
      </div>
    </div>
  );
}
