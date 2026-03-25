/**
 * Mock data for Ajibola Akelebe Portfolio.
 * Replaced by backend API calls; shapes should match docs/contracts.md.
 *
 * @typedef {Object} PersonalInfo
 * @property {string} name
 * @property {string} tagline
 * @property {string} taglineSuffix
 * @property {string} description
 * @property {string} role
 * @property {string} email
 * @property {string} location
 * @property {string} availability
 * @property {{ github?: string, twitter?: string, linkedin?: string, whatsapp?: string }} social
 *
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} [slug]
 * @property {string} name
 * @property {string} category
 * @property {string} [label]
 * @property {string} description
 * @property {string[]} tags
 * @property {'dev'|'design'} [type]
 * @property {boolean} [featured]
 * @property {string} [liveUrl]
 * @property {string} [githubUrl]
 * @property {string} [problem]
 * @property {string} [solution]
 * @property {string} [role]
 * @property {string} [duration]
 * @property {string} [year]
 * @property {Array<string|{url:string}>} [screenshots]
 * @property {{ name: string, role: string }[]} [techDetails]
 *
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} name
 * @property {string} duration
 * @property {string} price
 * @property {string} badge
 * @property {string} description
 * @property {string[]} [curriculum]
 *
 * @typedef {Object} BlogPost
 * @property {string} id
 * @property {string} [slug]
 * @property {string} title
 * @property {string} date
 * @property {string[]} tags
 * @property {string} category
 * @property {string} excerpt
 * @property {string} body
 * @property {string} [readTime]
 *
 * @typedef {Object} GalleryItem
 * @property {string} id
 * @property {string} title
 * @property {string} type
 * @property {string} color
 */

export const personalInfo = {
    name: "Ajibola Akelebe",
    tagline: "Design & Engineering,",
    taglineSuffix: "No boundaries.",
    description: "Developer and designer based in Nigeria, building for a global audience. I teach what I know and ship what I learn.",
    role: "// FULL-STACK · UI DESIGN · EDUCATOR · CREATOR",
    email: "hello@ajibolagenius.pro",
    location: "Nigeria",
    availability: "Available for projects",
    social: {
        github: "https://github.com/ajibolagenius",
        twitter: "https://twitter.com/ajibolagenius",
        whatsapp: "https://wa.me/2348063281921"
    }
};

/** Ticker strip — aligned with design system stack (Three.js, GSAP, Framer Motion) and brand */
export const tickerItems = [
    "Afrofuturism × Dark Cosmic",
    "Design + Engineering",
    "Three.js · GSAP · Framer Motion",
    "Next.js · React · Tailwind",
    "DON_GENIUS",
    "From Nigeria, For the World",
    "9 Courses · 5 Projects · 1 Gallery"
];

/** Design-system.html Tone of Voice: 2-sentence body for About snapshot on Home */
export const homeAboutSnapshot =
    "Developer and designer based in Nigeria, building for a global audience. I teach what I know and ship what I learn.";

export const aboutData = {
    headline: "I build things that work and things that feel right.",
    body: "Developer and designer based in Nigeria, building for a global audience. I teach what I know and ship what I learn. My work sits at the intersection of African identity and modern technology — fusing cultural depth with technical precision.",
    stats: [
        { label: "Projects Shipped", value: "5+" },
        { label: "Courses Created", value: "9" },
        { label: "Students Taught", value: "300+" },
        { label: "Years Experience", value: "6+" }
    ]
};

