"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores";
import {
  PRO_INSCRIPTION_OPTIONS,
  resolveProHref,
} from "@/lib/utils/proCta";

const CARD_STYLES = [
  {
    illustBg: "bg-neutral-100",
    title: ["Devenir", "prestataire"],
    image: "/illustration-group/Group-1.png",
  },
  {
    illustBg: "bg-orange-100",
    title: ["Devenir", "freelance"],
    image: "/illustration-group/Group-2.png",
  },
  {
    illustBg: "bg-amber-100",
    title: ["Ouvrir une", "boutique"],
    image: "/illustration-group/Group-3.png",
  },
];

export function ProviderCTA() {
  const hasRole = useAuthStore((s) => s.hasRole);

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Proposez vos services sur Soutrali
          </h2>
          <p className="mt-3 text-base text-neutral-600 sm:text-lg">
            Que vous soyez artisan, freelance ou vendeur, rejoignez la
            marketplace ivoirienne et développez votre activité.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {PRO_INSCRIPTION_OPTIONS.map((option, index) => {
            const { href, label } = resolveProHref(option, hasRole);
            const style = CARD_STYLES[index];
            const isPro = hasRole(option.role);
            const titleLines = isPro ? [label] : style.title;

            return (
              <Link
                key={option.role}
                href={href}
                className="group flex min-h-[22rem] flex-col rounded-3xl bg-[#0b3d1e] p-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/25 sm:min-h-[24rem] sm:p-6"
              >
                <div>
                  <h3 className="text-[1.65rem] font-bold leading-[1.15] tracking-tight text-white sm:text-[1.85rem]">
                    {titleLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>
                  <p className="mt-2 text-sm text-white/55">
                    {option.description}
                  </p>
                </div>

                <div
                  className={cn(
                    "relative mt-auto aspect-[4/3] w-full overflow-hidden rounded-2xl",
                    style.illustBg,
                  )}
                >
                  <Image
                    src={style.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
