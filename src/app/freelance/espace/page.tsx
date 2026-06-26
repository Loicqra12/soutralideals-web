"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Briefcase,
  Clock,
  ExternalLink,
  Star,
  Wallet,
  BarChart3,
  Eye,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProIcon, ProIconBox } from "@/components/prestataire/ProIcon";
import { SimpleBarChart } from "@/components/shared/SimpleBarChart";
import { useMyFreelance } from "@/lib/hooks/useMyFreelance";
import { useAuthStore } from "@/stores";
import { formatPriceFCFA } from "@/lib/utils/format";
import {
  getCategoryLabel,
  getServiceLabel,
  getUtilisateurDisplayName,
} from "@/lib/utils/listingDisplay";
import { getLast6MonthLabels, formatRevenueChart } from "@/lib/utils/dashboardCharts";

export default function FreelanceEspacePage() {
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const { data: profile, isLoading } = useMyFreelance();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="h-64 animate-pulse rounded-xl bg-neutral-200" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-neutral-600">
          Aucun profil freelance trouvé pour ce compte.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/freelance/inscription">Créer mon profil freelance</Link>
        </Button>
      </div>
    );
  }

  const name =
    profile.name ??
    getUtilisateurDisplayName(
      profile.nom,
      profile.prenom,
      profile.utilisateur,
      "Freelance",
    );
  const subtitle =
    profile.job ??
    getServiceLabel(profile.service) ??
    profile.category ??
    getCategoryLabel(profile.categorie, profile.service);
  const tarif = profile.hourlyRate ?? profile.tarif ?? 0;
  const note = profile.rating ?? profile.note;
  const completedJobs = profile.completedJobs ?? 0;

  const profileCompleteness = useMemo(() => {
    let score = 0;
    if (profile.description) score += 25;
    if (profile.skills?.length) score += 25;
    if (profile.imagePath || profile.photoProfil) score += 25;
    if (tarif > 0) score += 25;
    return score;
  }, [profile, tarif]);

  const estimatedRevenue = completedJobs * tarif;
  const monthlyRevenueChart = useMemo(() => {
    const labels = getLast6MonthLabels();
    return labels.map((label, i) => ({
      label,
      value: i === labels.length - 1 && completedJobs > 0 ? estimatedRevenue : 0,
    }));
  }, [completedJobs, estimatedRevenue]);

  const profileViewsEstimate =
    completedJobs * 15 + Math.round((note ?? 0) * 20) + profileCompleteness * 3;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8 lg:py-8">
      <div className="mb-8 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 px-6 py-6 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Espace freelance
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-neutral-900 sm:text-3xl">
            Bonjour{utilisateur?.prenom ? `, ${utilisateur.prenom}` : ""}
          </h1>
          <p className="mt-2 text-neutral-600">{name}</p>
          {subtitle && (
            <p className="text-sm text-neutral-500">{subtitle}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.availabilityStatus && (
              <Badge variant="outline">{profile.availabilityStatus}</Badge>
            )}
            {profile.experienceLevel && (
              <Badge variant="outline">{profile.experienceLevel}</Badge>
            )}
            {profile.verifier && (
              <Badge variant="outline">Profil vérifié</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="border-neutral-200 shadow-sm">
          <CardContent className="flex items-center gap-3 p-5">
            <ProIconBox>
              <ProIcon icon={Wallet} size={18} />
            </ProIconBox>
            <div>
              <p className="text-xs text-neutral-500">Tarif horaire</p>
              <p className="text-lg font-semibold text-neutral-900">
                {tarif > 0 ? `${formatPriceFCFA(tarif)}/h` : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 shadow-sm">
          <CardContent className="flex items-center gap-3 p-5">
            <ProIconBox>
              <ProIcon icon={Star} size={18} />
            </ProIconBox>
            <div>
              <p className="text-xs text-neutral-500">Note</p>
              <p className="text-lg font-semibold text-neutral-900">
                {note != null && note > 0 ? note.toFixed(1) : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 shadow-sm">
          <CardContent className="flex items-center gap-3 p-5">
            <ProIconBox>
              <ProIcon icon={Briefcase} size={18} />
            </ProIconBox>
            <div>
              <p className="text-xs text-neutral-500">Missions réalisées</p>
              <p className="text-lg font-semibold text-neutral-900">
                {completedJobs}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card className="border-neutral-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" />
              Revenus estimés
            </CardTitle>
            <p className="text-sm text-neutral-500">
              Basé sur {completedJobs} mission{completedJobs > 1 ? "s" : ""} × tarif horaire
            </p>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={monthlyRevenueChart}
              valueFormatter={formatRevenueChart}
            />
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="h-4 w-4" />
              Visibilité du profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-neutral-900">
              ~{profileViewsEstimate.toLocaleString("fr-FR")}
            </p>
            <p className="mt-1 text-sm text-neutral-500">vues estimées</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${profileCompleteness}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-neutral-400">
              Profil complété à {profileCompleteness}%
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-neutral-600">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              {formatPriceFCFA(estimatedRevenue)} de revenus estimés au total
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Prochaines étapes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              title: "Complétez votre profil",
              desc: "Photo, description et compétences pour inspirer confiance.",
              href: "/profile",
              cta: "Mon profil",
              icon: Clock,
            },
            {
              title: "Soyez visible sur la marketplace",
              desc: "Votre fiche apparaît dans la liste des freelances.",
              href: `/freelance/${profile._id}`,
              cta: "Voir ma fiche",
              icon: ExternalLink,
            },
            {
              title: "Explorez les opportunités",
              desc: "Découvrez les autres freelances et tendances du marché.",
              href: "/freelance",
              cta: "Marketplace",
              icon: Briefcase,
            },
          ].map((step) => (
            <div
              key={step.title}
              className="flex flex-col gap-3 rounded-lg border border-neutral-100 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <ProIconBox className="h-9 w-9 shrink-0">
                  <ProIcon icon={step.icon} size={16} />
                </ProIconBox>
                <div>
                  <p className="font-medium text-neutral-900">{step.title}</p>
                  <p className="text-sm text-neutral-500">{step.desc}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={step.href}>{step.cta}</Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
