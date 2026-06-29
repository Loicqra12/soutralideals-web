"use client";

import Link from "next/link";
import { Star, MapPin, BadgeCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BLUR_DEFAULT } from "@/lib/utils/imageBlur";
import type { Prestataire } from "@/types";
import {
  getCategoryLabel,
  getServiceLabel,
  getUtilisateurDisplayName,
  getUtilisateurPhoto,
} from "@/lib/utils/listingDisplay";
import { resolveMediaUrl } from "@/lib/utils/mediaUrl";
import { cardHover, imageZoom, fadeInUp } from "@/lib/animations";
import { formatDistance } from "@/lib/utils/haversine";
import { FavoriteButton } from "@/components/shared/FavoriteButton";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function PrestataireCard({
  prestataire,
  distanceKm,
}: {
  prestataire: Prestataire;
  distanceKm?: number;
}) {
  const name = getUtilisateurDisplayName(
    prestataire.nom,
    prestataire.prenom,
    prestataire.utilisateur,
  );
  const serviceLabel =
    getServiceLabel(prestataire.service) ??
    getCategoryLabel(prestataire.categorie, prestataire.service) ??
    prestataire.specialite?.[0];
  const ville = prestataire.ville ?? prestataire.localisation;
  const photo = resolveMediaUrl(
    prestataire.selfie ??
      getUtilisateurPhoto(prestataire.photoProfil, prestataire.utilisateur),
  );
  const coverUrl = photo;

  return (
    <motion.div variants={fadeInUp}>
      <Link href={`/prestataires/${prestataire._id}`} className="block group">
        <motion.article
          initial="rest"
          whileHover="hover"
          animate="rest"
          variants={cardHover}
          className="overflow-hidden rounded-2xl border border-neutral-100 bg-white"
        >
          {/* Cover image / gradient */}
          <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary-100 via-primary-50 to-emerald-50">
            {coverUrl && (
              <motion.div variants={imageZoom} className="absolute inset-0">
                <Image
                  src={coverUrl}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={BLUR_DEFAULT}
                />
              </motion.div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {/* Verified pill */}
            {prestataire.verifier && (
              <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-primary-700 shadow-sm backdrop-blur-sm">
                <BadgeCheck className="h-3.5 w-3.5" />
                Vérifié
              </div>
            )}
            {/* Favorite button */}
            <FavoriteButton
              objetType="PRESTATAIRE"
              objetId={prestataire._id}
              titre={name}
              className="absolute right-3 top-3"
              size="sm"
            />
            {/* Tarif pill */}
            {prestataire.prixprestataire != null &&
              prestataire.prixprestataire > 0 && (
                <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-neutral-900 shadow-sm backdrop-blur-sm">
                  À partir de{" "}
                  {new Intl.NumberFormat("fr-FR").format(
                    prestataire.prixprestataire,
                  )}{" "}
                  FCFA
                </div>
              )}
          </div>

          {/* Body */}
          <div className="flex gap-3 p-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className={cn(
                  "h-11 w-11 overflow-hidden rounded-full border-2 border-white shadow-md",
                  photo
                    ? "bg-neutral-100"
                    : "flex items-center justify-center bg-primary-600 text-sm font-bold text-white",
                )}
              >
                {photo ? (
                  <Image
                    src={photo}
                    alt={name}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                    placeholder="blur"
                    blurDataURL={BLUR_DEFAULT}
                  />
                ) : (
                  getInitials(name)
                )}
              </div>
              {prestataire.verifier && (
                <BadgeCheck className="absolute -bottom-0.5 -right-0.5 h-4 w-4 text-primary-500" />
              )}
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-neutral-900">
                {name}
              </h3>
              {serviceLabel && (
                <p className="truncate text-xs text-neutral-500">
                  {serviceLabel}
                </p>
              )}
              <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
                {prestataire.note != null && prestataire.note > 0 && (
                  <span className="flex items-center gap-0.5 text-xs font-medium text-neutral-700">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {prestataire.note.toFixed(1)}
                    {prestataire.nbAvis != null && prestataire.nbAvis > 0 && (
                      <span className="text-neutral-400">
                        ({prestataire.nbAvis})
                      </span>
                    )}
                  </span>
                )}
                {ville && (
                  <span className="flex items-center gap-0.5 text-xs text-neutral-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {ville}
                  </span>
                )}
                {prestataire.anneeExperience && (
                  <span className="flex items-center gap-0.5 text-xs text-neutral-500">
                    <Clock className="h-3.5 w-3.5" />
                    {prestataire.anneeExperience}
                  </span>
                )}
                {distanceKm != null && (
                  <span className="flex items-center gap-0.5 rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-semibold text-primary-700">
                    📍 {formatDistance(distanceKm)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Specialités */}
          {prestataire.specialite && prestataire.specialite.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-t border-neutral-50 px-4 pb-4">
              {prestataire.specialite.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600"
                >
                  {s}
                </span>
              ))}
              {prestataire.specialite.length > 3 && (
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-500">
                  +{prestataire.specialite.length - 3}
                </span>
              )}
            </div>
          )}
        </motion.article>
      </Link>
    </motion.div>
  );
}