export const projects = [
    {
        id: "rant",
        name: "Rant — Anonymous Expression",
        category: "Platform · Social",
        label: "RANT",
        description: "A modern, anonymous social platform where users express freely in a safe environment.",
        tags: ["Next.js", "Supabase", "Tailwind"],
        type: "dev",
        featured: true,
        liveUrl: "#",
        githubUrl: "#",
        problem: "People need a safe space to express frustration, share controversial opinions, and vent without the social consequences of being identified. Existing platforms tie every post to an identity, creating self-censorship.",
        solution: "Rant provides a fully anonymous social experience where users can post, react, and engage without accounts. The platform uses content moderation AI to keep things safe while maintaining anonymity. A unique 'heat map' shows trending topics across Nigerian cities.",
        role: "Lead Developer & Designer",
        duration: "3 months",
        year: "2023",
        screenshots: [],
        techDetails: [
            { name: "Next.js 14", role: "Framework — App Router, RSC, API routes" },
            { name: "Supabase", role: "Backend — Auth, Realtime DB, Edge Functions" },
            { name: "Tailwind CSS", role: "Styling — Utility-first, custom design tokens" },
            { name: "Vercel", role: "Deployment — Edge functions, analytics" }
        ]
    },
    {
        id: "narvo",
        name: "Narvo — News that Speaks",
        category: "Mobile · Voice · News",
        label: "NARVO",
        description: "Voice-first news platform aggregating and reading global news in localised Nigerian voices.",
        tags: ["React Native", "TTS API"],
        type: "dev",
        featured: true,
        liveUrl: "#",
        githubUrl: "#",
        problem: "Many Nigerians consume news on the go — commuting, working, cooking. Reading articles on small screens is inconvenient. Existing TTS solutions sound robotic and use Western accents that feel disconnected.",
        solution: "Narvo aggregates news from trusted Nigerian and global sources, then reads them aloud using custom TTS voices trained on Nigerian English accents. Users can create playlists, bookmark stories, and listen offline.",
        role: "Full-Stack Developer",
        duration: "4 months",
        year: "2023",
        screenshots: [],
        techDetails: [
            { name: "React Native", role: "Mobile — Cross-platform iOS & Android" },
            { name: "TTS API", role: "Voice — Custom Nigerian accent models" },
            { name: "Node.js", role: "Backend — News aggregation & caching" },
            { name: "MongoDB", role: "Database — User preferences, bookmarks" }
        ]
    },
    {
        id: "corpssmart",
        name: "CorpsMart — NYSC Made Easy",
        category: "Web App · Utility",
        label: "CORPSSMART",
        description: "A comprehensive toolkit for Nigerian corps members — PPA finder, marketplace, and community hub.",
        tags: ["React", "Node.js", "MongoDB"],
        type: "dev",
        featured: true,
        liveUrl: "#",
        githubUrl: "#",
        problem: "NYSC corps members face a disorganized service year — finding a Place of Primary Assignment (PPA), buying/selling camp items, and connecting with batch mates across states is fragmented across WhatsApp groups and word of mouth.",
        solution: "CorpsMart centralises everything a corps member needs: a PPA directory with reviews, a marketplace for camp supplies, batch community forums, and an interactive map of orientation camps. The platform serves over 300,000 annual corps members.",
        role: "Lead Developer",
        duration: "5 months",
        year: "2023",
        screenshots: [],
        techDetails: [
            { name: "React", role: "Frontend — SPA with dynamic routing" },
            { name: "Node.js", role: "Backend — REST API, authentication" },
            { name: "MongoDB", role: "Database — Users, listings, reviews" },
            { name: "Cloudinary", role: "Media — Image uploads & optimization" }
        ]
    },
    {
        id: "portfolio-ds",
        name: "Portfolio Design System",
        category: "Design · System",
        label: "DESIGN SYSTEM",
        description: "A comprehensive design system fusing Afrofuturism with dark cosmic aesthetics for personal branding.",
        tags: ["Figma", "CSS", "Design Tokens"],
        type: "design",
        featured: false,
        liveUrl: "#",
        githubUrl: "#",
        problem: "Personal branding in tech often defaults to generic templates that fail to convey cultural identity. I needed a design language that was unmistakably mine — rooted in African heritage yet forward-looking.",
        solution: "Created a complete design system with 8 chapters covering colour, typography, spacing, components, motion, and architecture. The system fuses Kente geometric patterns, Adire textile motifs, and cosmic depth aesthetics into a cohesive visual language.",
        role: "Designer",
        duration: "2 months",
        year: "2024",
        screenshots: [],
        techDetails: [
            { name: "Figma", role: "Design — Components, auto-layout, variants" },
            { name: "CSS Variables", role: "Tokens — Colors, spacing, typography" },
            { name: "HTML/CSS", role: "Documentation — Living style guide" }
        ]
    },
    {
        id: "adire-visuals",
        name: "Adire Visual Identity",
        category: "3D · Branding",
        label: "ADIRE",
        description: "Three.js powered generative art exploring Adire textile patterns as interactive 3D geometry.",
        tags: ["Three.js", "GLSL", "WebGL"],
        type: "design",
        featured: false,
        liveUrl: "#",
        githubUrl: "#",
        problem: "Traditional Adire textile patterns are 2D and static. I wanted to explore how these beautiful geometric patterns could live in 3D space and respond to user interaction.",
        solution: "Built a generative art system using Three.js and custom GLSL shaders that maps Adire patterns onto 3D geometries. The patterns animate, respond to mouse movement, and can be exported as high-resolution prints.",
        role: "Creative Developer",
        duration: "1 month",
        year: "2024",
        screenshots: [],
        techDetails: [
            { name: "Three.js", role: "3D — Scene, camera, renderer" },
            { name: "GLSL", role: "Shaders — Custom pattern generation" },
            { name: "WebGL", role: "Rendering — GPU-accelerated graphics" },
            { name: "dat.GUI", role: "Controls — Real-time parameter tweaking" }
        ]
    }
];

