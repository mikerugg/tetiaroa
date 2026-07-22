import { CommunityGlobalImpactPage } from "./community-global-impact-page";
import { EducationCulturePage } from "./education-culture-page";
import type { PillarLocale, PillarSlug } from "./pillar-content";
import { ResearchConservationPage } from "./research-conservation-page";

export function PillarPage({
  locale,
  slug,
}: {
  locale: PillarLocale;
  slug: PillarSlug;
}) {
  switch (slug) {
    case "research-conservation":
      return <ResearchConservationPage locale={locale} />;
    case "education-culture":
      return <EducationCulturePage locale={locale} />;
    case "community-global-impact":
      return <CommunityGlobalImpactPage locale={locale} />;
  }
}
