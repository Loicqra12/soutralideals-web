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
  title: "Conditions Générales de Vente",
  description: "CGV Soutrali Deals — ventes, livraisons, retours et paiements.",
  path: "/cgv",
});

const sections = [
  { id: 'champ', number: '§ 1', title: 'Champ d\'application' },
  { id: 'commande', number: '§ 2', title: 'Formation du contrat de vente' },
  { id: 'prix', number: '§ 3', title: 'Prix, commissions & paiement' },
  { id: 'livraison', number: '§ 4', title: 'Livraison' },
  { id: 'retours', number: '§ 5', title: 'Politique de retours & remboursements' },
  { id: 'garanties', number: '§ 6', title: 'Garanties légales' },
  { id: 'services', number: '§ 7', title: 'Conditions spécifiques aux services' },
  { id: 'responsabilite', number: '§ 8', title: 'Responsabilité du Vendeur' },
  { id: 'propriete', number: '§ 9', title: 'Transfert de propriété & de risques' },
  { id: 'litiges', number: '§ 10', title: 'Gestion des litiges' },
  { id: 'droit', number: '§ 11', title: 'Droit applicable' },
];

export default function CGVPage() {
  return (
    <LegalLayout
      title="Conditions Générales de Vente"
      subtitle="Les présentes Conditions Générales de Vente (CGV) s'appliquent à l'ensemble des ventes de produits et des prestations de services réalisées sur la Marketplace Soutrali Deals. Elles constituent le socle unique de toute relation commerciale entre les Vendeurs, les Prestataires et les Clients de la Plateforme."
      version="2.2.0"
      effectiveDate="1er janvier 2025"
      sections={sections}
    >

      {/* § 1 – Champ */}
      <LegalArticle id="champ" number="§ 1" title="Champ d'application">
        <p>
          Les présentes CGV s&apos;appliquent sans restriction ni réserve à l&apos;ensemble des
          transactions commerciales réalisées via la Plateforme <LegalStrong>Soutrali Deals</LegalStrong>,
          qu&apos;il s&apos;agisse :
        </p>
        <LegalList items={[
          <>De la <LegalStrong>vente de produits physiques</LegalStrong> (articles neufs ou d&apos;occasion) commercialisés par les Vendeurs via la Marketplace ;</>,
          <>De la <LegalStrong>vente de produits numériques</LegalStrong> (fichiers téléchargeables, licences logicielles) ;</>,
          <>De la <LegalStrong>fourniture de services</LegalStrong> par les Prestataires Métier ou les Freelances à un Client.</>,
        ]} />
        <p>
          Ces CGV sont opposables au Client dès la validation de sa Commande. En cas de
          contradiction entre les présentes CGV et les CGU, les CGV prévalent pour tout ce qui
          concerne les transactions commerciales.
        </p>
        <LegalCallout type="note">
          Les présentes CGV ne s&apos;appliquent pas aux transactions entre professionnels
          (B2B). Toute vente entre professionnels est régie par un contrat de prestation
          spécifique négocié directement entre les parties, soumis au droit commercial ivoirien.
        </LegalCallout>
      </LegalArticle>

      {/* § 2 – Formation du contrat */}
      <LegalArticle id="commande" number="§ 2" title="Formation du contrat de vente">
        <p>
          Le contrat de vente est réputé formé lorsque les étapes suivantes sont accomplies :
        </p>
        <LegalTable
          headers={['Étape', 'Action', 'Effet juridique']}
          rows={[
            ['1', 'Le Client sélectionne un produit ou service et valide son panier.', 'Offre ferme d\'achat'],
            ['2', 'Le Client confirme son adresse de livraison / ses informations de mission et choisit son mode de paiement.', 'Confirmation des modalités'],
            ['3', 'Le Client procède au paiement via SoutraPay ou tout autre mode accepté.', 'Acceptation de l\'offre'],
            ['4', 'Le Vendeur ou Prestataire reçoit une notification et confirme la commande / mission.', 'Formation du contrat'],
            ['5', 'Un accusé de réception est adressé par e-mail et notification in-app au Client.', 'Preuve de la transaction'],
          ]}
        />
        <p>
          Soutrali Deals conserve une copie électronique de chaque contrat conclu pour une
          durée de <LegalStrong>10 ans</LegalStrong>, conformément aux obligations comptables
          applicables. Le Client peut en obtenir copie sur demande écrite.
        </p>
      </LegalArticle>

      {/* § 3 – Prix & paiement */}
      <LegalArticle id="prix" number="§ 3" title="Prix, commissions et modalités de paiement">
        <p>
          Les prix affichés sur la Plateforme sont exprimés en <LegalStrong>Francs CFA (XOF)</LegalStrong>,
          toutes taxes comprises applicables. Soutrali Deals se réserve le droit de modifier ses
          prix à tout moment ; toutefois, le prix applicable à une commande est celui en vigueur
          au moment de la validation du paiement.
        </p>

        <LegalTable
          headers={['Type de frais', 'Montant', 'Qui le paie ?', 'Quand ?']}
          rows={[
            ['Prix du produit / service', 'Fixé par le Vendeur / Prestataire', 'Client', 'À la commande'],
            ['Commission Plateforme', '10 % du montant HT de la transaction', 'Vendeur / Prestataire (déduit automatiquement)', 'À la validation de la livraison'],
            ['Frais de livraison (si applicable)', 'Variables selon le transporteur et la zone', 'Client (affiché avant confirmation)', 'À la commande'],
            ['Frais de retour', 'À la charge du Client (sauf défaut ou erreur du Vendeur)', 'Client', 'Au moment du retour'],
          ]}
        />

        <LegalCallout type="note">
          <LegalStrong>SoutraPay — Opérateurs Mobile Money acceptés :</LegalStrong> Wave,
          Orange Money, MTN Mobile Money. Le paiement est déclenché par le Client depuis
          l&apos;application. La commission de 10 % est automatiquement déduite du montant reversé
          au Vendeur ou Prestataire lors du déblocage des fonds.
        </LegalCallout>
      </LegalArticle>

      {/* § 4 – Livraison */}
      <LegalArticle id="livraison" number="§ 4" title="Livraison des produits">
        <p>
          Les modalités de livraison des produits physiques sont définies par le Vendeur lors
          de la mise en ligne de l&apos;article. Soutrali Deals agit en qualité d&apos;intermédiaire
          et n&apos;est pas directement responsable de la logistique de livraison, sauf
          partenariat express contraire.
        </p>
        <LegalTable
          headers={['Paramètre', 'Règle applicable']}
          rows={[
            ['Zone de livraison', 'Définie par chaque Vendeur lors de la création du produit'],
            ['Délai indicatif', 'Communiqué par le Vendeur sur la fiche produit'],
            ['Délai maximum légal', '30 jours calendaires à compter de la validation de la commande'],
            ['Preuve de livraison', 'Accusé de réception in-app requis (signature électronique ou confirmation manuelle)'],
            ['Livraison numérique', 'Immédiate après validation du paiement (lien de téléchargement sécurisé)'],
          ]}
        />
        <p>
          En cas de dépassement du délai de livraison sans information préalable du Vendeur,
          le Client peut annuler la commande et obtenir un remboursement intégral via SoutraPay
          dans un délai de <LegalStrong>5 jours ouvrés</LegalStrong>.
        </p>
      </LegalArticle>

      {/* § 5 – Retours */}
      <LegalArticle id="retours" number="§ 5" title="Politique de retours et de remboursements">
        <LegalCallout type="important">
          <LegalStrong>Politique définie par Soutrali Deals.</LegalStrong> En l&apos;absence de
          politique de retour propre à chaque Vendeur, les règles ci-dessous s&apos;appliquent
          de plein droit à toutes les transactions réalisées sur la Marketplace.
        </LegalCallout>

        <div className="space-y-6 mt-6">
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-neutral-300 mb-4">
              5.1 — Produits physiques
            </h3>
            <LegalTable
              headers={['Condition', 'Délai de retour', 'Frais de retour', 'Remboursement']}
              rows={[
                ['Produit non conforme à la description', '14 jours calendaires à compter de la réception', 'À la charge du Vendeur', 'Intégral (prix + frais de livraison initiaux) sous 5 jours ouvrés'],
                ['Produit défectueux ou endommagé à la livraison', '7 jours calendaires à compter de la réception', 'À la charge du Vendeur', 'Intégral ou remplacement au choix du Client, sous 5 jours ouvrés'],
                ['Rétractation (sans motif) — article neuf non utilisé', '7 jours calendaires à compter de la réception', 'À la charge du Client', 'Prix du produit remboursé (hors frais de livraison initiaux) sous 10 jours ouvrés'],
                ['Produit ouvert, utilisé ou non restituable', 'Non éligible au retour', '—', 'Aucun remboursement'],
                ['Produit périssable ou personnalisé', 'Non éligible au retour', '—', 'Aucun remboursement'],
              ]}
            />
          </div>

          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-neutral-300 mb-4">
              5.2 — Produits numériques (fichiers téléchargeables, licences)
            </h3>
            <LegalCallout type="warning">
              Conformément à l&apos;article L.221-28 du Code de la consommation français (applicable
              aux utilisateurs résidant en France), <LegalStrong>aucun droit de rétractation ne
              s&apos;applique aux produits numériques</LegalStrong> dont le téléchargement ou la
              consultation a déjà été initié par le Client après validation de la commande.
              En Côte d&apos;Ivoire, la même règle s&apos;applique par analogie à la nature du bien.
            </LegalCallout>
            <div className="mt-4">
              <LegalList items={[
                'Si le fichier est corrompu ou non fonctionnel : remboursement intégral ou renvoi d\'un fichier valide, dans un délai de 48h après signalement.',
                'Si le produit numérique ne correspond pas à la description : remboursement intégral possible dans les 48h après signalement, avant tout téléchargement.',
              ]} />
            </div>
          </div>

          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-neutral-300 mb-4">
              5.3 — Services (prestations et missions Freelance)
            </h3>
            <LegalTable
              headers={['Situation', 'Droit au remboursement']}
              rows={[
                ['Mission annulée avant tout début d\'exécution', 'Remboursement intégral sous 5 jours ouvrés'],
                ['Mission partiellement réalisée, annulée d\'un commun accord', 'Remboursement au prorata du travail non réalisé, évalué par les parties'],
                ['Mission livrée et réceptionnée sans réserve', 'Aucun remboursement'],
                ['Mission livrée non conforme au cahier des charges validé', 'Droit à une correction gratuite ou remboursement partiel selon médiation Soutrali Deals'],
                ['Prestataire défaillant (absence, abandon de mission)', 'Remboursement intégral + possibilité de signalement'],
              ]}
            />
          </div>
        </div>

        <div className="mt-6 border border-white/[0.06] rounded-lg p-5 bg-white/[0.015]">
          <p className="text-[13px] font-bold text-neutral-300 mb-3 uppercase tracking-wider">
            Procédure de demande de retour
          </p>
          <ol className="space-y-2.5 pl-4">
            {[
              'Ouvrir un ticket de réclamation depuis l\'espace « Mes Commandes » dans l\'application.',
              'Joindre des photos probantes du produit (pour les biens physiques) ou une description détaillée du litige.',
              'L\'équipe Soutrali Deals analyse la demande et rend une décision sous 72 heures ouvrées.',
              'En cas d\'accord, le remboursement est effectué sur le portefeuille SoutraPay ou le compte Mobile Money du Client.',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-neutral-400 text-[13px]">
                <span className="shrink-0 mt-0.5 font-mono text-[10px] text-primary-500/60">
                  0{i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </LegalArticle>

      {/* § 6 – Garanties */}
      <LegalArticle id="garanties" number="§ 6" title="Garanties légales applicables aux produits">
        <p>
          Tout produit vendu via la Marketplace Soutrali Deals bénéficie des garanties légales
          suivantes, conformément à la réglementation ivoirienne sur la consommation :
        </p>
        <LegalTable
          headers={['Garantie', 'Durée', 'Portée']}
          rows={[
            ['Garantie légale de conformité', '2 ans à compter de la livraison', 'Le produit doit être conforme à sa description, propre à l\'usage habituel et à l\'usage particulier convenu.'],
            ['Garantie des vices cachés', '2 ans à compter de la découverte du vice', 'Couvre les défauts cachés rendant le produit impropre à l\'usage ou diminuant son usage au point que l\'acheteur ne l\'aurait pas acquis.'],
            ['Garantie commerciale (si offerte par le Vendeur)', 'Selon les conditions du Vendeur', 'Soumise aux termes définis par le Vendeur dans la fiche produit.'],
          ]}
        />
        <LegalCallout type="note">
          Pour invoquer une garantie, le Client doit contacter le service client via l&apos;application.
          La garantie légale de conformité ne peut être écartée ni limitée par aucune clause contractuelle.
        </LegalCallout>
      </LegalArticle>

      {/* § 7 – Services */}
      <LegalArticle id="services" number="§ 7" title="Conditions spécifiques applicables aux services">
        <p>
          Les services fournis par les Prestataires et les Freelances via la Plateforme sont
          régis par les conditions suivantes, qui s&apos;appliquent en complément des CGU :
        </p>
        <LegalList items={[
          <>Chaque mission fait l&apos;objet d&apos;un <LegalStrong>devis détaillé</LegalStrong> ou d&apos;une description de service acceptée par les deux parties avant le début de l&apos;exécution.</>,
          <>Les fonds sont <LegalStrong>séquestrés sur SoutraPay</LegalStrong> dès la validation de la commande et ne sont libérés au Prestataire qu&apos;après réception confirmée par le Client ou après expiration du délai de contestation (72h).</>,
          <>Toute modification substantielle du périmètre d&apos;une mission en cours doit faire l&apos;objet d&apos;un <LegalStrong>avenant écrit</LegalStrong> validé via la messagerie intégrée.</>,
          'La réception de la mission sans réserve exprimée dans les 72h suivant la livraison vaut acceptation définitive.',
        ]} />
      </LegalArticle>

      {/* § 8 – Responsabilité du Vendeur */}
      <LegalArticle id="responsabilite" number="§ 8" title="Responsabilité du Vendeur et du Prestataire">
        <p>
          Le Vendeur ou Prestataire est seul responsable :
        </p>
        <LegalList items={[
          'De la qualité, de la conformité et de la légalité des produits ou services proposés.',
          'De l\'exactitude et de l\'exhaustivité des informations figurant sur ses fiches produits.',
          'Du respect des délais de livraison et de réalisation annoncés.',
          'De la gestion des retours et des litiges avec les Clients.',
          <>Des <LegalStrong>obligations fiscales et sociales</LegalStrong> découlant de son activité commerciale (TVA, impôts sur le revenu, cotisations CNPS).</>,
        ]} />
        <p>
          Soutrali Deals ne peut être tenu responsable des actions, omissions ou négligences du
          Vendeur ou Prestataire dans l&apos;exécution de ses obligations commerciales.
        </p>
      </LegalArticle>

      {/* § 9 – Transfert */}
      <LegalArticle id="propriete" number="§ 9" title="Transfert de propriété et des risques">
        <p>
          Le transfert de propriété d&apos;un produit physique n&apos;intervient qu&apos;après
          réception effective du paiement intégral par le Vendeur. Le transfert des risques
          (perte, détérioration) s&apos;opère à la livraison physique au Client ou au remise
          au transporteur si le Client en a organisé lui-même le transport.
        </p>
      </LegalArticle>

      {/* § 10 – Litiges */}
      <LegalArticle id="litiges" number="§ 10" title="Gestion des litiges commerciaux">
        <LegalTable
          headers={['Étape', 'Procédure', 'Délai']}
          rows={[
            ['1 — Réclamation directe', 'Le Client contacte le Vendeur via la messagerie intégrée.', 'Réponse attendue sous 48h'],
            ['2 — Ticket Plateforme', 'Si aucune résolution, ouverture d\'un ticket via « Aide & Réclamation » dans l\'app.', 'Instruction sous 72h ouvrées'],
            ['3 — Médiation Soutrali Deals', 'L\'équipe Soutrali Deals examine les preuves et rend une décision arbitrale non contraignante.', '15 jours ouvrés'],
            ['4 — Voie judiciaire', 'Recours devant le Tribunal de Commerce d\'Abidjan.', 'Délais de droit commun'],
          ]}
        />
        <LegalCallout type="note">
          La décision de médiation Soutrali Deals peut aboutir à un déblocage partiel ou total
          des fonds séquestrés sur SoutraPay en faveur de l&apos;une des parties. Cette décision
          est exécutoire sur la Plateforme mais ne préjuge pas de l&apos;issue d&apos;une
          éventuelle procédure judiciaire.
        </LegalCallout>
      </LegalArticle>

      {/* § 11 – Droit */}
      <LegalArticle id="droit" number="§ 11" title="Droit applicable">
        <p>
          Les présentes CGV sont soumises au <LegalStrong>droit ivoirien</LegalStrong>. À titre
          supplétif, pour les transactions impliquant des utilisateurs résidant dans l&apos;Union
          Européenne, les dispositions protectrices du droit de la consommation de l&apos;État
          membre de résidence du consommateur s&apos;applquent lorsqu&apos;elles offrent une
          protection plus étendue.
        </p>
      </LegalArticle>

    </LegalLayout>
  );
}