export const courses = [
    {
        id: "fullstack",
        name: "Full-Stack Web Development",
        duration: "10 Weeks · Remote · Anytime",
        price: "₦350K",
        badge: "Full-Stack",
        description: "Master frontend, backend, databases, and deployment from scratch. Build 5 real projects.",
        curriculum: ["HTML/CSS/JS Fundamentals", "React & Component Architecture", "Node.js & Express APIs", "MongoDB & Database Design", "Authentication & Security", "Deployment & DevOps"]
    },
    {
        id: "ui-design",
        name: "UI Design & Prototyping",
        duration: "4 Weeks · Remote · Anytime",
        price: "₦200K",
        badge: "Design",
        description: "Learn design thinking, Figma mastery, and prototyping workflows.",
        curriculum: ["Design Principles & Theory", "Figma Deep Dive", "Component Systems", "Prototyping & Handoff"]
    },
    {
        id: "react",
        name: "React & Next.js Mastery",
        duration: "8 Weeks · Remote · Anytime",
        price: "₦300K",
        badge: "Frontend",
        description: "Deep dive into React, Next.js, state management, and performance.",
        curriculum: ["React Fundamentals", "Hooks & State Management", "Next.js App Router", "Server Components", "API Routes & Data Fetching", "Performance Optimization"]
    },
    {
        id: "python",
        name: "Python for Beginners",
        duration: "6 Weeks · Remote · Anytime",
        price: "₦180K",
        badge: "Backend",
        description: "Start your coding journey with Python fundamentals and real projects.",
        curriculum: ["Python Basics & Syntax", "Data Structures", "Functions & OOP", "File Handling", "Web Scraping", "Final Project"]
    },
    {
        id: "mobile",
        name: "React Native Mobile Dev",
        duration: "8 Weeks · Remote · Anytime",
        price: "₦320K",
        badge: "Mobile",
        description: "Build cross-platform mobile applications with React Native.",
        curriculum: ["React Native Setup", "Core Components", "Navigation", "State & APIs", "Native Modules", "App Store Deployment"]
    },
    {
        id: "threejs",
        name: "Creative Coding with Three.js",
        duration: "6 Weeks · Remote · Anytime",
        price: "₦280K",
        badge: "3D",
        description: "Learn WebGL, shaders, and 3D web experiences with Three.js.",
        curriculum: ["3D Fundamentals", "Three.js Basics", "Geometries & Materials", "Lighting & Shadows", "Custom Shaders", "Portfolio Piece"]
    },
    {
        id: "javascript",
        name: "JavaScript Deep Dive",
        duration: "6 Weeks · Remote · Anytime",
        price: "₦220K",
        badge: "Core",
        description: "Master JavaScript from closures to async patterns and ES6+ features.",
        curriculum: ["JS Engine & Execution Context", "Closures & Scope", "Prototypes & Classes", "Async Patterns", "DOM Manipulation", "Modern ES6+"]
    },
    {
        id: "tailwind",
        name: "Tailwind CSS Masterclass",
        duration: "3 Weeks · Remote · Anytime",
        price: "₦120K",
        badge: "CSS",
        description: "Build beautiful, responsive interfaces at speed with Tailwind CSS.",
        curriculum: ["Utility-First Approach", "Responsive Design", "Custom Configuration", "Component Patterns"]
    },
    {
        id: "git",
        name: "Git & GitHub for Teams",
        duration: "2 Weeks · Remote · Anytime",
        price: "₦100K",
        badge: "DevOps",
        description: "Version control, branching strategies, and collaborative workflows.",
        curriculum: ["Git Fundamentals", "Branching & Merging", "GitHub Workflows", "CI/CD Basics"]
    }
];

