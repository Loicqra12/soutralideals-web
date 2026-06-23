"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Star, MapPin, Phone, MessageCircle, Clock, Briefcase, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useFreelanceById } from "@/lib/hooks/useFreelanceById";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EntityImage } from "@/components/shared/EntityImage";
import { telHref, whatsappHref } from "@/lib/utils/contact";
import { formatPriceFCFA } from "@/lib/utils/format";
import { fadeInUp, scaleIn } from "@/lib/animations";
import { AvisSection } from "@/components/shared/AvisSection";
import {
  getCategoryLabel,
  getFreelancePhone,
  getServiceLabel,
  getUtilisateurDisplayName,
} from "@/lib/utils/listingDisplay";

function getFreelanceName(freelance: {
  name?: string;
  nom?: string;
  prenom?: string;
  utilisateur?: { nom?: string; prenom?: string } | string;
}) {
  if (freelance.name) return freelance.name;
  return getUtilisateurDisplayName(freelance.nom, freelance.prenom, freelance.utilisateur, "Freelance");
}

export default function FreelanceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: freelance, isLoading, error } = useFreelanceById(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 h-8 w-32 animate-pulse rounded-lg bg-neutral-200" />
        <div className="h-72 animate-pulse rounded-2xl bg-neutral-200" />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="h-8 w-2/3 animate-pulse rounded bg-neutral-200" />
            <div className="h-32 animate-pulse rounded-xl bg-neutral-200" />
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-neutral-200" />
        </div>
      </div>
    );
  }

  if (error || !freelance) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-lg text-neutral-600">Freelance introuvable.</p>
        <Button className="mt-4" asChild>
          <Link href="/freelance">Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  const name = getFreelanceName(freelance);
  const subtitle =
    freelance.job ??
    getServiceLabel(freelance.service) ??
    getCategoryLabel(freelance.categorie, freelance.service);
  const note = freelance.rating ?? freelance.note;
  const ville = freelance.location ?? freelance.ville;
  const tarif = freelance.hourlyRate ?? freelance.tarif;
  const phone = getFreelancePhone(freelance);
  const phoneLink = telHref(phone);
  const waLink = whatsappHref(phone, `Bonjour ${name}, je vous contacte via Soutrali Deals pour discuter de votre profil freelance.`);
  const image = freelance.imagePath ?? freelance.photoProfil;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
          <Link href="/freelance">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Link>
        </Button>

        {/* Hero */}
        <motion.div variants={scaleIn} initial="hidden" animate="visible" className="overflow-hidden rounded-2xl">
          <EntityImage
            src={image}
            alt={name}
            className="aspect-[21/9] w-full rounded-2xl"
            fallbackClassName="aspect-[21/9] w-full rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-primary-50"
          />
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Left */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-8 lg:col-span-2">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-neutral-900">{name}</h1>
                {freelance.verifier && (
                  <BadgeCheck className="h-7 w-7 text-blue-500" />
                )}
              </div>
              {subtitle && (
                <p className="mt-1.5 text-lg text-neutral-600">{subtitle}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-5 text-sm">
                {note != null && note > 0 && (
                  <span className="flex items-center gap-1.5 font-medium text-neutral-800">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {note.toFixed(1)}
                    {freelance.completedJobs != null && freelance.completedJobs > 0 && (
                      <span className="text-neutral-400 font-normal">
                        ({freelance.completedJobs} missions)
                      </span>
                    )}
                  </span>
                )}
                {ville && (
                  <span className="flex items-center gap-1.5 text-neutral-500">
                    <MapPin className="h-4 w-4" /> {ville}
                  </span>
                )}
                {freelance.experienceLevel && (
                  <span className="flex items-center gap-1.5 text-neutral-500">
                    <Clock className="h-4 w-4" /> {freelance.experienceLevel}
                  </span>
                )}
                {freelance.availabilityStatus && (
                  <Badge
                    variant="outline"
                    className={
                      freelance.availabilityStatus === "Disponible"
                        ? "border-emerald-200 text-emerald-700"
                        : ""
                    }
                  >
                    {freelance.availabilityStatus}
                  </Badge>
                )}
              </div>
            </div>

            {freelance.description && (
              <section>
                <h2 className="mb-3 text-lg font-semibold text-neutral-900">À propos</h2>
                <p className="leading-relaxed text-neutral-700">{freelance.description}</p>
              </section>
            )}

            {freelance.skills && freelance.skills.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-semibold text-neutral-900">Compétences</h2>
                <div className="flex flex-wrap gap-2">
                  {freelance.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm text-blue-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <AvisSection objetType="FREELANCE" objetId={freelance._id} />
          </motion.div>

          {/* Right — sticky CTA */}
          <motion.div variants={scaleIn} initial="hidden" animate="visible" className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg shadow-neutral-200/60">
              {tarif != null && tarif > 0 && (
                <div className="border-b border-neutral-100 px-6 py-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Tarif horaire
                  </p>
                  <p className="mt-1 text-2xl font-bold text-neutral-900">
                    {formatPriceFCFA(tarif)}<span className="text-base font-normal text-neutral-500">/h</span>
                  </p>
                </div>
              )}

              <div className="space-y-3 p-6">
                {phoneLink ? (
                  <>
                    <Button className="w-full" size="lg" asChild>
                      <a href={phoneLink}>
                        <Phone className="mr-2 h-4 w-4" />
                        Appeler
                      </a>
                    </Button>
                    {waLink && (
                      <Button
                        className="w-full bg-[#25D366] text-white hover:bg-[#20bd5a]"
                        size="lg"
                        asChild
                      >
                        <a href={waLink} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          WhatsApp
                        </a>
                      </Button>
                    )}
                  </>
                ) : (
                  <Button className="w-full" size="lg" disabled>
                    Téléphone non disponible
                  </Button>
                )}

                {freelance.completedJobs != null && freelance.completedJobs > 0 && (
                  <div className="flex items-center gap-2 pt-2 text-sm text-neutral-500">
                    <Briefcase className="h-4 w-4" />
                    {freelance.completedJobs} mission{freelance.completedJobs > 1 ? "s" : ""} réalisée{freelance.completedJobs > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
