const SHAPE_COUNT = 72;

const COLORS = [
  "#3D5AFE",
  "#E64301",
  "#7C3AED",
  "#059669",
  "#0EA5E9",
  "#1E293B",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export interface CompanyIconStyle {
  shapeSrc: string;
  color: string;
}

export function pickCompanyIcon(seed: string): CompanyIconStyle {
  const hash = hashString(seed || "default");
  const shapeIndex = (hash % SHAPE_COUNT) + 1;
  const color = COLORS[hash % COLORS.length];
  return {
    shapeSrc: `/svg-shapes/shape-${shapeIndex}.svg`,
    color,
  };
}

/**
 * Assigns a shape+color per seed, resolving collisions within the batch by
 * linear-probing the next shape index so no two seeds shown together end up
 * with the same glyph (colors may still repeat once shapes run low).
 */
export function assignCompanyIcons(
  seeds: string[],
): Map<string, CompanyIconStyle> {
  const result = new Map<string, CompanyIconStyle>();
  const usedShapes = new Set<number>();

  for (const seed of seeds) {
    if (result.has(seed)) continue;
    const hash = hashString(seed || "default");
    let shapeIndex = hash % SHAPE_COUNT;
    let attempts = 0;
    while (usedShapes.has(shapeIndex) && attempts < SHAPE_COUNT) {
      shapeIndex = (shapeIndex + 1) % SHAPE_COUNT;
      attempts++;
    }
    usedShapes.add(shapeIndex);
    result.set(seed, {
      shapeSrc: `/svg-shapes/shape-${shapeIndex + 1}.svg`,
      color: COLORS[hash % COLORS.length],
    });
  }

  return result;
}