export const timeline = [
    {
        year: "2024 — Present",
        title: "Lead Developer & Designer",
        body: "Building full-stack products and teaching 9 programming courses remotely across Nigeria and beyond.",
        accent: "sungold"
    },
    {
        year: "2023",
        title: "Shipped: CorpsMart, Narvo, Rant",
        body: "Three production-grade applications solving real problems in the Nigerian market.",
        accent: "nebula"
    },
    {
        year: "2022",
        title: "Started Teaching & Freelancing",
        body: "Began remote teaching career while taking on freelance web development and design projects.",
        accent: "stardust"
    },
    {
        year: "2021",
        title: "Deep Dive into Full-Stack",
        body: "Focused on mastering React, Node.js, and modern web development frameworks.",
        accent: "terracotta"
    }
];

export const skills = [
    { name: "React / Next.js", level: 95 },
    { name: "Node.js / Express", level: 88 },
    { name: "TypeScript", level: 85 },
    { name: "Three.js / WebGL", level: 78 },
    { name: "UI/UX Design", level: 90 },
    { name: "Python", level: 80 },
    { name: "MongoDB / Supabase", level: 85 },
    { name: "Tailwind CSS", level: 95 }
];

export const testimonials = [
    {
        name: "Adebayo Ogunlesi",
        role: "Student — Full-Stack Course",
        text: "Ajibola's teaching style is unlike anything I've experienced. He breaks down complex concepts into digestible pieces. I went from zero to deploying my first app in 8 weeks."
    },
    {
        name: "Chioma Nwosu",
        role: "Client — Web Development",
        text: "Working with Ajibola was transformative. He didn't just build a website; he crafted an experience that perfectly captured our brand identity."
    },
    {
        name: "Tunde Bakare",
        role: "Student — React Course",
        text: "The best investment I made in my career. Ajibola's mentorship and hands-on approach made learning React genuinely enjoyable and practical."
    },
    {
        name: "Folake Adeyemi",
        role: "Student — UI Design Course",
        text: "Before this course, I had no design background. Now I'm confidently creating interfaces in Figma and landing freelance design gigs."
    },
    {
        name: "Emeka Obi",
        role: "Client — Mobile App",
        text: "Ajibola delivered a polished React Native app ahead of schedule. His attention to detail and understanding of user experience is exceptional."
    }
];

export { navLinks } from './defaultNav.js';

