"use client";

import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TrustItem = {
  icon: LucideIcon;
  title: string;
  desc: string;
  ring: string;
  iconColor: string;
  lineDelay: string;
  floatDelay: string;
};

const TRUST_ITEMS: TrustItem[] = [
  {
    icon: ShieldCheck,
    title: "Profils vérifiés",
    desc: "Prestataires et vendeurs contrôlés pour votre tranquillité.",
    ring: "border-primary-400/50 bg-primary-50 shadow-[0_0_24px_rgba(28,191,63,0.15)]",
    iconColor: "text-primary-600",
    lineDelay: "animation-delay-[0.1s]",
    floatDelay: "animation-delay-[0s]",
  },
  {
    icon: CreditCard,
    title: "Paiement sécurisé",
    desc: "Transactions traçables via SoutraPay.",
    ring: "border-blue-400/50 bg-blue-50 shadow-[0_0_24px_rgba(59,130,246,0.12)]",
    iconColor: "text-blue-600",
    lineDelay: "animation-delay-[0.25s]",
    floatDelay: "animation-delay-[0.4s]",
  },
  {
    icon: MapPin,
    title: "100 % local",
    desc: "Artisans, freelances et boutiques ivoiriens près de chez vous.",
    ring: "border-amber-400/50 bg-amber-50 shadow-[0_0_24px_rgba(245,158,11,0.12)]",
    iconColor: "text-amber-600",
    lineDelay: "animation-delay-[0.4s]",
    floatDelay: "animation-delay-[0.8s]",
  },
  {
    icon: Star,
    title: "Avis transparents",
    desc: "Notes et retours clients pour choisir en confiance.",
    ring: "border-purple-400/50 bg-purple-50 shadow-[0_0_24px_rgba(168,85,247,0.12)]",
    iconColor: "text-purple-600",
    lineDelay: "animation-delay-[0.55s]",
    floatDelay: "animation-delay-[1.2s]",
  },
];

function TrustNode({
  item,
  className,
  align = "left",
}: {
  item: TrustItem;
  className?: string;
  align?: "left" | "right";
}) {
  const Icon = item.icon;
  const delays: Record<string, string> = {
    "0s": "0s",
    "0.4s": "0.4s",
    "0.8s": "0.8s",
    "1.2s": "1.2s",
  };
  const floatDelay = delays[item.floatDelay.replace("animation-delay-[", "").replace("]", "")] ?? "0s";

  return (
    <article
      className={cn(
        "group flex max-w-[15rem] flex-col gap-3 transition-transform duration-300 hover:-translate-y-1",
        align === "right" && "items-end text-right",
        className,
      )}
    >
      <div
        className={cn(
          "animate-trust-float flex h-12 w-12 items-center justify-center rounded-full border-2 transition-transform duration-300 group-hover:scale-110",
          item.ring,
        )}
        style={{ animationDelay: floatDelay }}
      >
        <Icon className={cn("h-5 w-5", item.iconColor)} strokeWidth={2} />
      </div>
      <div>
        <h3 className="text-base font-bold text-neutral-900">{item.title}</h3>
        <div className="mt-1.5 h-px w-10 bg-neutral-200 transition-all duration-300 group-hover:w-16 group-hover:bg-primary-400 group-hover:ml-auto" />
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.desc}</p>
      </div>
    </article>
  );
}

function HubCore() {
  return (
    <div className="relative flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44">
      <div className="animate-trust-hub-pulse absolute inset-0 rounded-full bg-gradient-to-br from-primary-400/40 via-blue-400/30 to-purple-400/25 blur-2xl" />
      <div
        className="animate-trust-hub-spin absolute inset-2 rounded-full border border-dashed border-primary-300/30"
        aria-hidden
      />
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/80 bg-white shadow-xl shadow-primary-500/10 sm:h-28 sm:w-28">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-inner sm:h-[4.5rem] sm:w-[4.5rem]">
          <Sparkles className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}

function HubLines() {
  const lines = [
    { x1: "50%", y1: "50%", x2: "18%", y2: "22%", delay: "0.1s" },
    { x1: "50%", y1: "50%", x2: "82%", y2: "22%", delay: "0.25s" },
    { x1: "50%", y1: "50%", x2: "18%", y2: "78%", delay: "0.4s" },
    { x1: "50%", y1: "50%", x2: "82%", y2: "78%", delay: "0.55s" },
  ];

  return (
    <svg
      className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      aria-hidden
    >
      {lines.map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="url(#trust-line-gradient)"
          strokeWidth="1.5"
          className="animate-trust-line opacity-0"
          style={{ animationDelay: line.delay }}
        />
      ))}
      <defs>
        <linearGradient id="trust-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1cbf3f" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.15" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function TrustBand() {
  return (
    <section
      className="relative overflow-hidden border-y border-neutral-100 bg-white py-16 md:py-24"
      aria-labelledby="trust-heading"
    >
      {/* Motif discret */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%23e5e5e5' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto mb-12 max-w-xl text-center md:mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600">
            Confiance & sécurité
          </p>
          <h2
            id="trust-heading"
            className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl"
          >
            Une marketplace pensée pour la Côte d&apos;Ivoire
          </h2>
          <p className="mt-3 text-neutral-600">
            Talents vérifiés, paiements traçables et avis clients — tout converge
            vers une expérience fiable.
          </p>
        </div>

        {/* Mobile & tablette : grille */}
        <div className="grid gap-6 sm:grid-cols-2 lg:hidden">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-neutral-100 bg-white/80 p-5 backdrop-blur-sm"
            >
              <TrustNode item={item} />
            </div>
          ))}
        </div>

        {/* Desktop : hub radial */}
        <div className="relative mx-auto hidden h-[28rem] max-w-5xl lg:block">
          <HubLines />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <HubCore />
          </div>
          <TrustNode
            item={TRUST_ITEMS[0]}
            className="absolute left-0 top-4"
          />
          <TrustNode
            item={TRUST_ITEMS[1]}
            align="right"
            className="absolute right-0 top-4"
          />
          <TrustNode
            item={TRUST_ITEMS[2]}
            className="absolute bottom-4 left-0"
          />
          <TrustNode
            item={TRUST_ITEMS[3]}
            align="right"
            className="absolute bottom-4 right-0"
          />
        </div>
      </div>
    </section>
  );
}
