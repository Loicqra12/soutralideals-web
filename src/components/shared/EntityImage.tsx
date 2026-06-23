"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/lib/utils/mediaUrl";

export function EntityImage({
  src,
  alt,
  className,
  fallbackClassName,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}) {
  const url = resolveMediaUrl(src);

  if (!url) {
    return (
      <div
        className={cn(
          "bg-gradient-to-br from-primary-100 to-primary-50",
          fallbackClassName ?? className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image src={url} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
    </div>
  );
}