export const blogPosts = [
    {
        id: "afrofuturism-web-design",
        title: "Afrofuturism in Web Design: Building Digital Identity",
        date: "2024-12-15",
        tags: ["Design", "Culture", "Identity"],
        category: "Design",
        excerpt: "How African geometric heritage can shape the future of web design — from Kente grids to cosmic interfaces.",
        body: "The web design landscape has long been dominated by Western aesthetic conventions. Clean, minimal, Helvetica-driven. But what if we designed from a different starting point? What if the grid system was inspired by Kente cloth, and the color palette drew from terracotta and gold rather than corporate blue?\n\nThis is the thesis behind my portfolio's design system — a fusion of Afrofuturism and dark cosmic aesthetics that I call 'Cultural-First Design'. The idea is simple: every layout decision should trace back to a cultural or personal reference.\n\nThe grid is a Kente pattern. The orb is a star. The dividers carry the visual language of Adire textiles. These aren't decorative choices — they're identity statements.\n\nWhen I started building this system, I asked myself: can a portfolio website be unmistakably Nigerian without relying on clichés? No Ankara backgrounds, no green-white-green flags. Instead, I reached for the geometric precision of traditional textile patterns and mapped them onto modern CSS grid systems.\n\nThe result is a design language that feels both rooted and futuristic — African heritage meeting cosmic depth.",
        readTime: "5 min"
    },
    {
        id: "teaching-code-nigeria",
        title: "Why I Teach Code in Nigeria (And What I've Learned)",
        date: "2024-11-20",
        tags: ["Education", "Nigeria", "Career"],
        category: "Education",
        excerpt: "Reflections on teaching 200+ students remotely across Nigeria — the challenges, the breakthroughs, and why it matters.",
        body: "Teaching wasn't the plan. I was building products, freelancing, shipping code. But when a friend asked me to explain React hooks to their team, something clicked.\n\nThe Nigerian tech ecosystem is booming, but there's a massive gap between ambition and access. Thousands of aspiring individuals have the hunger but lack structured mentorship. Bootcamps are expensive. YouTube tutorials lack accountability.\n\nSo I started teaching — first informally, then structured into courses. 9 courses later, with 200+ students across multiple states, here's what I've learned:\n\n1. Start with 'why', not 'what'. Students who understand the problem before the solution retain 3x more.\n2. Projects beat theory every time. My students ship real apps from week 2.\n3. Community is everything. The groups outlast the courses.\n4. Pricing must be accessible. My courses are priced for Nigerian reality, not Silicon Valley budgets.\n\nTeaching has made me a better developer. Explaining concepts forces you to truly understand them. Every student's unique bug is a puzzle that deepens your own knowledge.",
        readTime: "4 min"
    },
    {
        id: "threejs-african-patterns",
        title: "Mapping Adire Patterns to 3D Geometry with Three.js",
        date: "2024-10-08",
        tags: ["Three.js", "Creative Coding", "Tutorial"],
        category: "Technical",
        excerpt: "A technical deep-dive into creating generative Adire textile patterns using custom GLSL shaders and Three.js.",
        body: "Adire is a traditional Yoruba textile art that uses resist-dyeing techniques to create intricate geometric patterns. These patterns — circles, lines, dots, and chevrons — have a mathematical beauty that maps perfectly to shader programming.\n\nIn this post, I'll walk through how I created a generative Adire pattern system using Three.js and custom GLSL fragment shaders.\n\nThe core idea: use mathematical functions (sin, cos, step, smoothstep) to recreate the geometric vocabulary of Adire patterns, then map them onto 3D geometry.\n\nStep 1: Analyze the patterns. Traditional Adire uses repetition, symmetry, and geometric primitives. I photographed 20+ Adire fabrics and catalogued the recurring motifs.\n\nStep 2: Translate to math. Each motif becomes a GLSL function. Circles become distance fields. Lines become step functions. The beauty of shader programming is that these simple primitives, when combined, create infinite complexity.\n\nStep 3: Map to geometry. Using UV coordinates on a sphere (R3F's Drei helpers made this trivial), the 2D patterns wrap around 3D surfaces, creating an otherworldly effect that bridges traditional craft and digital art.",
        readTime: "8 min"
    },
    {
        id: "building-rant-app",
        title: "Building Rant: Lessons from an Anonymous Social Platform",
        date: "2024-09-15",
        tags: ["Case Study", "Next.js", "Product"],
        category: "Technical",
        excerpt: "The technical and product decisions behind Rant — from real-time updates to content moderation at scale.",
        body: "Rant started as a weekend project and grew into a platform with thousands of daily posts. Here's the story of how it was built, the technical decisions that shaped it, and the lessons learned.\n\nThe core challenge: how do you build a social platform that's anonymous yet safe? Full anonymity attracts toxicity. Full moderation kills freedom. The answer was a layered approach.\n\nLayer 1: AI content moderation using Perspective API. Every post is scored before publishing. Toxic content is flagged, not blocked — giving users a chance to reconsider.\n\nLayer 2: Community reporting. Users can flag posts, and a threshold triggers review. No single user has deletion power.\n\nLayer 3: Rate limiting. Anonymous doesn't mean unlimited. IP-based rate limiting prevents spam without compromising anonymity.\n\nThe tech stack — Next.js 14 with App Router, Supabase for real-time subscriptions, and Tailwind for rapid UI iteration — was chosen for developer experience. When you're a solo developer, DX is everything.",
        readTime: "6 min"
    },
    {
        id: "design-system-from-scratch",
        title: "Creating a Design System from Scratch: My Process",
        date: "2024-08-01",
        tags: ["Design", "Process", "Tutorial"],
        category: "Design",
        excerpt: "A behind-the-scenes look at building a comprehensive design system — from concept to tokens to components.",
        body: "A design system isn't a Figma file. It's a language. It's the vocabulary and grammar that every visual element in your product speaks. Here's how I built mine from scratch.\n\nPhase 1: Concept. Before touching any tool, I defined two identity pillars: African geometric heritage (Afro Warm) and cosmic depth (Cosmic Cool). Every design decision would flow from these pillars.\n\nPhase 2: Tokens. Colors, typography, spacing, border radius — all defined as variables. I use a base-4 spacing scale (4, 8, 12, 16, 20, 24, 32...) for mathematical consistency.\n\nPhase 3: Components. Buttons, cards, badges, inputs, timeline — each component carries the design language consistently. The key rule: sharp corners everywhere (the 'Z concept').\n\nPhase 4: Documentation. A living HTML document that serves as both reference and proof of concept. The design system page itself demonstrates every component in context.",
        readTime: "7 min"
    }
];

