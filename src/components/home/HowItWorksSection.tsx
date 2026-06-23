"use client";

import type { LucideIcon } from "lucide-react";
import {
  Bell,
  ClipboardList,
  CreditCard,
  TrendingUp,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Step = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

const CLIENT_STEPS: Step[] = [
  {
    number: "01",
    title: "Décrivez votre besoin",
    description:
      "Recherchez un métier, un freelance ou un produit. Filtrez par catégorie, ville ou note.",
    icon: ClipboardList,
    iconBg: "bg-primary-100",
    iconColor: "text-primary-600",
  },
  {
    number: "02",
    title: "Comparez et choisissez",
    description:
      "Consultez les profils vérifiés, les avis clients et contactez le bon prestataire près de chez vous.",
    icon: UserCheck,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    number: "03",
    title: "Payez en confiance",
    description:
      "Réglez en espèces, mobile money ou via SoutraPay. Évaluez la prestation une fois le travail terminé.",
    icon: CreditCard,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

const PROVIDER_STEPS: Step[] = [
  {
    number: "01",
    title: "Créez votre profil",
    description:
      "Inscrivez-vous en tant que prestataire, freelance ou vendeur. Ajoutez vos services et votre zone.",
    icon: UserPlus,
    iconBg: "bg-primary-100",
    iconColor: "text-primary-600",
  },
  {
    number: "02",
    title: "Recevez des demandes",
    description:
      "Soyez visible dans les recherches et les catégories. Les clients vous contactent directement.",
    icon: Bell,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    number: "03",
    title: "Développez votre activité",
    description:
      "Accumulez des avis positifs, gagnez en visibilité et fidélisez votre clientèle sur Soutrali.",
    icon: TrendingUp,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

function StepsGrid({ steps }: { steps: Step[] }) {
  return (
    <div className="grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-10">
      {steps.map((step, index) => (
        <div key={step.title} className="relative">
          {index < steps.length - 1 && (
            <div
              className="absolute left-[calc(50%+2.5rem)] top-8 hidden h-px w-[calc(100%-5rem)] bg-neutral-200 md:block"
              aria-hidden
            />
          )}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="relative mb-5">
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl",
                  step.iconBg,
                )}
              >
                <step.icon className={cn("h-7 w-7", step.iconColor)} />
              </div>
              <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                {step.number}
              </span>
            </div>
            <h3 className="text-lg font-bold text-neutral-900">{step.title}</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-600">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section
      className="bg-[#ebf0f5] py-14 md:py-20"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <Tabs defaultValue="client">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <h2
                id="how-it-works-heading"
                className="text-2xl font-bold text-neutral-900 sm:text-3xl"
              >
                Comment ça marche ?
              </h2>
              <p className="mt-3 text-neutral-600">
                Que vous cherchiez un pro ou que vous proposiez vos services,
                Soutrali Deals simplifie chaque étape.
              </p>
            </div>

            <TabsList className="h-auto w-full shrink-0 rounded-full p-1 sm:w-auto">
              <TabsTrigger
                value="client"
                className="flex-1 rounded-full px-4 py-2.5 text-sm sm:flex-none sm:px-5"
              >
                Je cherche un service
              </TabsTrigger>
              <TabsTrigger
                value="provider"
                className="flex-1 rounded-full px-4 py-2.5 text-sm sm:flex-none sm:px-5"
              >
                Je propose mes services
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="client" className="mt-10 md:mt-12">
            <StepsGrid steps={CLIENT_STEPS} />
          </TabsContent>
          <TabsContent value="provider" className="mt-10 md:mt-12">
            <StepsGrid steps={PROVIDER_STEPS} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
