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
  title: "Déclaration d'accessibilité",
  description: "Engagement et niveau de conformité WCAG de Soutrali Deals.",
  path: "/accessibilite",
});

const sections = [
  { id: 'engagement', number: '§ 1', title: 'Engagement de la direction' },
  { id: 'perimetre', number: '§ 2', title: 'Périmètre d\'application' },
  { id: 'referentiel', number: '§ 3', title: 'Référentiel & niveau de conformité' },
  { id: 'etat', number: '§ 4', title: 'État de conformité détaillé' },
  { id: 'non-conformites', number: '§ 5', title: 'Non-conformités & plan d\'action' },
  { id: 'contact', number: '§ 6', title: 'Signalement & retour utilisateur' },
];

export default function AccessibilitePage() {
  return (
    <LegalLayout
      title="Déclaration d'Accessibilité"
      subtitle="Soutrali Deals s'engage à rendre sa Plateforme accessible conformément à l'article 47 de la loi n° 2005-102 du 11 février 2005 pour l'égalité des droits et des chances et aux Règles pour l'Accessibilité des Contenus Web (WCAG 2.1). La présente déclaration fait état du niveau de conformité atteint."
      version="1.0.0"
      effectiveDate="1er janvier 2025"
      sections={sections}
    >

      <LegalArticle id="engagement" number="§ 1" title="Engagement de la direction">
        <p>
          Soutrali Deals reconnaît que l&apos;accessibilité numérique est un droit fondamental.
          Notre équipe s&apos;engage à intégrer les exigences d&apos;accessibilité à chaque
          étape du développement de la Plateforme, afin que chaque utilisateur — quels que
          soient ses capacités ou équipements — puisse accéder pleinement à l&apos;ensemble
          de nos services.
        </p>
        <LegalCallout type="note">
          Cette déclaration fera l&apos;objet d&apos;une mise à jour semestrielle et à l&apos;occasion
          de toute évolution majeure de la Plateforme.
        </LegalCallout>
      </LegalArticle>

      <LegalArticle id="perimetre" number="§ 2" title="Périmètre d'application">
        <LegalTable
          headers={['Service', 'URL / Identifiant', 'Inclus dans la déclaration']}
          rows={[
            ['Site vitrine Soutrali Deals', 'soutralideals.ci', 'Oui'],
            ['Application mobile Android', 'com.soutralideals.app', 'Oui'],
            ['Application mobile iOS', 'Identifiant App Store à compléter', 'Oui'],
            ['Tableau de bord professionnel (Dashboard)', 'admin.soutralideals.ci', 'Partiellement'],
            ['API REST (usage interne)', 'api.soutralideals.ci', 'Hors périmètre'],
          ]}
        />
      </LegalArticle>

      <LegalArticle id="referentiel" number="§ 3" title="Référentiel et niveau de conformité déclaré">
        <LegalTable
          headers={['Référentiel', 'Version', 'Niveau visé', 'Niveau atteint']}
          rows={[
            ['WCAG — Web Content Accessibility Guidelines', '2.1', 'AA', 'Partiellement conforme'],
            ['RGAA — Référentiel Général d\'Amélioration de l\'Accessibilité', '4.1', 'AA', 'Partiellement conforme'],
            ['ARIA — Accessible Rich Internet Applications', '1.2', 'Applicable', 'En cours d\'implémentation'],
            ['Mobile Accessibility (W3C Note)', '—', 'Recommandée', 'Partiellement conforme'],
          ]}
        />
        <p>
          La Plateforme est <LegalStrong>partiellement conforme</LegalStrong> aux normes
          d&apos;accessibilité en vigueur. Des efforts significatifs ont été réalisés sur le
          contraste des couleurs, la navigation au clavier et la structuration sémantique du
          contenu. Des améliorations sont en cours pour atteindre la conformité de niveau AA.
        </p>
      </LegalArticle>

      <LegalArticle id="etat" number="§ 4" title="État de conformité détaillé par critère">
        <LegalTable
          headers={['Critère WCAG', 'Description', 'État', 'Remarque']}
          rows={[
            ['1.1.1 — Contenu non textuel', 'Alternatives textuelles pour les images et icônes.', '✓ Conforme', 'Attributs alt renseignés sur les images produits et profils.'],
            ['1.3.1 — Information et relations', 'Structure sémantique (h1-h6, listes, tableaux).', '✓ Conforme', 'Hiérarchie de titres respectée sur toutes les pages principales.'],
            ['1.4.3 — Contraste (minimum)', 'Rapport de contraste ≥ 4,5:1 pour le texte normal.', '⚠ Partiel', 'Certains textes secondaires sur fond sombre à améliorer.'],
            ['1.4.4 — Redimensionnement du texte', 'Texte redimensionnable jusqu\'à 200 % sans perte de contenu.', '✓ Conforme', 'Unités relatives (rem/em) utilisées dans le design system.'],
            ['2.1.1 — Clavier', 'Toutes les fonctionnalités accessibles au clavier.', '⚠ Partiel', 'Navigation au clavier sur les modales en cours d\'amélioration.'],
            ['2.4.3 — Ordre de focus', 'Ordre de navigation cohérent et logique.', '✓ Conforme', '—'],
            ['2.4.6 — En-têtes et étiquettes', 'En-têtes descriptifs pour chaque section.', '✓ Conforme', 'Implémenté sur le site vitrine et les pages légales.'],
            ['3.1.1 — Langue de la page', 'Langue principale déclarée dans le code source.', '✓ Conforme', 'lang="fr" déclaré sur toutes les pages HTML.'],
            ['3.3.1 — Identification des erreurs', 'Identification textuelle des erreurs de formulaire.', '⚠ Partiel', 'Messages d\'erreur à rendre plus explicites dans certains formulaires.'],
            ['4.1.2 — Nom, rôle, valeur', 'Composants d\'interface avec rôles ARIA appropriés.', '⚠ Partiel', 'Rôles ARIA à compléter sur les composants React personnalisés.'],
          ]}
        />
      </LegalArticle>

      <LegalArticle id="non-conformites" number="§ 5" title="Non-conformités identifiées et plan d'action">
        <LegalTable
          headers={['Non-conformité', 'Criticité', 'Plan d\'action', 'Échéance estimée']}
          rows={[
            ['Certains boutons d\'action manquent d\'un libellé ARIA accessible aux lecteurs d\'écran.', 'Haute', 'Ajout d\'attributs aria-label sur tous les boutons icônes.', 'T1 2026'],
            ['Ratio de contraste insuffisant sur certains textes grises (texte/fond sombre).', 'Moyenne', 'Révision des tokens de couleur du design system.', 'T1 2026'],
            ['Navigation au clavier incomplète sur les menus déroulants et modales.', 'Haute', 'Implémentation du focus trap dans les composants de dialogue.', 'T2 2026'],
            ['Sous-titres absents sur les vidéos de démonstration.', 'Moyenne', 'Génération et intégration des sous-titres (format VTT).', 'T2 2026'],
            ['Application mobile : lecture d\'écran partielle sur certains écrans Flutter.', 'Haute', 'Audit Semantics Flutter + correctifs des widgets concernés.', 'T2 2026'],
          ]}
        />
      </LegalArticle>

      <LegalArticle id="contact" number="§ 6" title="Signalement et retour utilisateur">
        <p>
          Si vous constatez un défaut d&apos;accessibilité vous empêchant d&apos;accéder à
          un contenu ou à une fonctionnalité de la Plateforme, vous pouvez nous le signaler
          afin que nous puissions y apporter une alternative ou une solution :
        </p>
        <LegalList items={[
          <>E-mail : <LegalStrong>accessibilite@soutralideals.ci</LegalStrong></>,
          <>Via le formulaire de contact : <LegalStrong>soutralideals.ci/contact</LegalStrong></>,
          <>En précisant dans votre message : la page concernée, le problème rencontré, le navigateur et le lecteur d&apos;écran utilisés.</>,
        ]} />
        <p>
          Nous nous engageons à accuser réception de votre signalement sous{' '}
          <LegalStrong>5 jours ouvrés</LegalStrong> et à vous apporter une réponse ou une
          solution alternative dans un délai de <LegalStrong>30 jours</LegalStrong>.
        </p>
        <LegalCallout type="note">
          Si vous ne recevez pas de réponse dans ce délai, vous avez la possibilité de saisir
          le <LegalStrong>Défenseur des droits</LegalStrong> (defenseurdesdroits.fr) pour les
          utilisateurs résidant en France, ou de contacter l&apos;autorité de régulation
          compétente en Côte d&apos;Ivoire.
        </LegalCallout>
      </LegalArticle>

    </LegalLayout>
  );
}
