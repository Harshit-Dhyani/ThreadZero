import type { AssetId } from "@/lib/assets";
import { ASSETS } from "@/lib/assets";
import type { Language } from "@/lib/types";

export function ResponsiveIllustration({ assetId, language, className = "", priority = false }: { assetId: AssetId; language: Language; className?: string; priority?: boolean }) {
  const asset = ASSETS[assetId];
  return <picture>
    <source media="(max-width: 639px)" srcSet={asset.sources.small} />
    <img src={asset.sources.large} width={asset.width} height={asset.height} alt={asset.decorative ? "" : asset.alt[language]} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" className={className} />
  </picture>;
}
