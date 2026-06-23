"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { GlobalSearch } from "@/components/home/GlobalSearch";
import { cn } from "@/lib/utils";

const SLIDE_INTERVAL_MS = 4000;
const TYPE_SPEED_MS = 42;

type TextSegment = { text: string; highlight?: boolean };
type TextLine = TextSegment[];

const SLIDES = [
  {
    src: "/hero/hero-1.png",
    alt: "Prestataires de services",
    lines: [
      [
        { text: "Soutrali Deals, votre " },
        { text: "marketplace", highlight: true },
      ],
      [
        { text: "tout-en-un pour vos " },
        { text: "services", highlight: true },
      ],
    ] satisfies TextLine[],
  },
  {
    src: "/hero/hero-2.png",
    alt: "Freelances qualifiés",
    lines: [
      [
        { text: "Trouvez des " },
        { text: "freelances", highlight: true },
      ],
      [
        { text: "qualifiés pour vos " },
        { text: "projets", highlight: true },
      ],
    ] satisfies TextLine[],
  },
  {
    src: "/hero/hero-3.png",
    alt: "E-marché local",
    lines: [
      [
        { text: "Achetez " },
        { text: "local", highlight: true },
        { text: " et soutenez" },
      ],
      [
        { text: "les " },
        { text: "vendeurs ivoiriens", highlight: true },
      ],
    ] satisfies TextLine[],
  },
];

function lineLength(line: TextLine) {
  return line.reduce((sum, seg) => sum + seg.text.length, 0);
}

function slideLength(lines: TextLine[]) {
  return lines.reduce((sum, line) => sum + lineLength(line), 0);
}

function useTypewriterCharCount(totalLength: number, resetKey: number) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= totalLength) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, TYPE_SPEED_MS);
    return () => clearInterval(timer);
  }, [totalLength, resetKey]);

  return count;
}

function consumeLine(line: TextLine, maxChars: number) {
  let remaining = maxChars;
  const nodes: React.ReactNode[] = [];

  line.forEach((seg, segIndex) => {
    if (remaining <= 0) return;
    const take = Math.min(remaining, seg.text.length);
    const partial = seg.text.slice(0, take);
    remaining -= take;

    if (seg.highlight) {
      nodes.push(
        <span
          key={segIndex}
          className="rounded-lg bg-primary-400 px-2 py-0.5 text-neutral-900 box-decoration-clone"
        >
          {partial}
        </span>,
      );
    } else {
      nodes.push(<span key={segIndex}>{partial}</span>);
    }
  });

  return { nodes, consumed: maxChars - remaining };
}

function TypedHeadline({
  lines,
  resetKey,
}: {
  lines: TextLine[];
  resetKey: number;
}) {
  const totalLength = useMemo(() => slideLength(lines), [lines]);
  const charCount = useTypewriterCharCount(totalLength, resetKey);

  let remaining = charCount;

  return (
    <h1 className="min-h-[2.5em] text-[clamp(1.75rem,5vw,3.25rem)] font-extrabold leading-[1.2] tracking-tight text-white sm:min-h-[2.3em]">
      {lines.map((line, lineIndex) => {
        const { nodes, consumed } = consumeLine(line, remaining);
        remaining -= consumed;
        return (
          <span key={lineIndex} className="block">
            {nodes}
          </span>
        );
      })}
      <span
        className="ml-0.5 inline-block w-[3px] animate-pulse bg-white align-middle"
        style={{ height: "0.85em" }}
        aria-hidden
      />
    </h1>
  );
}

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideKey, setSlideKey] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => {
      setSlideKey((k) => k + 1);
      return (c + 1) % SLIDES.length;
    });
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setSlideKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  const slide = SLIDES[current];

  return (
    <section
      className="relative min-h-[72vh] w-full overflow-hidden sm:min-h-[78vh] lg:min-h-[82vh]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {SLIDES.map((s, index) => (
        <div
          key={s.src}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            index === current ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={s.src}
            alt={s.alt}
            fill
            className="object-cover object-center"
            priority={index === 0}
            sizes="100vw"
            quality={90}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />

      <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-center px-5 py-16 sm:min-h-[78vh] sm:px-6 lg:min-h-[82vh] lg:px-8">
        <div className="max-w-4xl">
          <TypedHeadline key={slideKey} lines={slide.lines} resetKey={slideKey} />

          <p className="mt-6 max-w-xl text-base text-white/75 sm:text-lg">
            Artisans, freelances et produits locaux — tout au même endroit en
            Côte d&apos;Ivoire.
          </p>

          <div className="mt-8 w-full max-w-3xl sm:mt-10">
            <GlobalSearch />
          </div>
        </div>

        <div className="absolute bottom-6 left-5 flex items-center gap-2 sm:bottom-8 sm:left-6 lg:left-8">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              className={cn(
                "h-[3px] rounded-full transition-all duration-300",
                index === current
                  ? "w-12 bg-white"
                  : "w-8 bg-white/35 hover:bg-white/55",
              )}
              aria-label={`Image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
