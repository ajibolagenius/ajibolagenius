/**
 * Single source of truth for project kind -> label, route and URL token.
 *
 * Plain module with no server imports, so it is safe from both server and
 * client components. Before this existed the kind -> basePath ternary was
 * duplicated in project-card.tsx, sitemap.ts and featured-work.tsx.
 *
 * Note the URL token is deliberately not the DB value: `kind: "client"` is
 * surfaced as `?type=work`, because that is the word visitors already know
 * from the old /work route.
 */

export type ProjectKind = "client" | "side" | "sandbox";

export const PROJECT_KINDS = {
  client: {
    label: "Client",
    plural: "Client work",
    base: "/projects",
    listHref: "/projects?type=work",
    param: "work",
  },
  side: {
    label: "Side",
    plural: "Side projects",
    base: "/projects",
    listHref: "/projects?type=side",
    param: "side",
  },
  sandbox: {
    label: "Sandbox",
    plural: "Sandbox",
    base: "/sandbox",
    listHref: "/sandbox",
    param: "sandbox",
  },
} as const;

/** Kinds that live on /projects. Sandbox has its own surface. */
export const LISTED_KINDS: ProjectKind[] = ["client", "side"];

/**
 * Unknown kinds fall back to `client`, mirroring the previous inline ternary
 * so a typo'd value in the (unconstrained, free-text) column degrades exactly
 * as it did before rather than throwing.
 */
export function kindMeta(kind: string) {
  return PROJECT_KINDS[kind as ProjectKind] ?? PROJECT_KINDS.client;
}

export function projectHref(project: { kind: string; slug: string }) {
  return `${kindMeta(project.kind).base}/${project.slug}`;
}

/** `?type=` token -> DB kind. Returns null for "all" / anything unrecognised. */
export function kindForParam(param?: string | null): ProjectKind | null {
  if (!param) return null;
  const match = (Object.keys(PROJECT_KINDS) as ProjectKind[]).find(
    (k) => PROJECT_KINDS[k].param === param,
  );
  return match ?? null;
}

/**
 * `category` is a comma-separated string, not an array. Splitting it is what
 * turns a composite facet like "Web App, Dashboard" into two real filter
 * pills instead of one nonsense one.
 */
export function splitCategories(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}
