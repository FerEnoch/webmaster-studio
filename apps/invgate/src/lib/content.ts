const u = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export type MenuItem = { title: string; text: string; tone: string };

export const menu: { label: string; columns: { heading: string; items: MenuItem[] }[] }[] = [
  {
    label: "Products",
    columns: [
      {
        heading: "Platform",
        items: [
          { title: "InvGate Service Management", text: "ITSM and ESM, simple and scalable.", tone: "#6172f3" },
          { title: "InvGate Asset Management", text: "Full asset lifecycle in one place.", tone: "#4cd4a8" },
          { title: "AI Hub", text: "AI features built into every workflow.", tone: "#a78bfa" },
        ],
      },
      {
        heading: "Explore",
        items: [
          { title: "Integrations", text: "Connect your current tech stack.", tone: "#f59e0b" },
          { title: "Security", text: "Enterprise-grade by design.", tone: "#38bdf8" },
          { title: "What's new", text: "Latest releases and features.", tone: "#f472b6" },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    columns: [
      {
        heading: "By need",
        items: [
          { title: "Service desk", text: "Get out of survival mode.", tone: "#6172f3" },
          { title: "IT spend", text: "Cut the licenses nobody uses.", tone: "#4cd4a8" },
          { title: "Audits & compliance", text: "Pass audits without panic.", tone: "#f59e0b" },
        ],
      },
      {
        heading: "By industry",
        items: [
          { title: "Banking", text: "Unified support across departments.", tone: "#38bdf8" },
          { title: "Retail", text: "Agile service for every store.", tone: "#f472b6" },
          { title: "Manufacturing", text: "Visibility over every asset.", tone: "#a78bfa" },
        ],
      },
    ],
  },
  {
    label: "Company",
    columns: [
      {
        heading: "About",
        items: [
          { title: "About us", text: "Our story and mission.", tone: "#6172f3" },
          { title: "Customer Experience", text: "A team dedicated to your success.", tone: "#4cd4a8" },
          { title: "Partners", text: "Grow with InvGate.", tone: "#f59e0b" },
        ],
      },
    ],
  },
  {
    label: "Resources",
    columns: [
      {
        heading: "Learn",
        items: [
          { title: "Resources Hub", text: "Guides, eBooks and templates.", tone: "#6172f3" },
          { title: "Ticket Volume Podcast", text: "Conversations about IT.", tone: "#a78bfa" },
          { title: "Blog", text: "News and ITSM culture.", tone: "#38bdf8" },
        ],
      },
    ],
  },
];

export const news = [
  { title: "ENVISION’26 recap: AI, IT’s new mandate, and the human edge", img: u("1540575467063-178a50c2df87", 800) },
  { title: "11 new features: InvGate's ENVISION'26 product launches", img: u("1518770660439-4636190af475", 800) },
  { title: "Join InvGate at Gartner® IT Symposium/Xpo™ 2026", img: u("1505373877841-8d25f7d46678", 800) },
  { title: "Ariel Gesto in Forbes: AI without a source of truth is just confident guessing", img: u("1475721027785-f74eccf877e2", 800) },
];

export const logos = ["Alaskan Copper", "KPMG", "NASA", "pwc", "Arcos Dorados", "motorola", "Unilever", "Toyota", "Bayer", "Telefónica"];

export const useCases = [
  "Get your service desk out of survival mode",
  "Deploy AI on operations you actually control",
  "Stop losing money when assets expire unnoticed",
  "Cut the licenses nobody uses",
  "Pass your next audit without the panic",
];

export const aiRows = [
  ["AI-improved responses", "Knowledge article generation", "Ticket summarization", "Expert collaborator suggestion", "Smart request escalation", "Solution recommendation"],
  ["Major incident detection", "Common problem detection", "Predictive risk and impact analysis", "Keyword generation", "Virtual Service Agent", "Predict Estimated Time to Resolution"],
  ["Sentiment Analysis", "Change Response Tone", "AI Smart Search", "Smart Recommendations", "Atlas", "CMDB Auto-Mapping Suggestions"],
];

export const integrations = [
  ["Microsoft Teams", "Google Cloud", "Office 365", "OpenAI", "AnyDesk", "Slack", "Intune", "Google Suite", "WhatsApp"],
  ["Google Workspace", "Salesforce", "Jamf", "Outlook", "TeamViewer", "Zapier", "Jira", "Okta", "AWS"],
  ["SAP", "Azure", "Workday", "Google Calendar", "VMware", "FileWave", "Lansweeper", "Dell", "RealVNC"],
];

export const testimonials = [
  {
    industry: "Banking",
    company: "Peoples Bank",
    quote:
      "We are one full support department now, which is amazing. Even though it's spanning so many groups and teams, InvGate Service Management is one place to go for help.",
    author: "Megan Engels",
    role: "IT Service Desk Manager, at Peoples Bank",
    img: u("1541354329998-f4d9a9f9297f", 1800),
  },
  {
    industry: "Retail",
    company: "Farmacity",
    quote:
      "We are transforming the way we work to become more agile. InvGate Service Management is accompanying us in this transformation process.",
    author: "Marcos Aste",
    role: "Level One Support Efficiency Leader, at Farmacity",
    img: u("1556742049-0cfed4f6a45d", 1800),
  },
  {
    industry: "Manufacturing",
    company: "Mirgor",
    quote:
      "With InvGate Asset Management we reduced 80% of the time spent on Operational Management. It has been a paradigm shift that has helped us make more agile and strategic decisions.",
    author: "Ayelen Rodriguez",
    role: "Head of Support and Microinformatics, at Mirgor",
    img: u("1565043666747-69f6646db940", 1800),
  },
  {
    industry: "Utilities",
    company: "Camuzzi",
    quote:
      "With InvGate Asset Management we automated all key Asset Management processes, saving +1000 hours of work per year for our IT team.",
    author: "Mariano Pereira",
    role: "IT Services Coordinator, at Camuzzi",
    img: u("1473341304170-971dccb5ac1e", 1800),
  },
];

export const resources = [
  { kind: "Whitepapers & eBooks", title: "AI adoption in ITSM: A 3-layered framework", tone: ["#312e81", "#6172f3"] },
  { kind: "Courses", title: "NEW: Introduction to ESM", tone: ["#064e3b", "#4cd4a8"] },
  { kind: "Courses", title: "Introduction to IT Asset Lifecycle Management", tone: ["#1e3a8a", "#38bdf8"] },
  { kind: "Guides", title: "What is ITSM?", tone: ["#4c1d95", "#a78bfa"] },
  { kind: "Templates & checklists", title: "What's your AI maturity level? Take the quiz!", tone: ["#831843", "#f472b6"] },
  { kind: "Templates & checklists", title: "Service Desk SOP", tone: ["#78350f", "#f59e0b"] },
  { kind: "Whitepapers & eBooks", title: "The CFO’s Guide to IT Asset Management", tone: ["#18181b", "#71717a"] },
  { kind: "Guides", title: "What is ITAM?", tone: ["#0c4a6e", "#22d3ee"] },
  { kind: "Guides", title: "How to set up an end-to-end hardware refresh strategy", tone: ["#14532d", "#84cc16"] },
  { kind: "Whitepapers & eBooks", title: "Unlocking The Future of IT", tone: ["#312e81", "#c084fc"] },
];

export const teamImg = u("1522071820081-009f0129c71c", 1200);
export const useCasesImg = u("1451187580459-43490279c0fa", 2000);

export const footer = [
  { heading: "Products", links: ["Service Management", "Asset Management", "AI Hub", "Integrations", "Pricing"] },
  { heading: "Solutions", links: ["Service desk", "Enterprise Service Management", "IT Asset Management", "Software licenses", "Compliance"] },
  { heading: "Company", links: ["About us", "Customer Experience", "Partners", "Careers", "Contact"] },
  { heading: "Resources", links: ["Resources Hub", "Blog", "Podcast", "Case studies", "Help Center"] },
];
