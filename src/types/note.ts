export interface Note {
  id: string;
  slug: string;
  title: string;
  date: string;
  tags: string[];
  category: string;
  excerpt: string;
  body: string;
  read_time: string;
  created_at: string;
  published: boolean;
  published_at?: string | null;
  meta_description?: string;
  og_image?: string;
}
