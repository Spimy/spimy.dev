export type GearGroup = 'weapon' | 'artifact' | 'armour';

export interface Gear {
  /** Used in the HTML ids, so lowercase letters, numbers and dashes only */
  id: string;
  name: string;
  /** Two or three letters shown in the icon square */
  abbr: string;
  group: GearGroup;
  kind: string;
  blurb: string;
  note?: string;
  /**
   * Equipped is automatic: an item is equipped when a loadout lists it.
   * "active" = I still use it, but it is not in a loadout.
   * "stash" = used before, not lately.
   * "locked" = still learning it, so no experience claims and no projects.
   */
  status?: 'active' | 'stash' | 'locked';
  /** Shown on a locked item as the "unlock requirement". */
  unlock?: string;
  /**
   * Project tags (exactly as written in src/content/projects/*.md) that count
   * as "connected inventory"
   */
  tags?: string[];
}

export const groups: {
  id: GearGroup;
  title: string;
  subtitle: string;
  slotName: string;
}[] = [
  {
    id: 'weapon',
    title: 'Weapons',
    subtitle: 'Languages & runtimes',
    slotName: 'Weapon',
  },
  {
    id: 'artifact',
    title: 'Artifacts',
    subtitle: 'Frameworks & libraries',
    slotName: 'Artifact',
  },
  {
    id: 'armour',
    title: 'Armour & relics',
    subtitle: 'Ops & data',
    slotName: 'Armour',
  },
];

export interface Loadout {
  /** Used in the HTML ids: lowercase letters, numbers and dashes only */
  id: string;
  /** Tab label. */
  label: string;
  /** Each id must exist in `gear` below. `slot` is the small caption. */
  slots: { id: string; slot: string }[];
}

