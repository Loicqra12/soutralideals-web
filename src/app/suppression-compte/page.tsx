import { createPageMetadata } from "@/lib/seo/metadata";
import { SuppressionCompteForm } from "./SuppressionCompteForm";

export const metadata = createPageMetadata({
  title: "Suppression de compte",
  description:
    "Demandez la suppression de votre compte Soutrali Deals et de vos données personnelles.",
  path: "/suppression-compte",
});

export default function SuppressionComptePage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-10 text-neutral-900">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Supprimer mon compte Soutrali Deals
      </h1>
      <p className="mt-3 text-sm leading-6 text-neutral-700">
        Cette page permet de demander la suppression de votre compte
        utilisateur Soutrali Deals sans réinstaller l&apos;application. La
        demande n&apos;est pas une simple déconnexion.
      </p>

      <section className="mt-8 space-y-3 text-sm leading-6 text-neutral-700">
        <h2 className="text-base font-semibold text-neutral-900">
          Données concernées
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Supprimées / anonymisées :</strong> identité (nom, e-mail,
            téléphone, photo), tokens de session, tokens FCM, favoris,
            notifications.
          </li>
          <li>
            <strong>Conservées anonymisées :</strong> avis, commandes /
            réservations et messages nécessaires à l&apos;intégrité du service
            ou aux obligations légales.
          </li>
          <li>
            <strong>Profils professionnels :</strong> suspendus (prestataire /
            freelance / vendeur).
          </li>
        </ul>
        <p>
          Délai indicatif : traitement généralement immédiat après validation
          de la demande. Assistance :{" "}
          <a
            className="font-medium text-emerald-700 underline"
            href="mailto:contact@soutralideals.com"
          >
            contact@soutralideals.com
          </a>
          .
        </p>
      </section>

      <section className="mt-8">
        <SuppressionCompteForm />
      </section>
    </main>
  );
}
