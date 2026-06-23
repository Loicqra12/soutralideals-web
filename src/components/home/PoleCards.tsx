import Link from "next/link";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import {
  IllEmarche,
  IllFreelances,
  IllPrestataires,
} from "./PoleIllustrations";

type PoleCard = {
  href: string;
  title: string;
  description: string;
  Illustration: ComponentType<{ className?: string }>;
};

const POLE_CARDS: PoleCard[] = [
  {
    href: "/prestataires",
    title: "Prestataires & métiers",
    description:
      "Plombiers, coiffeurs, techniciens — un pro près de chez vous.",
    Illustration: IllPrestataires,
  },
  {
    href: "/freelance",
    title: "Freelances & missions",
    description:
      "Développeurs, designers, consultants — missions qualifiées.",
    Illustration: IllFreelances,
  },
  {
    href: "/emarche",
    title: "E-marché local",
    description:
      "Boutiques, artisans, produits du quotidien en ligne.",
    Illustration: IllEmarche,
  },
];

export function PoleCards({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-3", className)}>
      {POLE_CARDS.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="group relative flex h-full min-h-[156px] w-full flex-col overflow-hidden rounded-[20px] bg-[#f5f5f5] p-5 transition-colors duration-200 hover:bg-[#ececec] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/15 focus-visible:ring-offset-2 sm:min-h-[168px] sm:p-6 md:min-h-[176px] lg:min-h-[184px]"
        >
          <h3 className="max-w-[62%] text-[1.0625rem] font-bold leading-[1.25] tracking-[-0.02em] text-[#111] sm:max-w-[65%] sm:text-lg lg:text-[1.125rem]">
            {card.title}{" "}
            <span
              className="inline-block font-normal transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            >
              →
            </span>
          </h3>
          <p className="mt-2 max-w-[58%] text-[13px] leading-[1.45] text-[#8e8e8e] sm:mt-2.5 sm:text-sm sm:leading-[1.5]">
            {card.description}
          </p>

          <div
            className="pointer-events-none absolute bottom-0 right-0 flex h-[54%] w-[52%] max-h-[150px] min-h-[100px] min-w-[120px] max-w-[180px] select-none items-end justify-end transition-transform duration-300 ease-out group-hover:scale-[1.03] sm:max-h-[162px] sm:max-w-[196px] lg:max-h-[172px] lg:max-w-[210px]"
            aria-hidden
          >
            <card.Illustration className="h-full w-full" />
          </div>
        </Link>
      ))}
    </div>
  );
}
