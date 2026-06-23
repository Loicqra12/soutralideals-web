"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/lib/utils/mediaUrl";
import { BLUR_DEFAULT } from "@/lib/utils/imageBlur";

interface EntityImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  sizes?: string;
  priority?: boolean;
}

export function EntityImage({
  src,
  alt,
  className,
  fallbackClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: EntityImageProps) {
  const url = resolveMediaUrl(src);
  const [error, setError] = useState(false);

  if (!url || error) {
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
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-opacity duration-300"
        placeholder="blur"
        blurDataURL={BLUR_DEFAULT}
        priority={priority}
        onError={() => setError(true)}
      />
    </div>
  );
}
