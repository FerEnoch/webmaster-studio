const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const photos = {
  heroWoman: u("photo-1573497019940-1c28c88b4f3e", 900),
  heroOffice: u("photo-1600880292203-757bb62b4baf", 1000),
  heroCode: u("photo-1461749280684-dccba630e2f6", 900),
  heroMeeting: u("photo-1552664730-d307ca884978", 900),
  heroDesk: u("photo-1553877522-43269d4ea984", 900),
  aboutTeam: u("photo-1522071820081-009f0129c71c", 1400),
  aboutColumns: u("photo-1555993539-1732b0258235", 900),
  aboutFriends: u("photo-1529156069898-49953e39b3ac", 900),
  founderA: u("photo-1507003211169-0a1dd7228f2d", 800),
  founderB: u("photo-1500648767791-00dcc994a43e", 800),
  house: u("photo-1521737711867-e3b97375f902", 1000),
  laptop: u("photo-1516321318423-f06f85e504b3", 800),
  impactA: u("photo-1524178232363-1fb2b075b655", 1000),
  impactB: u("photo-1540575467063-178a50c2df87", 1000),
  impactC: u("photo-1515187029135-18ee286d815b", 1000),
  impactD: u("photo-1556761175-b413da4baf72", 1000),
};

export const leaders = [
  { name: "Sebastián Martínez", role: "CEO & Co-Founder", image: u("photo-1507003211169-0a1dd7228f2d", 700) },
  { name: "Pablo García", role: "CIO & Co-Founder", image: u("photo-1500648767791-00dcc994a43e", 700) },
  { name: "Tania Berjis", role: "Chief Recruitment Officer", image: u("photo-1573496359142-b8d87734a5a2", 700) },
  { name: "María Laura Daguerre", role: "Chief Operations Officer", image: u("photo-1580489944761-15a19d654956", 700) },
  { name: "Gastón Inzaurralde", role: "Chief Financial Officer", image: u("photo-1472099645785-5658abf4ff4e", 700) },
  { name: "Carla Brovetto", role: "Chief Happiness Officer", image: u("photo-1438761681033-6461ffad8d80", 700) },
];

export const remotePeople = [
  { name: "Andrea", initials: "AS", image: u("photo-1544005313-94ddf0286df2", 300), x: "8%", y: "18%" },
  { name: "Rodrigo", initials: "R", image: u("photo-1506794778202-cad84cf45f1d", 300), x: "78%", y: "8%" },
  { name: "Pablo", initials: "VP", image: u("photo-1500648767791-00dcc994a43e", 300), x: "86%", y: "42%" },
  { name: "Yoel", initials: "DB", image: u("photo-1507003211169-0a1dd7228f2d", 300), x: "6%", y: "62%" },
  { name: "Noela", initials: "N", image: u("photo-1534528741775-53994a69daeb", 300), x: "72%", y: "72%" },
  { name: "Sebastián", initials: "S", image: u("photo-1472099645785-5658abf4ff4e", 300), x: "22%", y: "78%" },
];

export type NavLink = { label: string; href: string };

export const nav: { label: string; href: string; items: NavLink[] }[] = [
  {
    label: "Services",
    href: "#",
    items: [
      "Tech Talent Solutions",
      "Staff Augmentation",
      "Direct Hire",
      "Managed Teams",
      "IT Outsourcing",
    ].map((label) => ({ label, href: "#" })),
  },
  {
    label: "Our Work",
    href: "#",
    items: [
      "GR8 Global",
      "Global Tech Hiring Company",
      "Tightknit",
      "Jam3",
      "Metz & Associates",
      "Aster",
      "Plentiful",
      "iuSports",
    ].map((label) => ({ label, href: "#" })),
  },
  {
    label: "About",
    href: "/about-us/company",
    items: [
      { label: "Company", href: "/about-us/company" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
];

export const footer = {
  services: [
    "Tech Talent Solutions",
    "Technical Recruitment",
    "IT Staff Augmentation",
    "Dedicated Teams",
    "IT Outsourcing",
  ],
  industries: ["Fintech", "Sports", "Healthcare", "Professional Services"],
  stories: [
    "GR8 Global",
    "Global Tech Hiring Company",
    "Tightknit",
    "Jam3",
    "Metz & Associates",
    "Aster",
    "Plentiful",
    "iuSports",
  ],
  company: ["Company", "Careers", "Blog", "Resources"],
};
