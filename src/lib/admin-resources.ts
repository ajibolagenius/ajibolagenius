export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "list"
  | "icon";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
}

export interface ResourceConfig {
  table: string;
  label: string;
  orderColumn: string;
  fields: FieldConfig[];
  titleField: string;
}

export const ADMIN_RESOURCES: Record<string, ResourceConfig> = {
  "personal-info": {
    table: "personal_info",
    label: "Personal Info",
    orderColumn: "id",
    titleField: "name",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "role", label: "Role", type: "text" },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "tagline_suffix", label: "Tagline suffix", type: "textarea" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "location", label: "Location", type: "text" },
      { name: "availability", label: "Availability", type: "text" },
    ],
  },
  skills: {
    table: "skills",
    label: "Skills",
    orderColumn: "order",
    titleField: "name",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "level", label: "Level (0-100)", type: "number" },
      { name: "icon_url", label: "Tech icon (light theme)", type: "icon" },
      {
        name: "icon_url_dark",
        label: "Tech icon (dark theme, optional)",
        type: "icon",
      },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  experience: {
    table: "experience_entries",
    label: "Experience",
    orderColumn: "sort_order",
    titleField: "role_title",
    fields: [
      { name: "role_title", label: "Role title", type: "text" },
      { name: "company", label: "Company", type: "text" },
      { name: "employment_type", label: "Employment type", type: "text" },
      { name: "start_date", label: "Start date", type: "text" },
      { name: "end_date", label: "End date", type: "text" },
      { name: "body", label: "Description", type: "textarea" },
      { name: "bullets", label: "Bullets (comma separated)", type: "list" },
      { name: "sort_order", label: "Order", type: "number" },
    ],
  },
  education: {
    table: "education_entries",
    label: "Education",
    orderColumn: "order",
    titleField: "degree",
    fields: [
      { name: "degree", label: "Degree", type: "text" },
      { name: "school", label: "School", type: "text" },
      { name: "year", label: "Year", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  certifications: {
    table: "certifications",
    label: "Certifications",
    orderColumn: "order",
    titleField: "title",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "issuer", label: "Issuer", type: "text" },
      { name: "issued_date", label: "Issued date", type: "text" },
      { name: "link_url", label: "Link URL", type: "text" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  languages: {
    table: "languages",
    label: "Languages",
    orderColumn: "sort_order",
    titleField: "name",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "proficiency", label: "Proficiency", type: "text" },
      { name: "flag_code", label: "Flag code (us, ng, ...)", type: "text" },
      { name: "sort_order", label: "Order", type: "number" },
    ],
  },
  recommendations: {
    table: "recommendations",
    label: "Recommendations",
    orderColumn: "sort_order",
    titleField: "name",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "role_title", label: "Role / company", type: "text" },
      { name: "quote", label: "Quote", type: "textarea" },
      { name: "link_url", label: "Link URL", type: "text" },
      { name: "sort_order", label: "Order", type: "number" },
    ],
  },
};

export function getResourceConfig(key: string): ResourceConfig | undefined {
  return ADMIN_RESOURCES[key];
}
