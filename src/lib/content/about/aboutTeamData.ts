export type TeamMember = {
  id: string;
  name: string;
  role: string;
  description: string;
  photo: string;
};

export const FOUNDING_TEAM: TeamMember[] = [
  {
    id: "sidney",
    name: "Sidney Jordan",
    role: "CEO / COO",
    description: "Vision globale, stratégie produit, pilotage opérationnel.",
    photo: "/team/sidneyjordan.png",
  },
  {
    id: "jocelyn",
    name: "Jocelyn Boka",
    role: "CTO",
    description: "Supervision tech web & mobile, sécurité et infrastructure.",
    photo: "/team/jocelyn.jpg",
  },
  {
    id: "yann",
    name: "Yann Landry",
    role: "CMO",
    description: "Marketing digital, acquisition client, branding.",
    photo: "/team/yannlandry.png",
  },
  {
    id: "charles",
    name: "Charles Gnahoure",
    role: "CM",
    description: "Animation des communautés, fidélisation utilisateur.",
    photo: "/team/charles.jpg",
  },
  {
    id: "jean-paul",
    name: "Jean Paul Danick",
    role: "Expert Front-End",
    description: "",
    photo: "/team/jeanpaul.jpg",
  },
];
