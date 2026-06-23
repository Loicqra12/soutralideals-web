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
  title: "Politique de confidentialité",
  description: "Traitement et protection des données personnelles sur Soutrali Deals.",
  path: "/confidentialite",
});

const sections = [
  { id: 'responsable', number: '§ 1', title: 'Responsable du traitement' },
  { id: 'definitions', number: '§ 2', title: 'Définitions' },
  { id: 'donnees-collectees', number: '§ 3', title: 'Données collectées' },
  { id: 'finalites', number: '§ 4', title: 'Finalités & bases légales' },
  { id: 'categories-utilisateurs', number: '§ 5', title: 'Données par profil utilisateur' },
  { id: 'sous-traitants', number: '§ 6', title: 'Sous-traitants & tiers' },
  { id: 'transferts', number: '§ 7', title: 'Transferts hors UE' },
  { id: 'conservation', number: '§ 8', title: 'Durées de conservation' },
  { id: 'droits', number: '§ 9', title: 'Droits des personnes' },
  { id: 'securite', number: '§ 10', title: 'Sécurité des données' },
  { id: 'mineurs', number: '§ 11', title: 'Données relatives aux mineurs' },
  { id: 'modifications', number: '§ 12', title: 'Modifications de la politique' },
  { id: 'contact', number: '§ 13', title: 'Contact & réclamation' },
];

