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

export function pickCompanyIcon(seed: string) {
  const hash = hashString(seed || "default");
  const shapeIndex = (hash % SHAPE_COUNT) + 1;
  const color = COLORS[hash % COLORS.length];
  return {
    shapeSrc: `/svg-shapes/shape-${shapeIndex}.svg`,
    color,
  };
}
