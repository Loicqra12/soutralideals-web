"use client";

import { useRef, useEffect, useState } from "react";
import { Smile } from "lucide-react";
import { cn } from "@/lib/utils";

const EMOJIS = [
  "😀", "😂", "😍", "🥰", "😊", "👍", "🙏", "👋",
  "🔥", "⭐", "✅", "❤️", "💯", "🎉", "👏", "💪",
  "😅", "🤔", "😢", "😡", "🙌", "💬", "📸", "🚀",
  "🇨🇮", "💼", "📋", "⏰", "📍", "💰", "🛒", "✨",
];

export function EmojiPicker({
  onSelect,
  className,
}: {
  onSelect: (emoji: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
        aria-label="Insérer un emoji"
      >
        <Smile className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute bottom-12 left-0 z-50 w-64 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl">
          <div className="grid grid-cols-8 gap-1">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onSelect(emoji);
                  setOpen(false);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-colors hover:bg-neutral-100"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
