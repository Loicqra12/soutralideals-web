"use client";

import { useId } from "react";

type IllProps = { className?: string };

const DropShadow = ({ id }: { id: string }) => (
  <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow
      dx="0"
      dy="4"
      stdDeviation="6"
      floodColor="#0f172a"
      floodOpacity="0.12"
    />
  </filter>
);

export function IllPrestataires({ className }: IllProps) {
  const uid = useId().replace(/:/g, "");
  const sh = `${uid}-sh`;
  const g1 = `${uid}-g1`;
  const g1b = `${uid}-g1b`;

  return (
    <svg viewBox="0 0 148 128" fill="none" className={className} aria-hidden>
      <defs>
        <DropShadow id={sh} />
        <linearGradient id={g1} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id={g1b} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
      <ellipse cx="74" cy="118" rx="52" ry="7" fill="#0f172a" opacity="0.07" />
      <g filter={`url(#${sh})`}>
        <rect x="18" y="52" width="56" height="44" rx="10" fill={`url(#${g1b})`} />
        <path d="M38 62h16v8H38zm0 14h24v6H38z" fill="#94a3b8" opacity="0.5" />
        <path
          d="M88 28c0-14 18-14 18 0 0 10-9 22-9 22s-9-12-9-22z"
          fill={`url(#${g1})`}
        />
        <circle cx="97" cy="28" r="5" fill="#ecfdf5" />
      </g>
    </svg>
  );
}

export function IllFreelances({ className }: IllProps) {
  const uid = useId().replace(/:/g, "");
  const sh = `${uid}-sh`;
  const b1 = `${uid}-b1`;

  return (
    <svg viewBox="0 0 148 128" fill="none" className={className} aria-hidden>
      <defs>
        <DropShadow id={sh} />
        <linearGradient id={b1} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <ellipse cx="74" cy="118" rx="52" ry="7" fill="#0f172a" opacity="0.07" />
      <g filter={`url(#${sh})`}>
        <rect x="22" y="38" width="88" height="58" rx="10" fill="#1e293b" />
        <rect x="28" y="46" width="76" height="42" rx="6" fill="#0f172a" />
        <rect x="34" y="54" width="40" height="4" rx="2" fill="#3b82f6" />
        <rect x="34" y="64" width="56" height="3" rx="1.5" fill="#334155" />
        <rect x="34" y="72" width="48" height="3" rx="1.5" fill="#334155" />
        <rect x="78" y="88" width="36" height="14" rx="7" fill={`url(#${b1})`} />
      </g>
    </svg>
  );
}

export function IllEmarche({ className }: IllProps) {
  const uid = useId().replace(/:/g, "");
  const sh = `${uid}-sh`;
  const gold = `${uid}-gold`;

  return (
    <svg viewBox="0 0 148 128" fill="none" className={className} aria-hidden>
      <defs>
        <DropShadow id={sh} />
        <linearGradient id={gold} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
      </defs>
      <ellipse cx="74" cy="118" rx="52" ry="7" fill="#0f172a" opacity="0.07" />
      <g filter={`url(#${sh})`}>
        <rect
          x="70"
          y="58"
          width="48"
          height="40"
          rx="8"
          fill="#fef3c7"
          stroke="#fbbf24"
          strokeWidth="2"
        />
        <path d="M42 48h44l-8 52H34L42 48z" fill={`url(#${gold})`} />
        <path
          d="M50 48l4 12h28l4-12"
          stroke="#fef9c3"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="98" cy="72" r="14" fill="#f59e0b" />
        <path
          d="M92 72h12M98 66v12"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
