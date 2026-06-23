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
  title: "Mentions légales",
  description: "Identité de l'éditeur, hébergement et propriété intellectuelle de Soutrali Deals.",
  path: "/mentions-legales",
});

const sections = [
  { id: 'editeur', number: '§ 1', title: 'Éditeur de la Plateforme' },
  { id: 'hebergement', number: '§ 2', title: 'Hébergement' },
  { id: 'propriete', number: '§ 3', title: 'Propriété intellectuelle' },
  { id: 'responsabilite', number: '§ 4', title: 'Limitation de responsabilité' },
  { id: 'liens', number: '§ 5', title: 'Liens hypertextes' },
  { id: 'loi', number: '§ 6', title: 'Loi applicable' },
];

export default function MentionsLegalesPage() {
  return (
    <LegalLayout
      title="Mentions Légales"
      subtitle="Conformément à la loi n° 2004-575 du 21 juin 2004 pour la Confiance en l'Économie Numérique (LCEN) et aux dispositions du Code du commerce ivoirien, les présentes mentions légales définissent l'identité de l'éditeur et les conditions d'utilisation de la Plateforme Soutrali Deals."
      version="1.3.0"
      effectiveDate="1er janvier 2025"
      sections={sections}
    >

      <LegalArticle id="editeur" number="§ 1" title="Éditeur de la Plateforme">
        <LegalTable
          headers={['Information', 'Détail']}
          rows={[
            ['Dénomination sociale', 'Soutrali Deals S.A.S.'],
            ['Forme juridique', 'Société par Actions Simplifiée (SAS)'],
            ['Siège social', 'Abidjan, Côte d\'Ivoire'],
            ['RCCM', '[À compléter lors de l\'immatriculation définitive]'],
            ['Numéro de contribuable', '[À compléter]'],
            ['Capital social', '[À compléter]'],
            ['Directeur de la publication', '[Nom du Directeur Général]'],
            ['Contact général', 'contact@soutralideals.ci'],
            ['Contact juridique', 'legal@soutralideals.ci'],
            ['Numéro de téléphone', '[À compléter]'],
          ]}
        />
        <LegalCallout type="note">
          Les informations marquées «&nbsp;À compléter&nbsp;» seront renseignées à l&apos;issue
          de l&apos;immatriculation définitive de la société. En attendant, la Plateforme est
          exploitée sous la responsabilité de son fondateur.
        </LegalCallout>
      </LegalArticle>

      <LegalArticle id="hebergement" number="§ 2" title="Hébergement de la Plateforme">
        <LegalTable
          headers={['Service', 'Prestataire', 'Adresse', 'Contact']}
          rows={[
            ['API & Base de données', 'Render Inc.', '525 Brannan St, Suite 300, San Francisco, CA 94107, États-Unis', 'support@render.com'],
            ['Base de données principale', 'MongoDB Inc. (Atlas)', '1633 Broadway, New York, NY 10019, États-Unis', 'privacy@mongodb.com'],
            ['Cache & sessions', 'Redis Labs (Redis Cloud)', 'San Francisco, CA, États-Unis', 'support@redis.com'],
          ]}
        />
        <p>
          Les données des utilisateurs résidant dans l&apos;Union Européenne font l&apos;objet
          de transferts encadrés par des <LegalStrong>Clauses Contractuelles Types (CCT)</LegalStrong>{' '}
          conformément à l&apos;article 46 du RGPD.
        </p>
      </LegalArticle>

      <LegalArticle id="propriete" number="§ 3" title="Propriété intellectuelle">
        <p>
          L&apos;ensemble des éléments constituant la Plateforme Soutrali Deals — notamment la
          marque, le logo, la charte graphique, les textes, les photographies, les icônes, les
          illustrations, les logiciels, les algorithmes et l&apos;architecture de la base de
          données — sont la propriété exclusive de Soutrali Deals S.A.S. et sont protégés par
          les lois ivoiriennes et internationales relatives à la{' '}
          <LegalStrong>propriété intellectuelle</LegalStrong>.
        </p>
        <p>
          Toute reproduction, représentation, modification, publication, adaptation ou exploitation,
          totale ou partielle, de ces éléments par quelque procédé que ce soit, sans autorisation
          écrite préalable de Soutrali Deals S.A.S., est strictement interdite et constitue une
          contrefaçon sanctionnée par les dispositions du <LegalStrong>Code de la propriété
          intellectuelle</LegalStrong> et par le <LegalStrong>Code pénal ivoirien</LegalStrong>.
        </p>
        <p>
          Les contenus publiés par les utilisateurs (photographies de produits, descriptions,
          logos de boutique) restent la propriété de leurs auteurs. L&apos;Utilisateur accorde
          à Soutrali Deals une licence non-exclusive, mondiale et gratuite d&apos;utilisation
          de ces contenus aux seules fins de fonctionnement et de promotion de la Plateforme.
        </p>
      </LegalArticle>

      <LegalArticle id="responsabilite" number="§ 4" title="Limitation de responsabilité">
        <p>
          Soutrali Deals apporte le plus grand soin à la publication et à la mise à jour des
          informations diffusées sur la Plateforme. Cependant, des erreurs ou omissions peuvent
          survenir. Soutrali Deals décline toute responsabilité pour :
        </p>
        <ul className="space-y-2.5 pl-4">
          {[
            'Toute interruption ou indisponibilité de la Plateforme liée à une maintenance, une panne ou un événement de force majeure.',
            'Toute intrusion frauduleuse d\'un tiers ayant entraîné une modification des informations diffusées.',
            'Les dommages directs ou indirects résultant de l\'utilisation ou de l\'impossibilité d\'utiliser la Plateforme.',
            'La qualité et la conformité des produits et services proposés par les Vendeurs et Prestataires tiers.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary-500/50" />
              <span className="text-neutral-400">{item}</span>
            </li>
          ))}
        </ul>
      </LegalArticle>

      <LegalArticle id="liens" number="§ 5" title="Liens hypertextes">
        <p>
          La Plateforme peut contenir des liens vers des sites tiers. Ces liens sont fournis à
          titre informatif uniquement. Soutrali Deals n&apos;exerce aucun contrôle sur le contenu
          de ces sites et n&apos;assume aucune responsabilité quant à leur contenu, leurs
          pratiques en matière de confidentialité ou leur accessibilité.
        </p>
        <p>
          Tout lien hypertexte pointant vers la Plateforme Soutrali Deals doit faire l&apos;objet
          d&apos;une autorisation écrite préalable. Les demandes sont à adresser à{' '}
          <LegalStrong>legal@soutralideals.ci</LegalStrong>.
        </p>
      </LegalArticle>

      <LegalArticle id="loi" number="§ 6" title="Loi applicable et juridiction compétente">
        <p>
          Les présentes Mentions Légales sont soumises au <LegalStrong>droit ivoirien</LegalStrong>.
          Tout litige relatif à l&apos;interprétation ou à l&apos;exécution des présentes sera
          soumis, à défaut de règlement amiable, à la compétence exclusive des juridictions
          du ressort du <LegalStrong>Tribunal d&apos;Abidjan</LegalStrong>.
        </p>
      </LegalArticle>

    </LegalLayout>
  );
}
