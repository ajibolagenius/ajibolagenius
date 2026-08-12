export interface TechDetail {
  name: string;
  category?: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  category: string;
  label: string;
  description: string;
  // 'client' | 'side' | 'sandbox'. Deliberately typed as string, not a union:
  // the column is free text with no CHECK constraint, so a literal union would
  // be a lie at the DB boundary. Use ProjectKind from lib/project-kind.ts where
  // narrowing is actually wanted.
  kind: string;
  status: string; // 'live' | 'in-progress' | 'archived'
  tags: string[];
  type: string;
  featured: boolean;
  live_url: string;
  github_url: string;
  problem: string;
  solution: string;
  role_title: string;
  duration: string;
  year: string;
  tech_details: TechDetail[];
  screenshots: string[];
  showcase_type?: string | null;
  created_at: string | null;
}

export type ProjectInput = Omit<Project, "id" | "created_at">;

/**
 * The subset a card actually renders. Listing pages select exactly these
 * columns because the row is serialized into the client bundle for filtering,
 * and the long-form fields would roughly double that payload.
 *
 * A full `Project` stays assignable to this, so nothing that already passes a
 * whole row needs to change.
 */
export type ProjectCardData = Pick<
  Project,
  | "id"
  | "slug"
  | "name"
  | "kind"
  | "category"
  | "description"
  | "tags"
  | "screenshots"
  | "featured"
  | "status"
>;
