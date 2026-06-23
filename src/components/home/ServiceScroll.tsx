"use client";

import Link from "next/link";
import Image from "next/image";
import type { Service } from "@/types";
import { getCategoryIconConfig } from "@/lib/utils/categoryIcons";
import { getServiceImageUrl } from "@/lib/utils/serviceImage";
import { poleToPath, type PoleType } from "@/lib/utils/filters";
import { cn } from "@/lib/utils";

export function ServiceScroll({
  pole,
  isLoading,
  services,
}: {
  pole: PoleType;
  isLoading: boolean;
  services?: Service[];
}) {
  const basePath = poleToPath(pole);

  if (isLoading) {
    return (
      <div className="flex gap-5 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex w-28 shrink-0 flex-col items-center gap-2.5">
            <div className="h-20 w-20 animate-pulse rounded-2xl bg-neutral-100" />
            <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
          </div>
        ))}
      </div>
    );
  }

  if (!services?.length) {
    return (
      <p className="text-sm text-neutral-400">
        Aucun service disponible pour le moment.
      </p>
    );
  }

  return (
    <div className="flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {services.slice(0, 12).map((service) => {
        const imageUrl = getServiceImageUrl(service.imageservice);
        const { icon: Icon, color, bg } = getCategoryIconConfig(
          service.nomservice,
        );

        return (
          <Link
            key={service._id}
            href={`${basePath}?service=${encodeURIComponent(service._id)}&serviceName=${encodeURIComponent(service.nomservice)}`}
            className="group flex w-[6.25rem] shrink-0 flex-col items-center gap-2.5 sm:w-28"
          >
            <div
              className={cn(
                "relative h-20 w-20 overflow-hidden rounded-2xl border border-neutral-200/80 shadow-sm transition-all duration-200",
                "group-hover:-translate-y-0.5 group-hover:border-primary-300 group-hover:shadow-md",
                !imageUrl && bg,
              )}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Icon className={cn("h-8 w-8", color)} strokeWidth={1.75} />
                </div>
              )}
            </div>
            <span className="line-clamp-2 text-center text-xs font-medium leading-tight text-neutral-700 group-hover:text-primary-600">
              {service.nomservice}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
