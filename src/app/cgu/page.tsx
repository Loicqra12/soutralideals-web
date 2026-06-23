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
  title: "Conditions Générales d'Utilisation",
  description: "CGU de la plateforme Soutrali Deals — règles d'utilisation et responsabilités.",
  path: "/cgu",
});

const sections = [
  { id: 'objet', number: '§ 1', title: 'Objet & champ d\'application' },
  { id: 'definitions', number: '§ 2', title: 'Définitions' },
  { id: 'acceptation', number: '§ 3', title: 'Acceptation des CGU' },
  { id: 'inscription', number: '§ 4', title: 'Inscription & conditions d\'accès' },
  { id: 'profils', number: '§ 5', title: 'Droits & obligations par profil' },
  { id: 'soutra-pay', number: '§ 6', title: 'SoutraPay — Portefeuille numérique' },
  { id: 'evaluations', number: '§ 7', title: 'Système d\'évaluations' },
  { id: 'messagerie', number: '§ 8', title: 'Messagerie intégrée' },
  { id: 'contenu', number: '§ 9', title: 'Contenu & modération' },
  { id: 'responsabilite', number: '§ 10', title: 'Responsabilité de la plateforme' },
  { id: 'resiliation', number: '§ 11', title: 'Suspension & résiliation' },
  { id: 'droit-applicable', number: '§ 12', title: 'Droit applicable & litiges' },
];

