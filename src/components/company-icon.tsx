import { pickCompanyIcon } from "@/lib/company-icon";

export function CompanyIcon({
  seed,
  size = 32,
}: {
  seed: string;
  size?: number;
}) {
  const { shapeSrc, color } = pickCompanyIcon(seed);

  return (
    <div
      className="flex shrink-0 items-center justify-center "
      style={{ width: size, height: size, backgroundColor: color }}
    >
      <div
        style={{
          width: size * 0.55,
          height: size * 0.55,
          backgroundColor: "#fff",
          maskImage: `url(${shapeSrc})`,
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskImage: `url(${shapeSrc})`,
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
        }}
      />
    </div>
  );
}
