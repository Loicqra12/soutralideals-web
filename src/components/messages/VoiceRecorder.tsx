"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Send, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  onSend: (blob: Blob, durationSeconds: number) => void;
  disabled?: boolean;
}

type RecorderState = "idle" | "recording" | "preview";

export function VoiceRecorder({ onSend, disabled }: VoiceRecorderProps) {
  const [state, setState] = useState<RecorderState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [durationSec, setDurationSec] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const startRecording = useCallback(async () => {
    if (disabled) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setState("preview");
      };

      recorder.start(100);
      setState("recording");
      setSeconds(0);

      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s >= 119) {
            stopRecording();
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      setState("idle");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  const stopRecording = useCallback(() => {
    stopTimer();
    setDurationSec(seconds);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, [seconds]);

  const handleDiscard = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setState("idle");
    setSeconds(0);
    setDurationSec(0);
  };

  const handleSend = () => {
    if (!audioUrl || chunksRef.current.length === 0) return;
    const mimeType = chunksRef.current[0]?.type || "audio/webm";
    const blob = new Blob(chunksRef.current, { type: mimeType });
    onSend(blob, durationSec || seconds);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setState("idle");
    setSeconds(0);
    setDurationSec(0);
  };

  useEffect(() => {
    return () => {
      stopTimer();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (state === "preview" && audioUrl) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
        <audio controls src={audioUrl} className="h-8 max-w-40 sm:max-w-55" />
        <span className="text-xs text-neutral-400 shrink-0">{formatDuration(durationSec)}</span>
        <button
          type="button"
          onClick={handleDiscard}
          className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-400 hover:bg-red-50"
          aria-label="Supprimer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleSend}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white hover:bg-primary-700"
          aria-label="Envoyer le vocal"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (state === "recording") {
    return (
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
          {formatDuration(seconds)}
        </span>
        <button
          type="button"
          onClick={stopRecording}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white shadow"
          aria-label="Arrêter l'enregistrement"
        >
          <MicOff className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={startRecording}
      disabled={disabled}
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
        disabled
          ? "cursor-not-allowed text-neutral-300"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700",
      )}
      aria-label="Enregistrer un message vocal"
    >
      <Mic className="h-5 w-5" />
    </button>
  );
}