export default function CGUPage() {
  return (
    <LegalLayout
      title="Conditions Générales d'Utilisation"
      subtitle="Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation de la plateforme Soutrali Deals, accessible via l'application mobile et le site internet. Elles constituent un contrat juridiquement contraignant entre l'utilisateur et Soutrali Deals S.A.S."
      version="3.0.0"
      effectiveDate="1er janvier 2025"
      sections={sections}
    >

      {/* § 1 – Objet */}
      <LegalArticle id="objet" number="§ 1" title="Objet et champ d'application">
        <p>
          Les présentes CGU ont pour objet de définir les conditions et modalités d&apos;utilisation
          de la plateforme <LegalStrong>Soutrali Deals</LegalStrong>, place de marché numérique
          multi-services permettant la mise en relation entre :
        </p>
        <LegalList items={[
          <>Des <LegalStrong>Clients</LegalStrong> souhaitant commander des services ou acquérir des biens ;</>,
          <>Des <LegalStrong>Prestataires Métier</LegalStrong> (artisans, professionnels du bâtiment, services à domicile) ;</>,
          <>Des <LegalStrong>Freelances</LegalStrong> proposant des services numériques et créatifs ;</>,
          <>Des <LegalStrong>Vendeurs</LegalStrong> commercialisant des produits physiques ou numériques via la Marketplace.</>,
        ]} />
        <p>
          La plateforme agit en qualité d&apos;intermédiaire de mise en relation. Elle n&apos;est
          partie ni aux contrats de prestation conclus entre les utilisateurs, ni aux contrats
          de vente, sauf disposition expresse contraire.
        </p>
        <LegalCallout type="note">
          Soutrali Deals se réserve le droit de modifier les présentes CGU à tout moment. Les
          modifications substantielles seront notifiées 30 jours à l&apos;avance. L&apos;utilisation
          continue de la plateforme vaut acceptation des nouvelles conditions.
        </LegalCallout>
      </LegalArticle>

      {/* § 2 – Définitions */}
      <LegalArticle id="definitions" number="§ 2" title="Définitions">
        <LegalTable
          headers={['Terme', 'Définition']}
          rows={[
            ['Plateforme', 'L\'ensemble des services numériques Soutrali Deals (application mobile, site internet, API).'],
            ['Utilisateur', 'Toute personne physique ou morale disposant d\'un compte actif sur la Plateforme.'],
            ['Client', 'Utilisateur commandant un service ou acquérant un bien via la Plateforme.'],
            ['Prestataire', 'Professionnel offrant des services métiers (artisan, travaux, services à domicile).'],
            ['Freelance', 'Professionnel indépendant proposant des services numériques, créatifs ou intellectuels.'],
            ['Vendeur', 'Commerçant ou particulier proposant des produits à la vente via la Marketplace.'],
            ['SoutraPay', 'Portefeuille numérique intégré permettant les paiements via Mobile Money (Wave, Orange Money, MTN) avec commission de 10 % par transaction.'],
            ['Mission', 'Contrat de prestation de service conclu entre un Client et un Prestataire ou Freelance.'],
            ['Commande', 'Acte d\'achat d\'un produit via la Marketplace.'],
            ['KYC', '« Know Your Customer » — Procédure de vérification d\'identité obligatoire pour les Prestataires et Freelances.'],
          ]}
        />
      </LegalArticle>

      {/* § 3 – Acceptation */}
      <LegalArticle id="acceptation" number="§ 3" title="Acceptation des CGU">
        <p>
          L&apos;accès et l&apos;utilisation de la Plateforme impliquent l&apos;acceptation
          pleine et entière des présentes CGU. Cette acceptation est matérialisée lors de
          l&apos;inscription par la case à cocher dédiée. Elle est obligatoire et ne peut être
          conditionnelle.
        </p>
        <LegalCallout type="important">
          <LegalStrong>Interdiction formelle aux personnes mineures.</LegalStrong> La Plateforme
          est exclusivement accessible aux personnes physiques âgées d&apos;au moins{' '}
          <LegalStrong>18 ans</LegalStrong> et jouissant de leur pleine capacité juridique, ou aux
          personnes morales régulièrement constituées. Toute inscription frauduleuse entraîne la
          résiliation immédiate du compte sans indemnité.
        </LegalCallout>
      </LegalArticle>

      {/* § 4 – Inscription */}
      <LegalArticle id="inscription" number="§ 4" title="Inscription et conditions d'accès à la Plateforme">
        <p>
          L&apos;inscription est gratuite. L&apos;Utilisateur s&apos;engage à fournir des
          informations exactes, complètes et à jour. Toute information erronée peut entraîner
          la suspension du compte.
        </p>
        <LegalTable
          headers={['Profil', 'Informations requises à l\'inscription', 'Vérification KYC']}
          rows={[
            ['Client', 'Nom, prénom, e-mail, numéro de téléphone, mot de passe', 'Non requise'],
            ['Prestataire Métier', 'Profil complet + CNI recto-verso + selfie de vérification faciale', 'Obligatoire avant activation'],
            ['Freelance', 'Profil complet + CNI recto-verso + selfie de vérification faciale + portfolio', 'Obligatoire avant activation'],
            ['Vendeur', 'Informations commerciales + justificatif d\'activité (RC ou CNI)', 'Obligatoire avant activation'],
          ]}
        />
        <p>
          La vérification KYC est réalisée par nos équipes dans un délai de{' '}
          <LegalStrong>48 à 72 heures ouvrées</LegalStrong>. Pendant cette période, le compte
          est visible mais ne peut pas accepter de missions ou passer de commandes. En cas de
          refus, l&apos;Utilisateur en est informé par e-mail avec les motifs du refus et les
          voies de recours disponibles.
        </p>
      </LegalArticle>

      {/* § 5 – Droits & obligations par profil */}
      <LegalArticle id="profils" number="§ 5" title="Droits et obligations spécifiques par profil">
        
        <div className="space-y-8">
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-neutral-300 mb-4">
              5.1 — Obligations du Client
            </h3>
            <LegalList items={[
              'Décrire avec précision et honnêteté le service demandé ou le bien souhaité.',
              'Payer le service ou le produit dans les délais convenus via SoutraPay ou les moyens acceptés.',
              'Accorder un accès sécurisé et adapté au Prestataire lorsque la mission nécessite une intervention à domicile.',
              'Ne pas solliciter de transaction hors Plateforme afin de contourner les commissions.',
              'Soumettre des évaluations honnêtes et fondées sur l\'expérience réelle.',
            ]} />
          </div>

          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-neutral-300 mb-4">
              5.2 — Obligations du Prestataire Métier
            </h3>
            <LegalList items={[
              <>Être en possession des <LegalStrong>diplômes, certifications ou autorisations professionnelles</LegalStrong> requis pour exercer son activité.</>,
              <>Bien que la Plateforme n&apos;exige pas de justificatif d&apos;assurance RC Pro à l&apos;inscription, le Prestataire est <LegalStrong>fortement encouragé</LegalStrong> à en disposer. La Plateforme décline toute responsabilité en cas de dommage causé à un tiers en l&apos;absence d&apos;assurance.</>,
              'Réaliser les prestations avec professionnalisme, dans les délais convenus et conformément au devis accepté.',
              'Signaler immédiatement à la Plateforme tout incident survenu lors d\'une mission à domicile.',
              'Ne pas contacter le Client hors Plateforme aux fins de contournement de commission.',
            ]} />
            <LegalCallout type="warning">
              <LegalStrong>Responsabilité civile professionnelle.</LegalStrong> Le Prestataire
              Métier intervenant au domicile d&apos;un Client assume l&apos;entière responsabilité
              des dommages corporels, matériels ou immatériels causés lors de la mission. La
              Plateforme Soutrali Deals n&apos;est en aucun cas responsable de ces dommages.
              Il est vivement recommandé de souscrire une assurance RC Pro avant toute intervention.
            </LegalCallout>
          </div>

          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-neutral-300 mb-4">
              5.3 — Obligations du Freelance
            </h3>
            <LegalList items={[
              'Livrer les travaux dans les délais et conditions convenus avec le Client.',
              <>Garantir que les livrables sont <LegalStrong>originaux</LegalStrong> et ne portent pas atteinte aux droits de propriété intellectuelle de tiers.</>,
              <>Sauf accord exprès contraire, le Client acquiert une <LegalStrong>licence d&apos;utilisation non-exclusive</LegalStrong> du livrable. La cession totale des droits doit être stipulée dans le contrat de mission.</>,
              'Ne pas partager ou revendre à des tiers les informations confidentielles communiquées par le Client dans le cadre de la mission.',
            ]} />
          </div>

          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-neutral-300 mb-4">
              5.4 — Obligations du Vendeur
            </h3>
            <LegalList items={[
              <>Garantir que les produits mis en vente sont <LegalStrong>conformes à leur description</LegalStrong>, légaux et ne contrefont pas de marques tiers.</>,
              'Respecter les délais de livraison annoncés et tenir le Client informé de tout retard.',
              'Traiter les demandes de retour conformément à la politique de retours définie aux CGV.',
              <>Payer une <LegalStrong>commission de 10 %</LegalStrong> sur chaque vente réalisée via SoutraPay, prélevée automatiquement sur le montant encaissé.</>,
            ]} />
          </div>
        </div>
      </LegalArticle>

      {/* § 6 – SoutraPay */}
      <LegalArticle id="soutra-pay" number="§ 6" title="SoutraPay — Portefeuille numérique et paiement Mobile Money">
        <p>
          SoutraPay est la solution de paiement intégrée à la Plateforme, permettant les
          transactions via les opérateurs de <LegalStrong>Mobile Money</LegalStrong> autorisés en
          Côte d&apos;Ivoire et en Afrique de l&apos;Ouest.
        </p>

        <LegalTable
          headers={['Paramètre', 'Détail']}
          rows={[
            ['Opérateurs acceptés', 'Wave, Orange Money, MTN Mobile Money'],
            ['Commission Plateforme', '10 % prélevés sur chaque transaction (côté Prestataire / Vendeur)'],
            ['Devise', 'Franc CFA (XOF)'],
            ['Délai de virement', '3 à 5 jours ouvrés après validation de la mission ou livraison'],
            ['Limite de transaction', 'Conforme aux plafonds définis par chaque opérateur Mobile Money'],
            ['Fond de réserve', 'Un délai de rétention de 48h peut s\'appliquer pour les nouvelles transactions en attente de confirmation'],
            ['Remboursements', 'Selon la politique de retours (CGV § 3) ou en cas d\'annulation avant démarrage de mission'],
          ]}
        />

        <LegalCallout type="warning">
          <LegalStrong>Régulation BCEAO.</LegalStrong> Les services de monnaie électronique
          fournis via SoutraPay sont soumis aux instructions de la Banque Centrale des États de
          l&apos;Afrique de l&apos;Ouest (BCEAO) relatives aux systèmes de paiement. Soutrali
          Deals s&apos;engage à se conformer à toute évolution réglementaire applicable.
        </LegalCallout>

        <p>
          L&apos;Utilisateur s&apos;engage à ne pas utiliser SoutraPay à des fins illicites,
          notamment le blanchiment de capitaux, le financement du terrorisme ou toute autre
          activité prohibée par la réglementation ivoirienne et internationale.
        </p>
      </LegalArticle>

      {/* § 7 – Évaluations */}
      <LegalArticle id="evaluations" number="§ 7" title="Système d'évaluations et d'avis">
        <p>
          À l&apos;issue de chaque mission ou commande, les parties peuvent s&apos;attribuer
          mutuellement une évaluation sur 5 étoiles assortie d&apos;un commentaire écrit.
        </p>
        <LegalList items={[
          <>Les avis doivent être <LegalStrong>sincères, fondés sur l&apos;expérience réelle</LegalStrong> et ne pas contenir de propos diffamatoires, injurieux ou discriminatoires.</>,
          <>La <LegalStrong>publication de faux avis</LegalStrong>, la sollicitation de faux avis, ou la rémunération d&apos;un avis positif constituent des infractions sanctionnées par la loi ivoirienne sur la concurrence déloyale et entraînent la suspension immédiate du compte.</>,
          <>Tout avis peut être <LegalStrong>signalé et contesté</LegalStrong> via le formulaire de signalement disponible dans l&apos;application. Soutrali Deals dispose d&apos;un délai de <LegalStrong>15 jours ouvrés</LegalStrong> pour statuer sur le signalement.</>,
          'Un avis retiré à la suite d\'un signalement fondé est supprimé définitivement de la plateforme sans pouvoir être republié.',
        ]} />
      </LegalArticle>

      {/* § 8 – Messagerie */}
      <LegalArticle id="messagerie" number="§ 8" title="Messagerie intégrée">
        <p>
          La Plateforme met à disposition un service de messagerie instantanée (chat) permettant
          aux parties de communiquer dans le cadre d&apos;une mission ou d&apos;une commande.
          L&apos;utilisation de ce service est soumise aux règles suivantes :
        </p>
        <LegalList items={[
          <>Il est <LegalStrong>strictement interdit</LegalStrong> d&apos;échanger des coordonnées personnelles (numéro de téléphone, adresse, e-mail) via la messagerie dans le but de contourner la commission de la Plateforme.</>,
          'Tout contenu illicite, menaçant, harcelant, obscène ou portant atteinte à la dignité est prohibé.',
          'Les conversations sont conservées 2 ans à des fins probatoires en cas de litige.',
          <>En cas de litige, Soutrali Deals peut accéder aux messages concernés, dans le strict cadre de la <LegalStrong>résolution amiable</LegalStrong> ou d&apos;une réquisition judiciaire.</>,
        ]} />
      </LegalArticle>

      {/* § 9 – Contenu */}
      <LegalArticle id="contenu" number="§ 9" title="Contenu publié et politique de modération">
        <p>
          Les Utilisateurs sont seuls responsables du contenu qu&apos;ils publient (descriptions
          de services, photos de produits, profils, avis). Soutrali Deals se réserve le droit de
          retirer, sans préavis, tout contenu :
        </p>
        <LegalList items={[
          'Contraire aux lois et règlements ivoiriens ou internationaux.',
          'Portant atteinte aux droits de propriété intellectuelle de tiers.',
          'Constituant de la publicité mensongère ou une pratique commerciale déloyale.',
          'Contenant des données personnelles de tiers publiées sans leur consentement.',
          'Portant atteinte à l\'image ou à la réputation de Soutrali Deals ou d\'un tiers.',
        ]} />
        <p>
          Les signalements de contenu peuvent être effectués directement dans l&apos;application.
          Les décisions de modération sont rendues dans un délai de{' '}
          <LegalStrong>72 heures</LegalStrong> pour les signalements urgents et{' '}
          <LegalStrong>15 jours ouvrés</LegalStrong> pour les cas standard.
        </p>
      </LegalArticle>

      {/* § 10 – Responsabilité */}
      <LegalArticle id="responsabilite" number="§ 10" title="Responsabilité de la Plateforme">
        <p>
          Soutrali Deals agit en qualité d&apos;intermédiaire de mise en relation. À ce titre :
        </p>
        <LegalList items={[
          <>La Plateforme <LegalStrong>n&apos;est pas partie</LegalStrong> aux contrats conclus entre les Utilisateurs et n&apos;assume aucune responsabilité quant à l&apos;exécution ou l&apos;inexécution de ces contrats.</>,
          'La Plateforme ne garantit pas la disponibilité continue et ininterrompue du service et se réserve le droit d\'effectuer des maintenances planifiées.',
          <>La responsabilité de la Plateforme est expressément <LegalStrong>limitée aux dommages directs</LegalStrong> résultant d&apos;une faute prouvée de sa part, dans la limite du montant des commissions perçues au cours des 12 derniers mois.</>,
          'La Plateforme n\'est pas responsable des dommages causés par un Prestataire lors d\'une intervention à domicile, ni de la qualité des produits vendus par les Vendeurs.',
        ]} />
      </LegalArticle>

      {/* § 11 – Suspension */}
      <LegalArticle id="resiliation" number="§ 11" title="Suspension et résiliation du compte">
        <LegalTable
          headers={['Motif', 'Type de sanction', 'Délai de notification']}
          rows={[
            ['Violation grave des CGU (fraude, faux avis, harcèlement)', 'Suspension immédiate puis résiliation définitive', 'Notification simultanée'],
            ['Contournement de commission', 'Avertissement + suspension temporaire 30 jours', '24h avant suspension'],
            ['Informations d\'inscription frauduleuses', 'Résiliation immédiate', 'Notification simultanée'],
            ['Inactivité prolongée (+ de 24 mois)', 'Archivage du compte avec notification préalable', '30 jours avant archivage'],
            ['Demande volontaire de l\'Utilisateur', 'Clôture sous 30 jours (délai légal de rétention)', 'Immédiate'],
          ]}
        />
        <p>
          En cas de résiliation, les fonds disponibles sur le portefeuille SoutraPay sont
          remboursés sur le compte Mobile Money de l&apos;Utilisateur dans un délai de{' '}
          <LegalStrong>15 jours ouvrés</LegalStrong>, déduction faite des éventuelles sommes dues.
        </p>
      </LegalArticle>

      {/* § 12 – Droit applicable */}
      <LegalArticle id="droit-applicable" number="§ 12" title="Droit applicable et résolution des litiges">
        <p>
          Les présentes CGU sont soumises au <LegalStrong>droit ivoirien</LegalStrong>. En cas
          de litige, les parties s&apos;engagent à rechercher une solution amiable avant tout
          recours judiciaire.
        </p>
        <LegalList items={[
          <>Étape 1 — <LegalStrong>Réclamation amiable</LegalStrong> : Adresser un e-mail à support@soutralideals.ci. Délai de réponse : 15 jours ouvrés.</>,
          <>Étape 2 — <LegalStrong>Médiation</LegalStrong> : En cas d&apos;échec, recours à un médiateur agréé désigné d&apos;un commun accord.</>,
          <>Étape 3 — <LegalStrong>Juridiction compétente</LegalStrong> : À défaut de règlement amiable, les juridictions compétentes sont celles du ressort du <LegalStrong>Tribunal de Commerce d&apos;Abidjan</LegalStrong>.</>,
        ]} />
      </LegalArticle>

    </LegalLayout>
  );
}
