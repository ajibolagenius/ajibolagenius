import type { ComponentType } from "react";
import { ColorLabExperiment } from "@/components/sandbox/experiments/color-lab";

export type SandboxExperiment = {
  slug: string;
  /** Short label for cards / cues */
  label: string;
  component: ComponentType;
};

/**
 * Code-owned sandbox toys. Catalog metadata (name, cover, status, etc.)
 * still lives in admin — create a project with kind=sandbox whose slug
 * matches a key here for it to appear in the index and detail shell.
 */
const SANDBOX_EXPERIMENTS: Record<string, SandboxExperiment> = {
  "color-lab": {
    slug: "color-lab",
    label: "Play",
    component: ColorLabExperiment,
  },
};

export function getSandboxExperiment(slug: string): SandboxExperiment | null {
  return SANDBOX_EXPERIMENTS[slug] ?? null;
}

export function hasSandboxExperiment(slug: string): boolean {
  return slug in SANDBOX_EXPERIMENTS;
}

export function listSandboxExperimentSlugs(): string[] {
  return Object.keys(SANDBOX_EXPERIMENTS);
}
