"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star, MapPin, BadgeCheck, Phone, Clock, Calendar, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { usePrestataireById } from "@/lib/hooks/usePrestataireById";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EntityImage } from "@/components/shared/EntityImage";
import { PrestationRequestModal } from "@/components/prestataires/PrestationRequestModal";
import { telHref, whatsappHref } from "@/lib/utils/contact";
import { formatPriceFCFA } from "@/lib/utils/format";
import { fadeInUp, scaleIn } from "@/lib/animations";
import { AvisSection } from "@/components/shared/AvisSection";
import { JsonLd } from "@/components/shared/JsonLd";
import { StartConversationButton } from "@/components/shared/StartConversationButton";
import {
  getCategoryLabel,
  getEntityServiceId,
  getPrestatairePhone,
  getServiceLabel,
  getUtilisateurDisplayName,
  getUtilisateurPhoto,
} from "@/lib/utils/listingDisplay";

export default function PrestataireDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: prestataire, isLoading, error } = usePrestataireById(id);
  const [showDevis, setShowDevis] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 h-8 w-32 animate-pulse rounded-lg bg-neutral-200" />
        <div className="h-72 animate-pulse rounded-2xl bg-neutral-200" />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="h-8 w-2/3 animate-pulse rounded bg-neutral-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200" />
            <div className="h-32 animate-pulse rounded-xl bg-neutral-200" />
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-neutral-200" />
        </div>
      </div>
    );
  }

  if (error || !prestataire) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-lg text-neutral-600">Prestataire introuvable.</p>
        <Button className="mt-4" asChild>
          <Link href="/prestataires">Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  const name = getUtilisateurDisplayName(
    prestataire.nom,
    prestataire.prenom,
    prestataire.utilisateur,
  );
  const serviceLabel =
    getServiceLabel(prestataire.service) ??
    getCategoryLabel(prestataire.categorie, prestataire.service);
  const ville = prestataire.ville ?? prestataire.localisation;
  const photo =
    prestataire.selfie ??
    getUtilisateurPhoto(prestataire.photoProfil, prestataire.utilisateur);
  const phone = getPrestatairePhone(prestataire);
  const phoneLink = telHref(phone);
  const waLink = whatsappHref(phone, `Bonjour ${name}, je vous contacte via Soutrali Deals.`);
  const serviceId = getEntityServiceId(prestataire.service);
  const tarif = prestataire.tarifHoraireMin ?? prestataire.prixprestataire;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description: prestataire.description ?? `${serviceLabel ?? "Prestataire"} à ${ville ?? "Côte d'Ivoire"}`,
    ...(photo && { image: photo }),
    ...(ville && { address: { "@type": "PostalAddress", addressLocality: ville, addressCountry: "CI" } }),
    ...(prestataire.note && prestataire.note > 0 && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: prestataire.note, bestRating: 5, reviewCount: prestataire.nbAvis ?? 1 },
    }),
    ...(tarif && { priceRange: `${tarif} FCFA` }),
    url: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/prestataires/${prestataire._id}`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
          <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
            <Link href="/prestataires">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour
            </Link>
          </Button>

          {/* Hero image */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="overflow-hidden rounded-2xl"
          >
            <EntityImage
              src={photo}
              alt={name}
              className="aspect-[21/9] w-full rounded-2xl"
              fallbackClassName="aspect-[21/9] w-full rounded-2xl bg-gradient-to-br from-primary-100 to-emerald-50"
            />
          </motion.div>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Left — info */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="space-y-8 lg:col-span-2"
            >
              {/* Header */}
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-neutral-900">{name}</h1>
                  {prestataire.verifier && (
                    <BadgeCheck className="h-7 w-7 text-primary-500" />
                  )}
                </div>
                {serviceLabel && (
                  <p className="mt-1.5 text-lg text-neutral-600">{serviceLabel}</p>
                )}

                {/* Meta row */}
                <div className="mt-4 flex flex-wrap gap-5 text-sm">
                  {prestataire.note != null && prestataire.note > 0 && (
                    <span className="flex items-center gap-1.5 font-medium text-neutral-800">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {prestataire.note.toFixed(1)}
                      {prestataire.nbAvis != null && prestataire.nbAvis > 0 && (
                        <span className="text-neutral-400 font-normal">
                          ({prestataire.nbAvis} avis)
                        </span>
                      )}
                    </span>
                  )}
                  {ville && (
                    <span className="flex items-center gap-1.5 text-neutral-500">
                      <MapPin className="h-4 w-4" />
                      {ville}
                    </span>
                  )}
                  {prestataire.anneeExperience && (
                    <span className="flex items-center gap-1.5 text-neutral-500">
                      <Clock className="h-4 w-4" />
                      {prestataire.anneeExperience} d&apos;expérience
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {prestataire.description && (
                <section>
                  <h2 className="mb-3 text-lg font-semibold text-neutral-900">
                    À propos
                  </h2>
                  <p className="leading-relaxed text-neutral-700">
                    {prestataire.description}
                  </p>
                </section>
              )}

              {/* Spécialités */}
              {prestataire.specialite && prestataire.specialite.length > 0 && (
                <section>
                  <h2 className="mb-3 text-lg font-semibold text-neutral-900">
                    Spécialités
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {prestataire.specialite.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-700 shadow-sm"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Zones d'intervention */}
              {prestataire.zoneIntervention && prestataire.zoneIntervention.length > 0 && (
                <section>
                  <h2 className="mb-3 text-lg font-semibold text-neutral-900">
                    Zones d&apos;intervention
                  </h2>
                  <p className="text-neutral-600">
                    {prestataire.zoneIntervention.join(" · ")}
                  </p>
                </section>
              )}

              {/* Avis */}
              <AvisSection objetType="PRESTATAIRE" objetId={prestataire._id} />
            </motion.div>

            {/* Right — sticky CTA card */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg shadow-neutral-200/60">
                {/* Price */}
                {tarif != null && tarif > 0 && (
                  <div className="border-b border-neutral-100 px-6 py-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Tarif
                    </p>
                    <p className="mt-1 text-2xl font-bold text-neutral-900">
                      {prestataire.tarifHoraireMin != null && prestataire.tarifHoraireMax != null
                        ? `${formatPriceFCFA(prestataire.tarifHoraireMin)} – ${formatPriceFCFA(prestataire.tarifHoraireMax)}/h`
                        : `${formatPriceFCFA(tarif)}`}
                    </p>
                  </div>
                )}

                <div className="space-y-3 p-6">
                  {prestataire.verifier && (
                    <div className="flex items-center gap-2 text-sm text-primary-700">
                      <BadgeCheck className="h-4 w-4" />
                      <span className="font-medium">Profil vérifié</span>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setShowDevis(true)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Demander un devis
                  </Button>

                  {phoneLink && (
                    <Button className="w-full" variant="outline" size="lg" asChild>
                      <a href={phoneLink}>
                        <Phone className="mr-2 h-4 w-4" />
                        Appeler
                      </a>
                    </Button>
                  )}

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

                  {/* Message in-app */}
                  <StartConversationButton
                    destinataireUserId={
                      typeof prestataire.utilisateur === "object"
                        ? prestataire.utilisateur?._id
                        : prestataire.utilisateur
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {showDevis && (
        <PrestationRequestModal
          open={showDevis}
          prestataireId={prestataire._id}
          prestataireName={name}
          serviceId={serviceId}
          onClose={() => setShowDevis(false)}
        />
      )}
    </>
  );
}
