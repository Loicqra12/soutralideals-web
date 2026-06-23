import { createPageMetadata } from "@/lib/seo/metadata";
import {
  LegalLayout,
  LegalArticle,
  LegalCallout,
  LegalTable,
  LegalList,
  LegalStrong,
} from "@/components/legal/LegalLayout";

export const metadata = createPageMetadata({
  title: "Politique de cookies",
  description: "Types de cookies utilisés et gestion de vos préférences.",
  path: "/cookies",
});

const sections = [
  { id: 'definition', number: '§ 1', title: 'Qu\'est-ce qu\'un cookie ?' },
  { id: 'types', number: '§ 2', title: 'Types de cookies utilisés' },
  { id: 'tableau', number: '§ 3', title: 'Tableau détaillé des cookies' },
  { id: 'durees', number: '§ 4', title: 'Durées de conservation' },
  { id: 'gestion', number: '§ 5', title: 'Gestion du consentement' },
  { id: 'refus', number: '§ 6', title: 'Conséquences du refus' },
  { id: 'tiers', number: '§ 7', title: 'Cookies des tiers' },
  { id: 'contact', number: '§ 8', title: 'Contact' },
];

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Politique de Cookies"
      subtitle="La présente politique explique ce que sont les cookies, quels cookies Soutrali Deals utilise, pourquoi et comment vous pouvez les contrôler. Elle doit être lue conjointement avec la Politique de Confidentialité."
      version="1.2.0"
      effectiveDate="1er janvier 2025"
      sections={sections}
    >

      <LegalArticle id="definition" number="§ 1" title="Qu'est-ce qu'un cookie ?">
        <p>
          Un cookie est un <LegalStrong>fichier texte de petite taille</LegalStrong> déposé sur
          votre terminal (ordinateur, tablette, smartphone) lors de la visite d&apos;un site
          internet ou de l&apos;utilisation d&apos;une application mobile. Il permet au serveur
          de reconnaître votre appareil lors d&apos;une visite ultérieure.
        </p>
        <p>
          Les technologies similaires aux cookies (pixels invisibles, LocalStorage, SessionStorage,
          identifiants d&apos;appareils mobiles) sont soumises aux mêmes règles et sont désignées
          collectivement par le terme « cookies » dans la présente politique.
        </p>
        <LegalCallout type="note">
          Conformément à l&apos;article 82 de la Loi Informatique et Libertés modifiée et aux
          lignes directrices de la CNIL du 17 septembre 2020, certains cookies nécessitent votre
          consentement préalable. D&apos;autres, strictement nécessaires au fonctionnement du
          service, sont déposés sans consentement.
        </LegalCallout>
      </LegalArticle>

      <LegalArticle id="types" number="§ 2" title="Types de cookies utilisés">
        <LegalTable
          headers={['Catégorie', 'Finalité', 'Consentement requis']}
          rows={[
            ['Cookies strictement nécessaires', 'Authentification, sécurité de la session, préférences essentielles. Sans ces cookies, la Plateforme ne peut pas fonctionner.', 'Non — exemptés'],
            ['Cookies fonctionnels', 'Mémorisation de vos préférences (langue, devise, filtres de recherche).', 'Non — exemptés si nécessaires'],
            ['Cookies analytiques / de mesure d\'audience', 'Mesure du trafic et du comportement de navigation (pages vues, temps passé). Données anonymisées ou pseudonymisées.', 'Oui'],
            ['Cookies tiers (Google Maps)', 'Affichage des cartes et géolocalisation des prestataires.', 'Oui'],
            ['Cookies Firebase (notifications)', 'Enregistrement du token d\'appareil pour la réception des notifications push.', 'Oui (permission système)'],
          ]}
        />
      </LegalArticle>

      <LegalArticle id="tableau" number="§ 3" title="Tableau détaillé des cookies déposés">
        <LegalTable
          headers={['Nom du cookie', 'Émetteur', 'Finalité', 'Type', 'Durée']}
          rows={[
            ['access_token', 'Soutrali Deals', 'Authentification JWT — maintien de la session utilisateur', 'Nécessaire', '15 minutes (puis rafraîchi)'],
            ['refresh_token', 'Soutrali Deals', 'Renouvellement du jeton d\'authentification', 'Nécessaire', '30 jours'],
            ['user_preferences', 'Soutrali Deals', 'Mémorisation de la langue et des filtres de recherche', 'Fonctionnel', '365 jours'],
            ['sd_session_id', 'Soutrali Deals', 'Identification anonyme de la session pour le support', 'Nécessaire', 'Session'],
            ['_ga / _gid', 'Google Analytics', 'Mesure de l\'audience du site vitrine', 'Analytique', '2 ans / 24h'],
            ['NID / CONSENT', 'Google LLC (Maps)', 'Personnalisation et fonctionnement de Google Maps', 'Tiers', '6 mois'],
            ['firebase_app_check', 'Firebase (Google)', 'Sécurisation des requêtes API — prévention des abus', 'Nécessaire', '7 jours'],
          ]}
        />
      </LegalArticle>

      <LegalArticle id="durees" number="§ 4" title="Durées de conservation des cookies">
        <p>
          Les durées de conservation varient selon la nature et la finalité de chaque cookie.
          À l&apos;expiration de leur durée, les cookies sont automatiquement supprimés de votre
          terminal. Les cookies de session sont supprimés à la fermeture de votre navigateur
          ou de l&apos;application.
        </p>
        <LegalCallout type="note">
          La durée de conservation d&apos;un cookie ne peut excéder <LegalStrong>13 mois</LegalStrong>{' '}
          conformément aux recommandations de la CNIL, sauf exigence légale contraire. Le
          renouvellement du cookie via une nouvelle visite ne prolonge pas automatiquement ce délai.
        </LegalCallout>
      </LegalArticle>

      <LegalArticle id="gestion" number="§ 5" title="Gestion et retrait du consentement">
        <p>
          Vous pouvez à tout moment gérer vos préférences en matière de cookies via plusieurs
          canaux :
        </p>

        <div className="space-y-5">
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-neutral-300 mb-3">
              5.1 — Via les paramètres de l&apos;application Soutrali Deals
            </h3>
            <p>
              Accédez à <LegalStrong>Paramètres → Confidentialité → Gestion des cookies</LegalStrong>{' '}
              pour activer ou désactiver les catégories de cookies optionnelles.
            </p>
          </div>

          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-neutral-300 mb-3">
              5.2 — Via les paramètres de votre navigateur
            </h3>
            <LegalTable
              headers={['Navigateur', 'Chemin d\'accès']}
              rows={[
                ['Google Chrome', 'Paramètres → Confidentialité et sécurité → Cookies'],
                ['Mozilla Firefox', 'Options → Vie privée et sécurité → Cookies et données de sites'],
                ['Safari (macOS / iOS)', 'Préférences → Confidentialité → Gérer les données de sites web'],
                ['Microsoft Edge', 'Paramètres → Cookies et autorisations de site'],
              ]}
            />
          </div>

          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-neutral-300 mb-3">
              5.3 — Via les outils de désinscription des tiers
            </h3>
            <LegalList items={[
              <>Google Analytics : <LegalStrong>tools.google.com/dlpage/gaoptout</LegalStrong></>,
              <>Google Maps / Publicité Google : <LegalStrong>adssettings.google.com</LegalStrong></>,
              <>Désinscription réseau publicitaire (Network Advertising Initiative) : <LegalStrong>optout.networkadvertising.org</LegalStrong></>,
            ]} />
          </div>
        </div>
      </LegalArticle>

      <LegalArticle id="refus" number="§ 6" title="Conséquences du refus des cookies">
        <LegalTable
          headers={['Catégorie refusée', 'Impact sur votre expérience']}
          rows={[
            ['Cookies strictement nécessaires', 'Impossibilité de se connecter et d\'utiliser la Plateforme. Ces cookies ne peuvent pas être refusés.'],
            ['Cookies fonctionnels', 'Perte de mémorisation des préférences (langue, devise). Nécessite de les re-saisir à chaque session.'],
            ['Cookies analytiques', 'Aucun impact sur les fonctionnalités. Vos données ne contribueront pas aux statistiques d\'audience.'],
            ['Cookies Google Maps', 'Les cartes de géolocalisation des prestataires ne seront pas affichées.'],
            ['Cookies Firebase (notifications)', 'Aucune notification push ne sera reçue (désactivation depuis les paramètres de l\'appareil également).'],
          ]}
        />
      </LegalArticle>

      <LegalArticle id="tiers" number="§ 7" title="Cookies des partenaires tiers">
        <p>
          Certains cookies sont déposés directement par nos partenaires tiers, sous leur propre
          responsabilité. Soutrali Deals n&apos;est pas responsable des cookies tiers. Nous vous
          invitons à consulter les politiques de confidentialité de ces partenaires directement :
        </p>
        <LegalList items={[
          <>Google LLC (Maps, Analytics, Firebase) : <LegalStrong>policies.google.com/privacy</LegalStrong></>,
          <>Wave : <LegalStrong>wave.com/privacy</LegalStrong></>,
          <>Orange Money Côte d&apos;Ivoire : <LegalStrong>orangemoney.ci</LegalStrong></>,
          <>MTN Mobile Money : <LegalStrong>mtn.ci</LegalStrong></>,
        ]} />
      </LegalArticle>

      <LegalArticle id="contact" number="§ 8" title="Contact pour toute question relative aux cookies">
        <p>
          Pour toute question concernant la présente politique ou pour exercer vos droits,
          vous pouvez contacter notre Délégué à la Protection des Données :
        </p>
        <LegalList items={[
          <>E-mail : <LegalStrong>dpo@soutralideals.ci</LegalStrong></>,
          <>Courrier : Soutrali Deals S.A.S. — Service DPO — Abidjan, Côte d&apos;Ivoire</>,
        ]} />
      </LegalArticle>

    </LegalLayout>
  );
}
