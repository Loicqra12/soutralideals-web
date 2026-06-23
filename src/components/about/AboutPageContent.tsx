import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { ProInscriptionLink } from "@/components/shared/ProInscriptionLink";
import {
  ABOUT_VISION,
  ABOUT_PROBLEM,
  ABOUT_MARKET,
  ABOUT_SOLUTION,
  ABOUT_ROADMAP,
  SOUTRALI_VALUES,
  FOUNDING_TEAM,
  ROADMAP_PHASES,
  ABOUT_IMAGES,
} from "@/lib/content/about";

function EmphasisText({
  text,
  phrases,
}: {
  text: string;
  phrases: readonly string[];
}) {
  if (!phrases.length) return <>{text}</>;
  const pattern = new RegExp(
    `(${phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi",
  );
  const parts = text.split(pattern).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        phrases.some((p) => p.toLowerCase() === part.toLowerCase()) ? (
          <strong key={i} className="font-semibold text-primary-700">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function AboutPageContent() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-neutral-200">
        <div className="absolute inset-0">
          <Image
            src={ABOUT_IMAGES.teamHero}
            alt=""
            fill
            className="object-cover object-center blur-sm scale-105"
            priority
          />
          <div className="absolute inset-0 bg-neutral-950/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary-400">
            Notre histoire
          </span>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Plus qu&apos;une plateforme,
            <br />
            une mission de vie
          </h1>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 border-l-2 border-l-primary-500 bg-black/40 px-4 py-2 text-sm font-semibold text-white">
            <span className="text-lg">2024</span>
            <span className="text-white/70">— Année de création</span>
          </p>
          <div className="mt-12 max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold text-white md:text-3xl">
              Un constat simple
            </h2>
            <p className="mb-4 text-lg leading-relaxed text-neutral-300">
              <strong className="text-white">
                SOUTRALI DEALS est né d&apos;un constat simple :
              </strong>{" "}
              en Côte d&apos;Ivoire, des milliers de talents travaillent chaque
              jour sans visibilité, sans outils digitaux et sans accès à des
              opportunités structurées.
            </p>
            <p className="mb-4 text-lg leading-relaxed text-neutral-300">
              Nous sommes nous-mêmes des prestataires de services — développeurs,
              marketeurs, communicants, gestionnaires — confrontés aux mêmes
              réalités.
            </p>
            <p className="text-lg leading-relaxed text-neutral-300">
              <strong className="text-primary-400">
                C&apos;est de cette expérience qu&apos;est né SOUTRALI DEALS :
              </strong>{" "}
              une plateforme pensée par des prestataires, pour des prestataires.
            </p>
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="border-b border-neutral-200 bg-neutral-950 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary-400">
            Équipe fondatrice et stratégique
          </span>
          <h2 className="max-w-3xl text-3xl font-bold text-white md:text-4xl">
            Une équipe expérimentée pour piloter Soutrali Deals vers le succès
          </h2>
          <p className="mt-5 max-w-3xl text-lg text-neutral-400">
            Expertise technologique, vision stratégique, marketing digital et
            gestion communautaire — chaque membre joue un rôle clé dans le
            développement de la plateforme.
          </p>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FOUNDING_TEAM.map((member) => (
              <article
                key={member.id}
                className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={member.photo}
                    alt={`Portrait de ${member.name}`}
                    fill
                    className="object-cover object-top grayscale transition hover:grayscale-0"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-primary-400">
                    {member.role}
                  </p>
                  {member.description && (
                    <p className="mt-2 text-sm text-neutral-400">
                      {member.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="border-b border-neutral-200 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
              {ABOUT_VISION.eyebrow}
            </span>
            <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">
              {ABOUT_VISION.title}
            </h2>
            <p className="mt-5 text-lg font-semibold text-neutral-700">
              {ABOUT_VISION.subtitle}
            </p>
            <div className="mt-8 space-y-5">
              {ABOUT_VISION.paragraphs.map((p) => (
                <p key={p} className="text-lg leading-relaxed text-neutral-600">
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-lg">
            <Image
              src={ABOUT_IMAGES.vision}
              alt="Vision Soutrali Deals"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Constat & Marché */}
      <section className="border-b border-neutral-200 bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-8">
              <h2 className="text-2xl font-bold text-neutral-900">
                {ABOUT_PROBLEM.title}
              </h2>
              <ul className="mt-6 space-y-4">
                {ABOUT_PROBLEM.points.map((point) => (
                  <li
                    key={point.text}
                    className="text-neutral-600 leading-relaxed"
                  >
                    <EmphasisText text={point.text} phrases={point.emphasis} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-8">
              <h2 className="text-2xl font-bold text-neutral-900">
                {ABOUT_MARKET.title}
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {ABOUT_MARKET.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-xl p-4 ${stat.featured ? "bg-primary-50 border border-primary-100" : "bg-neutral-50"}`}
                  >
                    <p className="text-2xl font-bold text-neutral-900">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-neutral-600">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-neutral-600">
                <EmphasisText
                  text={ABOUT_MARKET.note}
                  phrases={ABOUT_MARKET.noteEmphasis}
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="border-b border-neutral-200 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
              Plateforme
            </span>
            <h2 className="text-3xl font-bold text-neutral-900">
              {ABOUT_SOLUTION.title}
            </h2>
            <p className="mt-5 text-lg text-neutral-600">
              {ABOUT_SOLUTION.description}
            </p>
            <ul className="mt-8 space-y-3">
              {ABOUT_SOLUTION.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-neutral-700">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/prestataires"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-600"
            >
              Explorer la marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative aspect-square">
            <Image
              src={ABOUT_IMAGES.solutionDevices}
              alt="Soutrali Deals web et mobile"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="border-b border-neutral-200 bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
            {ABOUT_ROADMAP.eyebrow}
          </span>
          <h2 className="text-3xl font-bold text-neutral-900">
            {ABOUT_ROADMAP.title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-neutral-600">
            {ABOUT_ROADMAP.intro}
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {ROADMAP_PHASES.map((phase) => (
              <div
                key={phase.id}
                className="rounded-2xl border border-neutral-200 bg-white p-6"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-primary-600">
                  {phase.label}
                </p>
                <h3 className="mt-2 text-xl font-bold text-neutral-900">
                  {phase.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-neutral-500">
                  {phase.objective}
                </p>
                <p className="mt-4 text-sm text-neutral-600">{phase.summary}</p>
                <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                  {phase.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-primary-600">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs SOUTRALI */}
      <section className="bg-neutral-950 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary-400">
            ADN de marque
          </span>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            L&apos;ADN <span className="text-primary-400">SOUTRALI</span>
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-neutral-400">
            Huit valeurs portées par chaque lettre de notre nom.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SOUTRALI_VALUES.map((v) => (
              <div
                key={v.letter}
                className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"
              >
                <span className="text-3xl font-bold text-primary-400">
                  {v.letter}
                </span>
                <p className="mt-2 font-semibold text-white">{v.title}</p>
                <p className="mt-1 text-xs text-neutral-500">{v.acronym}</p>
                <p className="mt-2 text-sm text-neutral-400">{v.desc}</p>
              </div>
            ))}
          </div>
          <div className="relative mx-auto mt-12 aspect-video max-w-3xl overflow-hidden rounded-2xl">
            <Image
              src={ABOUT_IMAGES.values}
              alt="Valeurs Soutrali"
              fill
              className="object-cover"
              sizes="768px"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 bg-primary-700 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-bold md:text-3xl">
            Rejoignez l&apos;écosystème Soutrali Deals
          </h2>
          <p className="mt-4 text-primary-100">
            Prestataires, freelances, vendeurs ou clients — trouvez votre place
            sur la marketplace ivoirienne.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/inscription"
              className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100"
            >
              Créer un compte
            </Link>
            <ProInscriptionLink
              role="PRESTATAIRE"
              className="rounded-full border border-white/60 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
