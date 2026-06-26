"use client";

import { Star } from "lucide-react";

const STAR_FILL = "#E8A317";

const REVIEWS_URL =
  process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL?.trim() || null;

const RATING = process.env.NEXT_PUBLIC_GOOGLE_RATING?.trim();
const REVIEW_COUNT = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_COUNT?.trim();

function StarsRow({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const rem = rating % 1;
  const hasHalf = rem >= 0.25 && rem < 0.75;
  const rest = hasHalf ? 5 - full - 1 : 5 - full;

  return (
    <div className="flex items-center gap-0.5" aria-hidden style={{ color: STAR_FILL }}>
      {Array.from({ length: full }, (_, i) => (
        <Star
          key={`f-${i}`}
          className="h-[1.125rem] w-[1.125rem] shrink-0 fill-current stroke-none"
          strokeWidth={0}
        />
      ))}
      {hasHalf ? (
        <span className="relative inline-flex h-[1.125rem] w-[1.125rem] shrink-0">
          <Star
            className="h-[1.125rem] w-[1.125rem] shrink-0 fill-white/20 stroke-none"
            strokeWidth={0}
          />
          <span className="absolute left-0 top-0 h-[1.125rem] w-1/2 overflow-hidden text-[#E8A317]">
            <Star
              className="h-[1.125rem] w-[1.125rem] shrink-0 fill-current stroke-none"
              strokeWidth={0}
            />
          </span>
        </span>
      ) : null}
      {Array.from({ length: rest }, (_, i) => (
        <Star
          key={`e-${i}`}
          className="h-[1.125rem] w-[1.125rem] shrink-0 fill-white/20 stroke-none"
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

export function FooterGoogleReviews() {
  if (!REVIEWS_URL) return null;

  const ratingNum = RATING ? Number.parseFloat(RATING) : NaN;
  const hasRating = Number.isFinite(ratingNum) && ratingNum > 0;
  const countNum = REVIEW_COUNT ? Number.parseInt(REVIEW_COUNT, 10) : NaN;
  const hasCount = Number.isFinite(countNum) && countNum > 0;

  return (
    <aside
      className="mt-6 max-w-[18.5rem] rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/15 via-[#0b1020] to-[#0a0f1c] p-6 shadow-xl shadow-black/20"
      aria-label="Synthèse des avis Google"
    >
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400/80">
        Avis Google
      </p>

      {hasRating ? (
        <>
          <div className="mt-3">
            <StarsRow rating={ratingNum} />
          </div>
          <p className="mt-3 text-sm font-bold leading-tight text-white">
            Note {ratingNum.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}{" "}
            / 5
            {hasCount ? ` (${countNum} avis)` : ""}
          </p>
        </>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          Découvrez les avis de la communauté Soutrali sur Google.
        </p>
      )}

      <a
        href={REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#0a0a0a] transition hover:bg-white/90"
      >
        {hasRating ? "Laisser un avis" : "Voir nos avis Google"}
      </a>
    </aside>
  );
}
