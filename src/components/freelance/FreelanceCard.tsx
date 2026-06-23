"use client";

import Link from "next/link";
import { Star, MapPin, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Freelance } from "@/types";
import {
  getCategoryLabel,
  getServiceLabel,
  getUtilisateurDisplayName,
} from "@/lib/utils/listingDisplay";
import { resolveMediaUrl } from "@/lib/utils/mediaUrl";
import { cardHover, imageZoom, fadeInUp } from "@/lib/animations";
import { FavoriteButton } from "@/components/shared/FavoriteButton";

function getFreelanceName(freelance: Freelance): string {
  if (freelance.name) return freelance.name;
  return getUtilisateurDisplayName(
    freelance.nom,
    freelance.prenom,
    freelance.utilisateur,
    "Freelance",
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function FreelanceCard({ freelance }: { freelance: Freelance }) {
  const name = getFreelanceName(freelance);
  const subtitle =
    freelance.job ??
    getServiceLabel(freelance.service) ??
    freelance.category ??
    freelance.categorie ??
    getCategoryLabel(freelance.categorie, freelance.service);
  const note = freelance.rating ?? freelance.note;
  const ville = freelance.location ?? freelance.ville;
  const tarif = freelance.hourlyRate ?? freelance.tarif;
  const photo = resolveMediaUrl(freelance.imagePath ?? freelance.photoProfil);
  const coverUrl = photo;

  return (
    <motion.div variants={fadeInUp}>
      <Link href={`/freelance/${freelance._id}`} className="block group">
        <motion.article
          initial="rest"
          whileHover="hover"
          animate="rest"
          variants={cardHover}
          className="overflow-hidden rounded-2xl border border-neutral-100 bg-white"
        >
          {/* Cover */}
          <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-primary-50">
            {coverUrl && (
              <motion.div variants={imageZoom} className="absolute inset-0">
                <Image
                  src={coverUrl}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </motion.div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {freelance.verifier && (
              <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur-sm">
                <BadgeCheck className="h-3.5 w-3.5" />
                Vérifié
              </div>
            )}
            <FavoriteButton
              objetType="FREELANCE"
              objetId={freelance._id}
              titre={name}
              prix={tarif}
              className="absolute right-3 top-3"
              size="sm"
            />

            {tarif != null && tarif > 0 && (
              <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-neutral-900 shadow-sm backdrop-blur-sm">
                {new Intl.NumberFormat("fr-FR").format(tarif)} FCFA/h
              </div>
            )}

            {freelance.availabilityStatus && (
              <div
                className={cn(
                  "absolute bottom-3 right-3 h-2.5 w-2.5 rounded-full border-2 border-white shadow",
                  freelance.availabilityStatus === "Disponible"
                    ? "bg-emerald-500"
                    : "bg-amber-400",
                )}
              />
            )}
          </div>

          {/* Body */}
          <div className="flex gap-3 p-4">
            <div className="relative shrink-0">
              <div
                className={cn(
                  "h-11 w-11 overflow-hidden rounded-full border-2 border-white shadow-md",
                  photo
                    ? "bg-neutral-100"
                    : "flex items-center justify-center bg-blue-600 text-sm font-bold text-white",
                )}
              >
                {photo ? (
                  <Image
                    src={photo}
                    alt={name}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(name)
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-neutral-900">
                {name}
              </h3>
              {subtitle && (
                <p className="truncate text-xs text-neutral-500">{subtitle}</p>
              )}
              <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
                {note != null && note > 0 && (
                  <span className="flex items-center gap-0.5 text-xs font-medium text-neutral-700">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {note.toFixed(1)}
                    {freelance.completedJobs != null &&
                      freelance.completedJobs > 0 && (
                        <span className="text-neutral-400">
                          ({freelance.completedJobs})
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
              </div>
            </div>
          </div>

          {/* Skills */}
          {freelance.skills && freelance.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-t border-neutral-50 px-4 pb-4">
              {freelance.skills.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] text-blue-600"
                >
                  {s}
                </span>
              ))}
              {freelance.skills.length > 3 && (
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-500">
                  +{freelance.skills.length - 3}
                </span>
              )}
            </div>
          )}
        </motion.article>
      </Link>
    </motion.div>
  );
}
