"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Service } from "@/types";
import { getCategoryIconConfig } from "@/lib/utils/categoryIcons";
import { getServiceImageUrl } from "@/lib/utils/serviceImage";
import { poleToPath, type PoleType } from "@/lib/utils/filters";
import { cn } from "@/lib/utils";

const DEFAULT_LIMIT = 8;

function ServiceItem({
  service,
  basePath,
  className,
}: {
  service: Service;
  basePath: string;
  className?: string;
}) {
  const imageUrl = getServiceImageUrl(service.imageservice);
  const { icon: Icon, color, bg } = getCategoryIconConfig(service.nomservice);

  return (
    <Link
      href={`${basePath}?service=${encodeURIComponent(service._id)}&serviceName=${encodeURIComponent(service.nomservice)}`}
      className={cn(
        "group flex w-[6.25rem] shrink-0 flex-col items-center gap-2.5 sm:w-28",
        className,
      )}
    >
      <div
        className={cn(
          "relative h-20 w-20 overflow-hidden rounded-2xl border border-neutral-200/80 shadow-sm transition-all duration-200",
          "group-hover:-translate-y-0.5 group-hover:border-primary-300 group-hover:shadow-md",
          !imageUrl && bg,
        )}
      >
        {imageUrl ? (
          <Image src={imageUrl} alt="" fill sizes="80px" className="object-cover" />
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
}

export function ServiceScroll({
  pole,
  isLoading,
  services,
  initialLimit = DEFAULT_LIMIT,
}: {
  pole: PoleType;
  isLoading: boolean;
  services?: Service[];
  initialLimit?: number;
}) {
  const basePath = poleToPath(pole);
  const [expanded, setExpanded] = useState(false);

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

  const hasMore = services.length > initialLimit;
  const visible = expanded ? services : services.slice(0, initialLimit);
  const hiddenCount = services.length - initialLimit;

  return (
    <div>
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-wrap gap-x-5 gap-y-6"
          >
            {visible.map((service) => (
              <ServiceItem key={service._id} service={service} basePath={basePath} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {visible.map((service) => (
              <ServiceItem key={service._id} service={service} basePath={basePath} />
            ))}
            {hasMore && (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                aria-label={`Voir ${hiddenCount} services supplémentaires`}
                className="group flex w-[6.25rem] shrink-0 flex-col items-center gap-2.5 sm:w-28"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 transition-all duration-200 group-hover:border-primary-400 group-hover:bg-primary-50">
                  <ChevronDown className="h-6 w-6 text-neutral-400 transition-colors group-hover:text-primary-600" />
                </div>
                <span className="text-center text-xs font-medium text-neutral-600 group-hover:text-primary-600">
                  Voir plus
                  <span className="mt-0.5 block text-[10px] font-normal text-neutral-400">
                    +{hiddenCount}
                  </span>
                </span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!expanded && hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 sm:w-auto sm:px-6"
        >
          <ChevronDown className="h-4 w-4" />
          Voir tous les services
          <span className="rounded-full bg-neutral-200/80 px-2 py-0.5 text-xs font-semibold text-neutral-500">
            +{hiddenCount}
          </span>
        </button>
      )}

      {expanded && hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
        >
          <ChevronUp className="h-4 w-4" />
          Voir moins
        </button>
      )}
    </div>
  );
}
