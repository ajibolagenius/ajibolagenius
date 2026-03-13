# Portfolio Frontend

This is the face of the portfolio — the thing visitors see. It had to feel like it came from somewhere: Afrofuturism meets dark cosmic depth, sharp geometry, and a design system that doesn’t hide behind generic templates.

The frontend is where the story gets told: hero and ticker, work and case studies, courses, writing, gallery, CV, and contact. It talks to the API when it’s there and falls back to mock data when it’s not, so you can run it alone or with the backend.

---

### What’s in here

- **Design system** — Tokens and components live in `index.css` and the repo’s `docs/design-system.html`. Afro warm (sungold, terracotta) and cosmic cool (nebula, stardust), sharp corners, Syne / Space Mono / DM Sans.
- **Stack** — Vite, React 19, React Router, Tailwind, Framer Motion, GSAP, Three.js (R3F), Radix UI, Lucide. Chosen for speed, motion, and one coherent visual language.
- **Pages** — Home, Work, Teach, Writing, Gallery, CV, Contact, plus detail routes for projects and blog posts. Each page sets its own meta and OG so shares look right.

---

### Run it

```bash
yarn install
yarn dev
```

Dev server runs at **http://localhost:5173**. For production: `yarn build` → output in `dist/`, then `yarn preview` to serve it locally.

**Environment (optional)** — Add a `.env` in the frontend root if you need to point elsewhere:

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_BACKEND_URL` | `http://localhost:8000` | Portfolio API base URL |
| `VITE_SITE_URL` | — | Public site URL (canonical, OG) |
| `VITE_CV_PDF_URL` | — | CV PDF download URL |

Start the backend on 8000 (or set `VITE_BACKEND_URL`), then the frontend. If the API isn’t there, the app still loads using `src/data/mock.js`.

---

### Where things live

- `src/components/portfolio/` — Layout, Navbar, Footer, Hero, cards, Badge, etc.
- `src/pages/` — Route-level pages (Home, Work, Teach, Writing, Gallery, CV, Contact, BlogPost, WorkDetail).
- `src/services/api.js` — API client; `src/data/mock.js` — fallback data.
- `src/lib/` and `src/hooks/` — page meta, shared utilities.

*The rest is in the code.*