export default function ConfidentialitePage() {
  return (
    <LegalLayout
      title="Politique de Confidentialité"
      subtitle="La présente politique décrit la manière dont Soutrali Deals S.A.S. collecte, traite et protège les données à caractère personnel de ses utilisateurs, conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi n° 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel en Côte d'Ivoire."
      version="2.1.0"
      effectiveDate="1er janvier 2025"
      sections={sections}
    >

      {/* § 1 – Responsable du traitement */}
      <LegalArticle id="responsable" number="§ 1" title="Responsable du traitement">
        <p>
          Le responsable du traitement des données collectées via la plateforme Soutrali Deals
          (application mobile, site internet et tableau de bord professionnel) est :
        </p>
        <LegalTable
          headers={['Champ', 'Information']}
          rows={[
            ['Dénomination sociale', 'Soutrali Deals S.A.S.'],
            ['Siège social', 'Abidjan, Côte d\'Ivoire'],
            ['RCCM', '[À compléter lors de l\'immatriculation]'],
            ['Numéro de contribuable', '[À compléter]'],
            ['Délégué à la Protection des Données (DPO)', 'dpo@soutralideals.ci'],
            ['Autorité de contrôle compétente', 'Autorité de Protection des Données à caractère Personnel de Côte d\'Ivoire (ARTCI-PDCI) / CNIL (pour les utilisateurs résidant en France)'],
          ]}
        />
      </LegalArticle>

      {/* § 2 – Définitions */}
      <LegalArticle id="definitions" number="§ 2" title="Définitions">
        <p>
          Aux fins de la présente politique, les termes suivants sont définis comme suit :
        </p>
        <LegalTable
          headers={['Terme', 'Définition']}
          rows={[
            ['Donnée personnelle', 'Toute information permettant d\'identifier directement ou indirectement une personne physique.'],
            ['Traitement', 'Toute opération appliquée à des données personnelles (collecte, enregistrement, stockage, utilisation, transmission, suppression).'],
            ['Responsable du traitement', 'Personne morale qui détermine les finalités et les moyens du traitement.'],
            ['Sous-traitant', 'Personne morale qui traite des données pour le compte du responsable.'],
            ['Consentement', 'Manifestation de volonté libre, spécifique, éclairée et univoque.'],
            ['Données biométriques', 'Données résultant d\'un traitement technique spécifique relatives à des caractéristiques physiques permettant une identification unique (selfie de vérification KYC).'],
            ['SoutraPay', 'Solution de paiement intégrée à la plateforme, permettant des transactions via Mobile Money (Wave, Orange Money, MTN) avec une commission de 10 % par opération.'],
          ]}
        />
      </LegalArticle>

      {/* § 3 – Données collectées */}
      <LegalArticle id="donnees-collectees" number="§ 3" title="Données collectées">
        <p>
          Soutrali Deals collecte uniquement les données strictement nécessaires à la fourniture
          de ses services. Le tableau ci-après présente l&apos;ensemble des catégories de données
          collectées.
        </p>
        <LegalTable
          headers={['Catégorie', 'Données collectées', 'Obligatoire']}
          rows={[
            ['Identification', 'Nom, prénom, adresse e-mail, numéro de téléphone, mot de passe (haché)', 'Oui'],
            ['Profil utilisateur', 'Photo de profil, biographie, catégorie professionnelle', 'Non'],
            ['Vérification KYC (Prestataires / Freelances)', 'Copie recto-verso de la CNI, photographie de reconnaissance faciale (selfie)', 'Oui (pour exercer)'],
            ['Localisation', 'Coordonnées GPS de la position de l\'utilisateur (avec consentement préalable)', 'Optionnel'],
            ['Données financières (SoutraPay)', 'Numéro de téléphone Mobile Money, historique des transactions, solde du portefeuille numérique', 'Oui (si SoutraPay activé)'],
            ['Données de navigation', 'Adresse IP, type d\'appareil, système d\'exploitation, version de l\'application', 'Oui (technique)'],
            ['Communications', 'Messages échangés via la messagerie intégrée, contenus des notifications', 'Oui (si messagerie utilisée)'],
            ['Évaluations', 'Notes et commentaires laissés à l\'issue d\'une prestation ou commande', 'Non'],
          ]}
        />
        <LegalCallout type="important">
          <LegalStrong>Données biométriques — Régime renforcé.</LegalStrong> Le selfie de
          vérification constitue une donnée biométrique au sens de l&apos;article 9 du RGPD et de
          l&apos;article 7 de la loi ivoirienne n° 2013-450. Son traitement est soumis à un
          consentement explicite, distinct et révocable à tout moment via les paramètres du compte.
          Ces données ne sont jamais utilisées à d&apos;autres fins que la vérification d&apos;identité.
        </LegalCallout>
      </LegalArticle>

      {/* § 4 – Finalités & bases légales */}
      <LegalArticle id="finalites" number="§ 4" title="Finalités et bases légales du traitement">
        <LegalTable
          headers={['Finalité', 'Base légale (RGPD)', 'Détail']}
          rows={[
            ['Création et gestion du compte utilisateur', 'Exécution d\'un contrat — Art. 6(1)(b)', 'Nécessaire pour accéder aux services de la plateforme.'],
            ['Vérification KYC des prestataires', 'Obligation légale + Consentement — Art. 6(1)(c) & (a)', 'Conformité à la réglementation BCEAO sur la lutte contre le blanchiment.'],
            ['Traitement des transactions SoutraPay', 'Exécution d\'un contrat — Art. 6(1)(b)', 'Exécution des paiements via Mobile Money avec commission de 10 %.'],
            ['Géolocalisation des prestataires', 'Consentement — Art. 6(1)(a)', 'Affichage des prestataires proches. Révocable depuis les paramètres de l\'appareil.'],
            ['Messagerie intégrée', 'Exécution d\'un contrat — Art. 6(1)(b)', 'Coordination entre client et prestataire/freelance/vendeur.'],
            ['Envoi de notifications push', 'Consentement — Art. 6(1)(a)', 'Alertes sur l\'état des commandes et missions.'],
            ['Amélioration de la plateforme et statistiques', 'Intérêt légitime — Art. 6(1)(f)', 'Données anonymisées. Aucun profilage individuel à des fins commerciales.'],
            ['Respect des obligations légales', 'Obligation légale — Art. 6(1)(c)', 'Conservation des données de transaction (art. L.123-22 du code de commerce).'],
          ]}
        />
      </LegalArticle>

      {/* § 5 – Catégories d'utilisateurs */}
      <LegalArticle id="categories-utilisateurs" number="§ 5" title="Données traitées par profil utilisateur">
        <p>
          La plateforme Soutrali Deals distingue quatre profils d&apos;utilisateurs, chacun
          soumis à un régime de traitement spécifique :
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-neutral-300 mb-3">
              Profil Client
            </h3>
            <LegalList items={[
              'Données d\'identification et de connexion.',
              'Historique des commandes et des missions commandées.',
              'Évaluations laissées aux prestataires.',
              'Données SoutraPay (si wallet activé).',
            ]} />
          </div>

          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-neutral-300 mb-3">
              Profil Prestataire Métier (Artisan / Travaux)
            </h3>
            <LegalList items={[
              'Données d\'identification et profil professionnel.',
              <>Données KYC : copie de pièce d&apos;identité nationale (<LegalStrong>CNI recto-verso</LegalStrong>) et selfie de vérification faciale (donnée biométrique).</>,
              'Zone d\'intervention et géolocalisation (avec consentement).',
              'Historique des missions réalisées et des évaluations reçues.',
              'Données financières SoutraPay : portefeuille, historique des virements.',
            ]} />
          </div>

          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-neutral-300 mb-3">
              Profil Freelance
            </h3>
            <LegalList items={[
              'Données d\'identification et portfolio professionnel.',
              'Données KYC identiques au profil Prestataire.',
              'Catalogues de services, tarifs and disponibilités.',
              'Données financières SoutraPay.',
            ]} />
          </div>

          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-neutral-300 mb-3">
              Profil Vendeur (Marketplace)
            </h3>
            <LegalList items={[
              'Données d\'identification et informations commerciales.',
              'Catalogue produits (descriptions, photos, tarifs).',
              'Données financières SoutraPay et commissions applicables.',
              'Données relatives aux retours et litiges produits.',
            ]} />
          </div>
        </div>
      </LegalArticle>

      {/* § 6 – Sous-traitants */}
      <LegalArticle id="sous-traitants" number="§ 6" title="Sous-traitants et partenaires tiers">
        <p>
          Soutrali Deals fait appel à des sous-traitants sélectionnés pour leurs garanties en
          matière de protection des données, liés par des contrats conformes à l&apos;article 28
          du RGPD.
        </p>
        <LegalTable
          headers={['Partenaire', 'Rôle', 'Données transmises', 'Siège']}
          rows={[
            ['Render Inc.', 'Hébergement de l\'API et de la base de données', 'Toutes les données applicatives', 'États-Unis'],
            ['MongoDB Atlas', 'Base de données principale', 'Données utilisateurs et transactions', 'États-Unis'],
            ['Redis Labs', 'Cache et gestion des sessions', 'Tokens de session, données temporaires', 'États-Unis'],
            ['Google LLC (Maps Platform)', 'Cartographie et géolocalisation', 'Coordonnées GPS anonymisées', 'États-Unis'],
            ['Wave / Orange Money / MTN', 'Exécution des transactions Mobile Money', 'N° de téléphone, montant de transaction', 'Côte d\'Ivoire / Afrique de l\'Ouest'],
            ['Firebase (Google)', 'Notifications push', 'Token d\'appareil, identifiant anonyme', 'États-Unis'],
          ]}
        />
        <LegalCallout type="note">
          Soutrali Deals ne vend en aucun cas vos données personnelles à des tiers à des fins
          publicitaires ou commerciales.
        </LegalCallout>
      </LegalArticle>

      {/* § 7 – Transferts hors UE */}
      <LegalArticle id="transferts" number="§ 7" title="Transferts de données hors de l'Union Européenne">
        <p>
          Certains de nos sous-traitants étant établis aux États-Unis, des transferts de données
          hors de l&apos;Union Européenne sont susceptibles d&apos;intervenir. Ces transferts
          sont encadrés par les mécanismes juridiques suivants :
        </p>
        <LegalList items={[
          <>
            <LegalStrong>Clauses Contractuelles Types (CCT)</LegalStrong> adoptées par la Commission
            européenne le 4 juin 2021, applicables aux contrats conclus avec Render Inc. et MongoDB
            Atlas.
          </>,
          <>
            <LegalStrong>Décision d&apos;adéquation de la Commission européenne</LegalStrong> relative
            au cadre de protection des données UE-États-Unis (DPF), lorsqu&apos;applicable.
          </>,
          <>
            <LegalStrong>Mesures techniques complémentaires</LegalStrong> : chiffrement de bout en
            bout des données sensibles au repos et en transit (TLS 1.3, AES-256).
          </>,
        ]} />
      </LegalArticle>

      {/* § 8 – Conservation */}
      <LegalArticle id="conservation" number="§ 8" title="Durées de conservation des données">
        <LegalTable
          headers={['Catégorie de données', 'Durée de conservation', 'Fondement']}
          rows={[
            ['Données de compte actif', 'Durée de la relation contractuelle', 'Exécution du contrat'],
            ['Données de compte inactif', '3 ans après la dernière activité', 'Intérêt légitime'],
            ['Documents KYC (CNI, selfie)', '5 ans après la fin de la relation', 'Obligation légale — Lutte anti-blanchiment'],
            ['Données de transactions financières', '10 ans à compter de l\'opération', 'Code de commerce ivoirien — Comptabilité'],
            ['Logs de connexion et données techniques', '12 mois', 'Intérêt légitime et obligation légale'],
            ['Données des évaluations', 'Durée de vie du compte + 3 ans', 'Intérêt légitime'],
            ['Données biométriques (selfie KYC)', '5 ans maximum, supprimées après vérification réussie si non requises', 'Consentement — Art. 9 RGPD'],
            ['Contenu des messages (messagerie)', '2 ans après l\'archivage de la conversation', 'Intérêt légitime — Preuves en cas de litige'],
          ]}
        />
      </LegalArticle>

      {/* § 9 – Droits */}
      <LegalArticle id="droits" number="§ 9" title="Droits des personnes concernées">
        <p>
          Conformément aux articles 15 à 22 du RGPD et à la loi ivoirienne n° 2013-450, vous
          disposez des droits suivants concernant vos données personnelles :
        </p>
        <LegalTable
          headers={['Droit', 'Description', 'Délai de réponse']}
          rows={[
            ['Droit d\'accès (Art. 15)', 'Obtenir une copie des données vous concernant.', '30 jours calendaires'],
            ['Droit de rectification (Art. 16)', 'Corriger des données inexactes ou incomplètes.', '30 jours calendaires'],
            ['Droit à l\'effacement (Art. 17)', 'Demander la suppression de vos données sous conditions légales.', '30 jours calendaires'],
            ['Droit à la portabilité (Art. 20)', 'Recevoir vos données dans un format structuré et lisible par machine.', '30 jours calendaires'],
            ['Droit d\'opposition (Art. 21)', 'S\'opposer au traitement fondé sur l\'intérêt légitime.', '30 jours calendaires'],
            ['Droit à la limitation (Art. 18)', 'Demander la suspension temporaire du traitement.', '30 jours calendaires'],
            ['Retrait du consentement (Art. 7)', 'Révoquer votre consentement à tout moment (sans effet rétroactif).', 'Immédiat'],
            ['Directives post-mortem', 'Désigner un tiers pour gérer vos données après votre décès.', 'Sur demande écrite'],
          ]}
        />
        <LegalCallout type="note">
          Pour exercer l&apos;un de ces droits, adressez une demande écrite accompagnée d&apos;une
          copie de votre pièce d&apos;identité à :{' '}
          <LegalStrong>dpo@soutralideals.ci</LegalStrong>. En cas de réponse insatisfaisante, vous
          pouvez saisir l&apos;ARTCI-PDCI ou la CNIL.
        </LegalCallout>
      </LegalArticle>

      {/* § 10 – Sécurité */}
      <LegalArticle id="securite" number="§ 10" title="Sécurité des données">
        <p>
          Soutrali Deals met en œuvre des mesures techniques et organisationnelles appropriées
          pour garantir un niveau de sécurité adapté au risque, notamment :
        </p>
        <LegalList items={[
          <>Chiffrement des mots de passe par hachage <LegalStrong>bcrypt</LegalStrong> (coût 12) — aucun mot de passe n&apos;est stocké en clair.</>,
          <>Chiffrement des communications en transit par protocole <LegalStrong>TLS 1.3</LegalStrong>.</>,
          <>Authentification par jetons <LegalStrong>JWT</LegalStrong> à durée de vie limitée, avec mécanisme de rafraîchissement sécurisé.</>,
          <>Isolation des données par rôle utilisateur (contrôle d&apos;accès basé sur les rôles — <LegalStrong>RBAC</LegalStrong>).</>,
          <>Cache sécurisé via <LegalStrong>Redis</LegalStrong> avec TTL configuré sur chaque entrée sensible.</>,
          <>Surveillance des accès et journalisation des événements de sécurité pendant 12 mois.</>,
          <>Procédure de notification de violation de données dans les <LegalStrong>72 heures</LegalStrong> conformément à l&apos;Art. 33 RGPD.</>,
        ]} />
      </LegalArticle>

      {/* § 11 – Mineurs */}
      <LegalArticle id="mineurs" number="§ 11" title="Données relatives aux mineurs">
        <LegalCallout type="important">
          <LegalStrong>Interdiction formelle aux mineurs de moins de 18 ans.</LegalStrong> La
          plateforme Soutrali Deals est exclusivement destinée aux personnes majeures ayant la
          capacité juridique de contracter. Toute inscription par une personne mineure est
          prohibée. Si nous constatons qu&apos;un compte appartient à un mineur, il sera
          immédiatement suspendu et les données associées supprimées sans délai.
        </LegalCallout>
        <p className="mt-4">
          Les parents ou tuteurs légaux ayant connaissance d&apos;une inscription d&apos;un mineur
          sont invités à nous en informer à l&apos;adresse{' '}
          <LegalStrong>dpo@soutralideals.ci</LegalStrong> afin que nous procédions à la
          suppression immédiate du compte concerné.
        </p>
      </LegalArticle>

      {/* § 12 – Modifications */}
      <LegalArticle id="modifications" number="§ 12" title="Modifications de la politique de confidentialité">
        <p>
          La présente politique peut être modifiée à tout moment afin de refléter les évolutions
          légales, réglementaires ou opérationnelles de la plateforme. En cas de modification
          substantielle, vous serez notifié par e-mail et/ou notification in-app au moins{' '}
          <LegalStrong>30 jours avant</LegalStrong> l&apos;entrée en vigueur des nouvelles
          dispositions.
        </p>
        <p>
          L&apos;utilisation continue de la plateforme après notification vaut acceptation de la
          politique mise à jour. Si vous n&apos;acceptez pas les modifications, vous pouvez
          clôturer votre compte à tout moment depuis vos paramètres.
        </p>
      </LegalArticle>

      {/* § 13 – Contact */}
      <LegalArticle id="contact" number="§ 13" title="Contact, réclamation et autorité de contrôle">
        <LegalTable
          headers={['Voie de recours', 'Coordonnées']}
          rows={[
            ['Délégué à la Protection des Données (DPO)', 'dpo@soutralideals.ci'],
            ['Service juridique', 'legal@soutralideals.ci'],
            ['ARTCI-PDCI (Côte d\'Ivoire)', 'www.artci.ci — Abidjan, Plateau'],
            ['CNIL (France, si applicable)', 'www.cnil.fr — 3, Place de Fontenoy, 75007 Paris'],
          ]}
        />
      </LegalArticle>

    </LegalLayout>
  );
}
