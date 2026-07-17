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
  kind: string; // 'client' | 'side'
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
  created_at: string | null;
}

export type ProjectInput = Omit<Project, "id" | "created_at">;
