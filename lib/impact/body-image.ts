export type ImpactBodyImageDisplaySize = "compact" | "standard" | "full";

type ImpactBodyImageLayout = {
  figureClassName: string;
  imageClassName: string;
  sizes: string;
};

const impactBodyImageLayouts: Record<
  ImpactBodyImageDisplaySize,
  ImpactBodyImageLayout
> = {
  compact: {
    figureClassName: "max-w-md",
    imageClassName: "max-h-[28rem]",
    sizes: "(max-width: 488px) calc(100vw - 40px), 448px",
  },
  standard: {
    figureClassName: "max-w-2xl",
    imageClassName: "max-h-[40rem]",
    sizes: "(max-width: 712px) calc(100vw - 40px), 672px",
  },
  full: {
    figureClassName: "max-w-4xl",
    imageClassName: "max-h-[80vh]",
    sizes: "(max-width: 768px) calc(100vw - 40px), 896px",
  },
};

export function getImpactBodyImageLayout(
  value: unknown,
): ImpactBodyImageLayout {
  if (value === "compact" || value === "full") {
    return impactBodyImageLayouts[value];
  }

  return impactBodyImageLayouts.standard;
}