export const galleryItems = [
    { id: "g1", title: "Rant UI — Feed View", type: "UI", color: "#E8A020" },
    { id: "g2", title: "Adire Pattern — Sphere", type: "3D", color: "#5B4FD8" },
    { id: "g3", title: "CorpsMart — Dashboard", type: "UI", color: "#1CB8D4" },
    { id: "g4", title: "Narvo — Player Screen", type: "UI", color: "#C94B2D" },
    { id: "g5", title: "Kente Grid System", type: "Graphic", color: "#E8A020" },
    { id: "g6", title: "Cosmic Orb — Hero Scene", type: "3D", color: "#8B72F0" },
    { id: "g7", title: "Design Tokens — Color Palette", type: "Graphic", color: "#A0622A" },
    { id: "g8", title: "Portfolio — Mobile Responsive", type: "UI", color: "#1CB8D4" },
    { id: "g9", title: "Adire Pattern — Flat", type: "Graphic", color: "#D63B1F" },
    { id: "g10", title: "Three.js Particle System", type: "3D", color: "#5B4FD8" },
    { id: "g11", title: "Rant — Dark Mode Cards", type: "UI", color: "#E8A020" },
    { id: "g12", title: "Generative Art — Experiment", type: "3D", color: "#8B72F0" }
];

export const cvData = {
    education: [
        {
            degree: "B.Sc. Computer Science",
            school: "University of Lagos",
            year: "2018 — 2022",
            description: "Focused on software engineering, algorithms, and human-computer interaction."
        }
    ],
    certifications: [
        "Meta Front-End Developer Professional Certificate",
        "Google UX Design Professional Certificate",
        "freeCodeCamp Full-Stack Development",
        "Three.js Journey — Bruno Simon"
    ],
    tools: [
        { name: "Figma", category: "Design" },
        { name: "VS Code", category: "Editor" },
        { name: "Git / GitHub", category: "Version Control" },
        { name: "Vercel", category: "Deployment" },
        { name: "MongoDB Atlas", category: "Database" },
        { name: "Supabase", category: "Backend" },
        { name: "Blender", category: "3D Modeling" },
        { name: "Postman", category: "API Testing" },
        { name: "Notion", category: "Project Mgmt" },
        { name: "Chrome DevTools", category: "Debugging" },
        { name: "Adobe Photoshop", category: "Graphics" },
        { name: "Terminal / Bash", category: "CLI" }
    ]
};

export const faqItems = [
    {
        question: "How are the courses delivered?",
        answer: "All courses are delivered remotely via live sessions on Google Meet/Zoom, with recorded sessions available for review. You also get access to a private WhatsApp group for ongoing support."
    },
    {
        question: "Do I need prior experience?",
        answer: "It depends on the course. 'Python for Beginners' and 'Full-Stack Web Development' start from zero. Courses like 'React & Next.js Mastery' and 'Creative Coding with Three.js' assume basic JavaScript knowledge."
    },
    {
        question: "What's the payment plan?",
        answer: "Full payment is preferred, but I offer a 2-installment plan for courses over ₦200K. Payment is via bank transfer. Contact me on WhatsApp for details."
    },
    {
        question: "Do I get a certificate?",
        answer: "Yes. Upon completing the course and final project, you receive a certificate of completion. More importantly, you'll have real projects for your portfolio."
    },
    {
        question: "Can I get a refund?",
        answer: "If you're unsatisfied within the first week, I offer a full refund. After that, refunds are handled on a case-by-case basis."
    },
    {
        question: "How do I enrol?",
        answer: "Send me a message on WhatsApp or use the contact form. I'll walk you through the process, answer any questions, and get you started."
    }
];
