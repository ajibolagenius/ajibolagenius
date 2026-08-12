export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "list"
  | "icon"
  | "image";

export interface FieldConfig {
  /**
   * Column name, or a dotted path into a jsonb column (`social.github`).
   * A dotted path means the WHOLE json column is rewritten on save, so every
   * key that must survive needs its own field — see `nestFieldValues`.
   */
  name: string;
  label: string;
  type: FieldType;
  /** Optional hint rendered under the input. */
  help?: string;
}

export interface ResourceConfig {
  table: string;
  label: string;
  orderColumn: string;
  fields: FieldConfig[];
  titleField: string;
  /** Primary key column; defaults to "id". */
  idColumn?: string;
  /** Fixed set of rows: hide the create form and delete buttons. */
  fixedRows?: boolean;
  /** Storage bucket used by "image" fields in this resource. */
  imageBucket?: string;
}

export const ADMIN_RESOURCES: Record<string, ResourceConfig> = {
  "personal-info": {
    table: "personal_info",
    label: "Personal Info",
    orderColumn: "id",
    titleField: "name",
    fixedRows: true,
    imageBucket: "avatars",
    fields: [
      { name: "avatar_url", label: "Avatar", type: "image" },
      { name: "name", label: "Name", type: "text" },
      { name: "role", label: "Role", type: "text" },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "tagline_suffix", label: "Tagline suffix", type: "textarea" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "location", label: "Location", type: "text" },
      { name: "availability", label: "Availability", type: "text" },
      // The four keys of the `social` jsonb column. All four are listed
      // because saving replaces the column wholesale; dropping one here would
      // silently wipe it. They render as links in the sidebar and footer, so
      // store full URLs.
      {
        name: "social.github",
        label: "GitHub URL",
        type: "text",
        help: "Full profile URL (https://github.com/<user>). Also drives the homepage contribution graph — clear it to hide the graph.",
      },
      { name: "social.linkedin", label: "LinkedIn URL", type: "text" },
      { name: "social.twitter", label: "X / Twitter URL", type: "text" },
      { name: "social.whatsapp", label: "WhatsApp URL", type: "text" },
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
      {
        name: "start_date",
        label: "Start date",
        type: "text",
        help: 'Must contain a year ("2019", "Jan 2020"). The sidebar\'s years-of-experience row is derived from the earliest one and is omitted entirely if none parse.',
      },
      { name: "end_date", label: "End date", type: "text" },
      { name: "body", label: "Description", type: "textarea" },
      { name: "bullets", label: "Bullets", type: "list" },
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
  sections: {
    table: "site_sections",
    label: "Sections",
    orderColumn: "sort_order",
    titleField: "label",
    idColumn: "key",
    fixedRows: true,
    fields: [
      { name: "visible", label: "Visible", type: "boolean" },
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

/**
 * Reads a field off a row, following a dotted path into a json column.
 * Returns undefined for a missing column or key so the input renders empty.
 */
export function readFieldValue(
  row: Record<string, unknown>,
  name: string,
): unknown {
  if (!name.includes(".")) return row[name];

  return name.split(".").reduce<unknown>((value, key) => {
    if (value === null || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[key];
  }, row);
}

/**
 * Turns the flat, form-shaped values map into the row shape Postgres expects,
 * folding `social.github` and friends into a single `social` object.
 *
 * The nested object is built from scratch, so it fully replaces whatever the
 * column held. That is safe only while every key of that column has a field in
 * the resource config — which is why the config comments say so.
 */
export function nestFieldValues(
  flat: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const [name, value] of Object.entries(flat)) {
    if (!name.includes(".")) {
      out[name] = value;
      continue;
    }

    const [column, ...path] = name.split(".");
    let target = (out[column] ??= {}) as Record<string, unknown>;
    for (const key of path.slice(0, -1)) {
      target = (target[key] ??= {}) as Record<string, unknown>;
    }
    target[path[path.length - 1]] = value;
  }

  return out;
}
