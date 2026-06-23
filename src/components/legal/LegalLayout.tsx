import type { ReactNode } from "react";
import Link from "next/link";

export interface LegalSection {
  id: string;
  number: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  version: string;
  effectiveDate: string;
  sections: LegalSection[];
  children: ReactNode;
}

export function LegalLayout({
  title,
  subtitle,
  version,
  effectiveDate,
  sections,
  children,
}: LegalLayoutProps) {
  return (
    <>
      <div className="border-b border-neutral-800 bg-neutral-950 pt-8 pb-12">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-primary-600/50 to-transparent" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-primary-400/80">
              Soutrali Deals · Document Officiel
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-primary-600/50 to-transparent" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-400">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-6 border-t border-neutral-800 pt-6 text-[11px] tracking-wide text-neutral-500">
            <span>
              <span className="text-neutral-400">Version</span> — {version}
            </span>
            <span>
              <span className="text-neutral-400">Date d&apos;entrée en vigueur</span>{" "}
              — {effectiveDate}
            </span>
            <span>
              <span className="text-neutral-400">Droit applicable</span> — Côte
              d&apos;Ivoire / RGPD
            </span>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-neutral-950">
        <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
          <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-16 xl:gap-20">
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-1">
                <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.4em] text-neutral-600">
                  Sommaire
                </p>
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="group flex items-start gap-3 rounded-md px-2 py-2 text-[12px] text-neutral-500 transition-all hover:bg-white/[0.03] hover:text-neutral-200"
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-[10px] text-primary-500/70 group-hover:text-primary-400">
                      {s.number}
                    </span>
                    <span className="leading-snug">{s.title}</span>
                  </a>
                ))}
                <div className="mt-8 border-t border-neutral-800 pt-6">
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.4em] text-neutral-600">
                    Documents connexes
                  </p>
                  <Link
                    href="/informations-legales"
                    className="block py-1 text-[11px] text-neutral-500 transition-colors hover:text-primary-400"
                  >
                    ↑ Portail légal
                  </Link>
                </div>
              </div>
            </aside>

            <main className="space-y-0 text-[15px] leading-[1.85] text-neutral-400">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

export function LegalArticle({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-32 border-b border-white/[0.06] py-12 last:border-b-0"
    >
      <div className="mb-7 flex items-baseline gap-4">
        <span className="shrink-0 font-mono text-[11px] font-semibold tracking-wider text-primary-500/70">
          {number}
        </span>
        <h2 className="text-xl font-bold leading-tight text-white md:text-2xl">
          {title}
        </h2>
      </div>
      <div className="space-y-5 pl-0 lg:pl-10">{children}</div>
    </section>
  );
}

export function LegalCallout({
  type = "note",
  children,
}: {
  type?: "note" | "warning" | "important";
  children: ReactNode;
}) {
  const styles = {
    note: "border-l-2 border-primary-600/40 bg-primary-950/30 text-neutral-300",
    warning:
      "border-l-2 border-amber-500/50 bg-amber-500/[0.04] text-neutral-300",
    important:
      "border-l-2 border-red-500/40 bg-red-500/[0.04] text-neutral-300",
  };

  return (
    <div
      className={`rounded-r-lg px-5 py-4 text-[13px] leading-relaxed ${styles[type]}`}
    >
      {children}
    </div>
  );
}

export function LegalTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | ReactNode)[][];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
      <table className="w-full border-collapse text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-white/[0.08] bg-white/[0.03]">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.05]">
          {rows.map((row, ri) => (
            <tr key={ri} className="transition-colors hover:bg-white/[0.02]">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-5 py-4 align-top leading-relaxed text-neutral-400"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LegalList({ items }: { items: (string | ReactNode)[] }) {
  return (
    <ul className="space-y-2.5 pl-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary-500/50" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LegalStrong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-neutral-200">{children}</strong>;
}
