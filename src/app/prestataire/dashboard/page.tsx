"use client";

import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  TrendingUp,
  HelpCircle,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WelcomeHeader } from "@/components/prestataire/WelcomeHeader";
import { ProfileStrengthCard } from "@/components/prestataire/ProfileStrengthCard";
import {
  MissionRow,
  MissionEmptyState,
} from "@/components/prestataire/MissionRow";
import { ProIcon, ProIconBox } from "@/components/prestataire/ProIcon";
import { usePrestataireDashboard } from "@/lib/hooks/usePrestataireDashboard";
import {
  computeProfileStrength,
  formatFcfa,
  STATUT_LABELS,
} from "@/lib/utils/prestataireDashboard";

const ONBOARDING_STEPS = [
  {
    title: "Complétez votre profil",
    desc: "Photo, description et zone d'activité pour inspirer confiance.",
    href: "/profile",
    cta: "Compléter",
  },
  {
    title: "Soyez visible sur la marketplace",
    desc: "Votre fiche apparaît dans la liste des prestataires de votre métier.",
    href: "/prestataires",
    cta: "Voir la vitrine",
  },
  {
    title: "Répondez aux demandes de devis",
    desc: "Les clients vous contactent directement ou via une demande de prestation.",
    href: "/prestataire/missions",
    cta: "Voir mes missions",
  },
];

export default function PrestataireDashboardPage() {
  const {
    profile,
    profileLoading,
    stats,
    missions,
    missionsTotal,
    missionsLoading,
  } = usePrestataireDashboard();

  const strength = computeProfileStrength(profile);

  const enCours =
    stats?.statsParStatut.find((s) => s._id === "EN_COURS")?.count ?? 0;
  const terminees =
    stats?.statsParStatut.find((s) => s._id === "TERMINEE")?.count ?? 0;
  const enAttente =
    stats?.statsParStatut.find((s) => s._id === "EN_ATTENTE")?.count ?? 0;

  if (profileLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
      <div className="space-y-6">
        <WelcomeHeader
          profile={profile}
          missionsTotal={stats?.totalPrestations ?? missionsTotal}
          isVisible={strength.isVisible}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Briefcase}
            label="En attente"
            value={String(enAttente)}
          />
          <StatCard icon={TrendingUp} label="En cours" value={String(enCours)} />
          <StatCard
            icon={CheckCircle2}
            label="Terminées"
            value={String(terminees)}
          />
          <StatCard
            icon={Wallet}
            label="Revenus estimés"
            value={formatFcfa(stats?.revenueTotal ?? 0)}
            small
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-neutral-200 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 pb-4">
                <CardTitle className="text-base font-semibold text-neutral-900">
                  Missions récentes
                </CardTitle>
                {missionsTotal > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-neutral-300"
                  >
                    <Link href="/prestataire/missions">Tout voir</Link>
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {missionsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-16 animate-pulse rounded-lg bg-neutral-100"
                      />
                    ))}
                  </div>
                ) : missions.length === 0 ? (
                  <MissionEmptyState />
                ) : (
                  missions.map((m) => (
                    <MissionRow
                      key={m._id}
                      mission={m}
                      showActions
                      prestataireId={profile?._id}
                    />
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-neutral-200 shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-neutral-900">
                  Premiers pas
                </CardTitle>
                <p className="text-sm text-neutral-500">
                  Suivez ces étapes pour développer votre activité
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {ONBOARDING_STEPS.map((step, i) => (
                  <div
                    key={step.title}
                    className="flex flex-col gap-4 rounded-lg border border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-sm font-semibold text-neutral-900">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-neutral-900">
                          {step.title}
                        </p>
                        <p className="mt-0.5 text-sm text-neutral-500">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="shrink-0 border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800"
                    >
                      <Link href={step.href}>{step.cta}</Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <ProfileStrengthCard
              score={strength.score}
              total={strength.total}
              percent={strength.percent}
              items={strength.items}
              isVisible={strength.isVisible}
            />

            <Card className="border-neutral-200 shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-neutral-900">
                  Répartition
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(stats?.statsParStatut ?? []).length === 0 ? (
                  <p className="text-sm text-neutral-500">
                    Les statistiques apparaîtront dès votre première mission.
                  </p>
                ) : (
                  stats?.statsParStatut.map((s) => (
                    <div
                      key={s._id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-neutral-600">
                        {STATUT_LABELS[s._id] ?? s._id}
                      </span>
                      <span className="font-semibold text-neutral-900">
                        {s.count}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-neutral-200 shadow-none">
              <CardContent className="p-6">
                <ProIconBox className="h-10 w-10">
                  <ProIcon icon={HelpCircle} size={20} />
                </ProIconBox>
                <p className="mt-4 font-semibold text-neutral-900">
                  Besoin d&apos;aide ?
                </p>
                <p className="mt-2 text-sm text-neutral-500">
                  Notre équipe accompagne les prestataires en Côte d&apos;Ivoire.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 border-neutral-300"
                  asChild
                >
                  <Link href="/apropos">En savoir plus</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  small,
}: {
  icon: typeof Briefcase;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <Card className="border-neutral-200 shadow-none">
      <CardContent className="flex items-center gap-4 p-5">
        <ProIconBox className="h-10 w-10">
          <ProIcon icon={Icon} size={18} />
        </ProIconBox>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {label}
          </p>
          <p
            className={`mt-0.5 font-semibold text-neutral-900 ${small ? "text-base" : "text-xl"}`}
          >
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 lg:px-8">
      <div className="h-40 animate-pulse rounded-xl bg-neutral-200" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl bg-neutral-200"
          />
        ))}
      </div>
    </div>
  );
}