export const loadouts: Loadout[] = [
  {
    id: 'web',
    label: 'Web Stack',
    slots: [
      { id: 'typescript', slot: 'Main weapon' },
      { id: 'sveltekit', slot: 'Artifact' },
      { id: 'nodejs', slot: 'Sub weapon' },
      { id: 'postgresql', slot: 'Relic' },
      { id: 'django', slot: 'Artifact' },
    ],
  },
  {
    id: 'server',
    label: 'Server Infra',
    slots: [
      { id: 'docker', slot: 'Armour' },
      { id: 'traefik', slot: 'Accessory' },
      { id: 'git', slot: 'Accessory' },
      { id: 'wireguard', slot: 'Accessory' },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    slots: [
      { id: 'typescript', slot: 'Main weapon' },
      { id: 'nodejs', slot: 'Sub weapon' },
      { id: 'sveltekit', slot: 'Artifact' },
      { id: 'capacitor', slot: 'Artifact' },
      { id: 'docker', slot: 'Armour' },
    ],
  },
];

export const gear: Gear[] = [
  // ---- Weapons: languages & runtimes ----
  {
    id: 'typescript',
    name: 'TypeScript',
    abbr: 'TS',
    group: 'weapon',
    kind: 'Language',
    blurb: 'JavaScript with types checked before the code runs.',
    note: 'I moved over from JavaScript in 2021.',
    tags: ['TypeScript'],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    abbr: 'JS',
    group: 'weapon',
    kind: 'Language',
    blurb: 'The language of the browser, and of Node.js on the server.',
    note: 'I wrote Discord bots in plain JavaScript from 2017, before moving to TypeScript.',
    status: 'active',
    tags: ['JavaScript'],
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    abbr: 'ND',
    group: 'weapon',
    kind: 'Runtime',
    blurb: 'JavaScript on the server.',
    note: 'My back end for the past couple of years, usually with Express, TypeScript and Drizzle.',
    tags: ['Node.js'],
  },
  {
    id: 'java',
    name: 'Java',
    abbr: 'JV',
    group: 'weapon',
    kind: 'Language',
    blurb: 'Statically typed, object-oriented language.',
    note: 'My first programming language, from making a Spigot plugin in 2016.',
    status: 'active',
    tags: ['Java'],
  },
  {
    id: 'python',
    name: 'Python',
    abbr: 'PY',
    group: 'weapon',
    kind: 'Language',
    blurb: 'General-purpose language, and the one Django is written in.',
    status: 'active',
    tags: ['Python'],
  },
  {
    id: 'php',
    name: 'PHP',
    abbr: 'PH',
    group: 'weapon',
    kind: 'Language',
    blurb: 'Server-side language behind much of the web.',
    note: 'Used on the Laravel application during my three-month internship.',
    status: 'active',
    tags: ['PHP'],
  },
  {
    id: 'rust',
    name: 'Rust',
    abbr: 'RS',
    group: 'weapon',
    kind: 'Language',
    blurb: 'Memory-safe systems language prioritising speed and thread safety.',
    status: 'locked',
    unlock:
      'Currently in the active research phase: I am still learning it. Check back later.',
  },
  {
    id: 'scala',
    name: 'Scala',
    abbr: 'SC',
    group: 'weapon',
    kind: 'Language',
    blurb:
      'Language that mixes object-oriented and functional styles on the JVM.',
    status: 'stash',
    tags: ['Scala'],
  },
  {
    id: 'html',
    name: 'HTML',
    abbr: 'HT',
    group: 'weapon',
    kind: 'Markup',
    blurb: 'Markup for web pages.',
    note: 'Learned in 2017, starting from Bootstrap Studio and working down to the HTML underneath.',
    status: 'active',
    tags: ['HTML'],
  },
  {
    id: 'css',
    name: 'CSS',
    abbr: 'CS',
    group: 'weapon',
    kind: 'Styles',
    blurb: 'Styling for web pages.',
    note: 'Learned in 2017 alongside HTML, starting from Bootstrap Studio and working down to the CSS underneath.',
    status: 'active',
    tags: ['CSS'],
  },

  // ---- Artifacts: frameworks & libraries ----
  {
    id: 'sveltekit',
    name: 'SvelteKit',
    abbr: 'SV',
    group: 'artifact',
    kind: 'Framework',
    blurb:
      'Svelte’s full-stack framework. Svelte compiles components at build time.',
    note: 'Learned in 2023 to rebuild my portfolio. It is the framework I reach for first.',
    tags: ['SvelteKit'],
  },
  {
    id: 'django',
    name: 'Django',
    abbr: 'DJ',
    group: 'artifact',
    kind: 'Framework',
    blurb: 'Python web framework with the ORM, admin and auth built in.',
    note: 'Where I started full stack in 2020. I used it with Django REST framework on Subtitles and have recently gone back to it.',
    tags: ['Django'],
  },
  {
    id: 'vue',
    name: 'Vue',
    abbr: 'VU',
    group: 'artifact',
    kind: 'Framework',
    blurb: 'Component framework with HTML-like templates.',
    note: 'Learned in 2020 when plain JavaScript on top of Django got too limiting, and chosen over React for its template syntax.',
    status: 'active',
    tags: ['Vue'],
  },
  {
    id: 'nuxt',
    name: 'Nuxt 3',
    abbr: 'NX',
    group: 'artifact',
    kind: 'Framework',
    blurb: 'Vue’s full-stack framework, with server-side rendering.',
    note: 'Used for my first portfolio, for the server-side rendering and contact forms.',
    status: 'stash',
  },
  {
    id: 'angular',
    name: 'Angular',
    abbr: 'AN',
    group: 'artifact',
    kind: 'Framework',
    blurb: 'Opinionated framework for large single-page apps.',
    note: 'Learned for KitaHack 2024 and not used since.',
    status: 'stash',
    tags: ['Angular'],
  },
  {
    id: 'express',
    name: 'Express',
    abbr: 'EX',
    group: 'artifact',
    kind: 'Framework',
    blurb: 'Minimal routing and middleware for Node.js.',
    note: 'Paired with Node.js and TypeScript on the back end.',
    status: 'active',
    tags: ['Express'],
  },
  {
    id: 'drizzle',
    name: 'Drizzle',
    abbr: 'DR',
    group: 'artifact',
    kind: 'ORM',
    blurb: 'TypeScript ORM and query builder.',
    note: 'The ORM I use with Node.js, Express and TypeScript.',
    status: 'active',
  },
  {
    id: 'laravel',
    name: 'Laravel',
    abbr: 'LV',
    group: 'artifact',
    kind: 'Framework',
    blurb: 'PHP web framework.',
    note: 'The framework behind the application I worked on during my internship.',
    status: 'stash',
  },
  {
    id: 'astro',
    name: 'Astro',
    abbr: 'AS',
    group: 'artifact',
    kind: 'Framework',
    blurb: 'Builds mostly static pages and ships little JavaScript.',
    note: 'This portfolio is built with it.',
    status: 'active',
  },
  {
    id: 'capacitor',
    name: 'Capacitor',
    abbr: 'CP',
    group: 'artifact',
    kind: 'Native wrapper',
    blurb: 'Wraps a web app as a native mobile app.',
    note: 'It let me turn a SvelteKit and TypeScript app into a mobile app without learning a separate mobile stack, and I have shipped one that way, with Docker handling the deployment side.',
    tags: ['Capacitor'],
  },
  {
    id: 'tailwind',
    name: 'Tailwind',
    abbr: 'TW',
    group: 'artifact',
    kind: 'Styling',
    blurb: 'Utility-first CSS framework.',
    status: 'stash',
    tags: ['Tailwind'],
  },
  {
    id: 'scss',
    name: 'SCSS',
    abbr: 'SS',
    group: 'artifact',
    kind: 'Styling',
    blurb: 'CSS with variables, nesting and mixins.',
    status: 'stash',
    tags: ['SCSS'],
  },
  {
    id: 'discordjs',
    name: 'discord.js',
    abbr: 'DC',
    group: 'artifact',
    kind: 'Library',
    blurb: 'Library for building Discord bots in Node.js.',
    note: 'How I started building bots in 2017–18, and the base of my first freelance work.',
    status: 'stash',
    tags: ['discord.js'],
  },
  {
    id: 'spigot',
    name: 'Spigot',
    abbr: 'SP',
    group: 'artifact',
    kind: 'Platform',
    blurb: 'Server software and API for Minecraft plugins.',
    note: 'Where I started in 2016. I have published four plugins on SpigotMC.',
    status: 'stash',
    tags: ['Spigot'],
  },

  // ---- Armour & relics: ops & data ----
  {
    id: 'docker',
    name: 'Docker',
    abbr: 'DK',
    group: 'armour',
    kind: 'Containers',
    blurb: 'Packages an app and its dependencies into a container.',
    note: 'Learned in 2023–24 and used to deploy my projects ever since. This year I started developing inside dev containers.',
    tags: ['Docker'],
  },
  {
    id: 'traefik',
    name: 'Traefik',
    abbr: 'TR',
    group: 'armour',
    kind: 'Reverse proxy',
    blurb: 'Routes incoming requests to the right container.',
    note: 'Now sits in front of my containers, including older projects like Recipe Roots (Apache in its own container) and the self-hosted services on my home server.',
  },
  {
    id: 'wireguard',
    name: 'WireGuard',
    abbr: 'WG',
    group: 'armour',
    kind: 'VPN',
    blurb: 'Lightweight VPN that creates encrypted tunnels between machines.',
    note: 'I use it through my VPS for private access to dashboards, and for a separate tunnel that lets me connect remotely to my home server.',
  },
  {
    id: 'git',
    name: 'Git',
    abbr: 'GT',
    group: 'armour',
    kind: 'Version control',
    blurb: 'Tracks changes to code.',
    note: 'Every project of mine lives in it, and it is what drives my CI/CD: a push is what kicks off the automated builds and deploys in GitHub Actions.',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    abbr: 'MG',
    group: 'armour',
    kind: 'Database',
    blurb: 'Document database that stores JSON-like records.',
    note: 'My go-to NoSQL database but nowadays I prefer relational databases. I still use it for some smaller projects like Discord bots.',
    status: 'stash',
    tags: ['MongoDB'],
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    abbr: 'PG',
    group: 'armour',
    kind: 'Database',
    blurb: 'Open-source relational database.',
    note: 'My usual choice of database.',
    tags: ['PostgreSQL'],
  },
  {
    id: 'mysql',
    name: 'MySQL',
    abbr: 'MY',
    group: 'armour',
    kind: 'Database',
    blurb: 'Relational database.',
    note: 'Part of the stack I worked on during my internship.',
    status: 'active',
    tags: ['MySQL'],
  },
  {
    id: 'mariadb',
    name: 'MariaDB',
    abbr: 'MD',
    group: 'armour',
    kind: 'Database',
    blurb: 'Open-source relational database, forked from MySQL.',
    note: 'What I use when a project needs a MySQL-compatible database, such as an assignment.',
    status: 'active',
    tags: ['MariaDB'],
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    abbr: 'SQ',
    group: 'armour',
    kind: 'Database',
    blurb: 'Relational database stored in a single file.',
    note: 'Used for small projects or when a lightweight database is needed. Also used when I first started learning Django, because it is the default database for new Django projects.',
    status: 'active',
    tags: ['SQLite'],
  },
  {
    id: 'supabase',
    name: 'Supabase',
    abbr: 'SB',
    group: 'armour',
    kind: 'Backend platform',
    blurb: 'Hosted Postgres database with auth and storage.',
    note: 'Nowadays I only use it for very small projects because I prefer self-hosting everything with Docker.',
    status: 'active',
    tags: ['Supabase'],
  },
  {
    id: 'firebase',
    name: 'Firebase',
    abbr: 'FB',
    group: 'armour',
    kind: 'Backend platform',
    blurb: 'Google’s hosted database, auth and hosting.',
    note: 'Used at KitaHack 2024.',
    status: 'stash',
    tags: ['Firebase'],
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    abbr: 'GQ',
    group: 'armour',
    kind: 'API query language',
    blurb: 'Lets clients ask an API for exactly the fields they need.',
    note: 'Believe it or not, this portfolio uses GraphQL to fetch data from GitHub and AniList APIs for the home page but I generally prefer REST APIs for my own projects.',
    status: 'stash',
    tags: ['GraphQL'],
  },
  {
    id: 'apache',
    name: 'Apache',
    abbr: 'AP',
    group: 'armour',
    kind: 'Web server',
    blurb: 'Long-running, module-based web server.',
    note: 'Part of the stack I worked on during my internship. My older projects preferred using Nginx, but I have since moved to Traefik for my own projects.',
    status: 'stash',
    tags: ['Apache'],
  },
  {
    id: 'nginx',
    name: 'Nginx',
    abbr: 'NG',
    group: 'armour',
    kind: 'Web server',
    blurb: 'Web server and reverse proxy.',
    note: 'What my older projects used in front of their apps, before I moved to Traefik.',
    status: 'stash',
    tags: ['Nginx'],
  },
];
