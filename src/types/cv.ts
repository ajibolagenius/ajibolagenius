export interface PersonalInfo {
  id: number;
  name: string;
  tagline: string;
  tagline_suffix: string;
  description: string;
  role: string;
  email: string;
  location: string;
  availability: string;
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    whatsapp?: string;
  };
  locale: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  order: number;
}

export interface ExperienceEntry {
  id: string;
  role_title: string;
  company: string;
  employment_type: string;
  start_date: string;
  end_date: string;
  body: string;
  bullets: string[];
  icon_shape: string | null;
  sort_order: number;
}

export interface EducationEntry {
  id: string;
  year: string;
  degree: string;
  school: string;
  description: string;
  order: number;
}

export interface Certification {
  id: string;
  title: string;
  order: number;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
  flag_code: string;
  sort_order: number;
}

export interface Recommendation {
  id: string;
  name: string;
  role_title: string;
  quote: string;
  avatar_url: string | null;
  link_url: string | null;
  sort_order: number;
}
