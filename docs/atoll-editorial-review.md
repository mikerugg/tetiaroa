# Atoll guide: bilingual editorial review

Completed 16 September 2026.

## Scope and result

The guide has 150 rewritten profiles in English and French: 300 language versions. Every profile’s original English and French body was compared with the revised text. The review covered identification, habitat, feeding, reproduction, local observations, cultural associations, traditional uses, and source cautions.

| Group | Profiles | Review |
| --- | ---: | --- |
| Birds | 16 | Full bilingual rewrite and editorial pass |
| Turtles | 5 | Full bilingual rewrite and editorial pass |
| Marine mammals | 9 | Full bilingual rewrite and editorial pass |
| Plants | 37 | Independent review of both rewrites against both source languages |
| Fish | 56 | Independent review of both rewrites against both source languages |
| Invertebrates | 27 | Independent review of both rewrites against both source languages |

The rewritten bodies contain 16,724 English words and 18,960 French words across 296 sections in each language. These are full profile bodies; the short card introductions are separate. Source bibliographies, names, plant facts, photographs, resources, and related reading are handled by the migration rather than repeated in the prose.

The review also edited the hub, category, navigation, search, and empty-state copy in `app/atoll/atoll-copy.ts` and `lib/atoll/config.ts`.

## Editorial approach

- Begin each profile with a specific identifying feature, behaviour, or local association.
- Use headings to make a full account easy to read without reducing it to a summary.
- Combine substantive information from both source languages. French is edited prose, including where the old French page contained English text.
- Distinguish observations on Tetiaroa from the wider Polynesian or worldwide range. Mangroves and high-island valleys are not presented as Tetiaroa habitats.
- Date historical population estimates, survey results, and conservation assessments. The guide is not a new census.
- Attribute cultural traditions and medicinal uses to their historical or ethnobotanical context. Preserve recorded poisoning and contact warnings without converting traditional practices into treatment recommendations.
- Keep explanations about corrections, source-language disagreements, and migration decisions in the editorial record. Retain a public qualification where readers need it to understand the evidence.
- Preserve authored Biosphere articles separately as related reading. Their authorship and full text are part of the migration’s story restoration, not replaced by profile summaries.

## Material corrections and restored details

### Birds, turtles, and marine mammals

Scientific-name corrections include long-tailed cuckoo `Urodynamis taitensis`, olive ridley `Lepidochelys olivacea`, and melon-headed whale `Peponocephala electra`. Original names remain in the source record.

- Masked booby measurements of 75–85 cm refer to body length, not wingspan. Red-footed booby wingspan was corrected to approximately 1.4–1.5 m. [Cornell: masked booby](https://www.allaboutbirds.org/guide/Masked_Booby/id), [Birds New Zealand: cuckoo checklist](https://www.birdsnz.org.nz/society-publications/checklist-2022/cuculiformes-cuckoos/).
- Historical bird counts remain dated. The great frigatebird estimate refers to individuals, not breeding pairs. Resident egret records do not imply confirmed nesting on Tetiaroa.
- Wandering tattler parental care no longer assigns incubation exclusively to the female. Conflicting cuckoo developmental claims are qualified rather than forced into a precise timeline.
- Humpback song is described as socially transmitted, not a fixed inherited anthem. Unsupported precise breach speed and depletion claims were withheld in the editorial record. [Research on song transmission](https://doi.org/10.1098/rsos.220158).
- Pilot-whale social and reproductive claims were qualified; menopause is not presented as unique to humans and pilot whales. The spinner dolphin’s unsupported 15-minute dive claim was withheld.
- Leatherback measurements, shell description, incubation wording, and French Guiana geography were corrected. Adult size and age at sexual maturity are distinguished.
- Loggerhead lateral shell features are scutes, not ribs. Broad claims about abundance, nesting range, and legal protection were narrowed.
- Green-turtle nesting geography places Scilly and Bellinghausen in the Society Islands. Monitoring dates are distinguished from general natural history.

### Plants

The independent review restored salt resistance of ironwood timber; cosmetic moisturising uses of tafano; several dozen pandanus forms and the abundance of the coastal spiny form; the traditional importance of ti in marae ceremonies; and smaller details in historical food and plant-use accounts.

- Tou’s heart-shaped feature is its leaf, not its flower. The ambiguous original “4 m trunk” measurement remains in the source archive rather than receiving an invented interpretation. [NParks: Cordia subcordata](https://www.nparks.gov.sg/FloraFaunaWeb/Flora/2/8/2826).
- Miro has green, heart-shaped leaves and yellow flowers; the original text confused leaf and flower colour. [NParks: Thespesia populnea](https://www.nparks.gov.sg/FloraFaunaWeb/Flora/3/1/3190).
- Coconut oil and perfumed monoï are distinguished. [Official monoï definition](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000000539285).
- Breadfruit’s Bounty history concerns transport to the Caribbean. The later dietary shift towards rice and bread is not presented as their first arrival in Polynesia. [University of Hawai‘i: breadfruit](https://www.ctahr.hawaii.edu/oc/freepubs/pdf/FN-58.pdf).
- Tahitian vanilla ancestry uses `V. planifolia` and `V. odorata`. Fruit maturation is placed after pollination, followed by harvest and curing. [Vanille de Tahiti: biological resources](https://vanilledetahiti.com/centre-de-ressources-biologiques/), [preparation](https://vanilledetahiti.com/une-preparation-unique/).
- Wart fern’s poisoning and abortifacient cautions, nono’s blistering caution, and the Makatea coconut-crab toxicity account remain. Their historical context does not claim proven medicinal efficacy.
- The review preserved the separately normalized bilingual plant facts and verified-source metadata.

### Invertebrates

The review restored coconut-crab body length and source developmental observations; strawberry-hermit-crab colour, reproductive anatomy, egg release, and differing lifespan estimates; octopus feeding mechanics; the lower end of the crown-of-thorns size range; zebra-like mantle markings; and cultural food details.

- Coconut-crab maximum weight was corrected from the unsupported 15 kg claim to approximately 4 kg; unverified extreme longevity is not presented as established fact.
- A mismatched French hermit-crab body was assigned to the appropriate profile. The related names and anatomy are kept distinct.
- Crown-of-thorns outbreaks are not reduced to one cause. Coral colour is not assigned to the limestone skeleton. Black sea cucumbers are not described as possessing Cuvierian tubules.
- Christmas-tree-worm naming acknowledges the Indo-Pacific species complex.
- The collector urchin’s original shallow range and wider reported range are distinguished. Contact warnings remain, without assigning strong venom to every spine.

### Fish

The review restored specific soldierfish fin colours, eagle-ray calcified jaw supports and reproductive anatomy, farmerfish use of living and dead coral surfaces, the lower end of the bluespine unicornfish depth range, and explicit Tetiaroa commonness of the titan triggerfish.

- French blacktip-reef-shark reproductive intervals now say “each year or every two years”; the ambiguous word *bisannuelle* was removed. The dated Vulnerable assessment is retained.
- Manta and eagle-ray prose distinguishes historically combined species. Regional figures are not presented as local measurements. [NOAA: giant manta ray](https://www.fisheries.noaa.gov/species/giant-manta-ray), [CSIRO eagle-ray record](https://www.cmar.csiro.au/caab/taxon_report.cfm?caab_code=37039003).
- Lemon-shark source details that may mix the two `Negaprion` species remain qualified. Unsupported fixed nursery residence and breeding-season lengths were not restored as local facts. [Society Islands reproductive study](https://pmc.ncbi.nlm.nih.gov/articles/PMC3742621/).
- Silver squirrelfish diet was corrected from the original “benthic vertebrates” to benthic invertebrates; the first rewrite’s small-fish example was removed. [FishBase species dataset, feeding reference 11889](https://www.fishbase.se/summary/Neoniphon-argenteus), [museum species record](https://fishesofaustralia.net.au/home/species/4442).
- Parrotfish sex change and sand production, chromis feeding success, cleaner-wrasse health effects, and species-wide superlatives are qualified where the original language exceeded its evidence.
- Teuira Henry’s pufferfish account remains a brief historical reference. Procedural poisoning details are excluded.
- Ciguatera warnings remain in the profiles that contained them. Triggerfish nest defence and other original encounter cautions also remain.

## Hub and interface copy

The hub begins with “Look closer at Tetiaroa” / “Tetiaroa, de plus près,” then leads to a field guide, the atoll’s formation, and its present-day research and conservation context. Category introductions describe recognisable animals and habitats. Counts describe available profiles rather than claiming a complete census.

Generic slogans and contrived contrasts were replaced with concrete language. The open-ocean description identifies humpbacks arriving from Antarctic waters rather than applying that journey to every cetacean. SWAC cools buildings on Tetiaroa. Empty image states do not promise future photographs.

## Validation and remaining limits

The final artifact check confirmed:

- 150 unique profile IDs exactly match the public source inventory.
- Every profile has both languages, a title, a summary, non-empty sections, and a coverage record.
- No duplicate IDs or missing language versions remain across the four rewrite files.
- Source corrections and withheld claims are documented in per-profile `editorialNotes`; original text remains in the source snapshot.

This was an editorial and source-coverage review, not a new field survey or specialist reassessment of every taxon. Some older measurements, regional observations, and cultural accounts remain explicitly attributed. Conflicting or unsupported claims are documented rather than silently converted into facts. Rendering, link behaviour, CMS writes, media completeness, and deployment are verified separately by the implementation and migration work.

## Working artifacts

The migration’s local work directory contains:

- `.migration-cache/atoll-rewrites-naturalists.json`
- `.migration-cache/atoll-rewrites-plants.json`
- `.migration-cache/atoll-rewrites-invertebrates.json`
- `.migration-cache/atoll-rewrites-fish.json`
- `.migration-cache/atoll-copy-validation.json`

These final JSON files include review edits made after manuscript generation. Re-running an earlier manuscript generator would discard those edits; import the reviewed artifacts.

## Final naming and image-metadata pass

A subsequent audit checked the source naming fields and image metadata across all 150 profiles. The old `field_other_names` combined Polynesian names, French bird names, and English plant synonyms. Seventeen mixed fields were separated: local names stay in `localNames`, and common-language alternatives move to `otherNames`. Regional abbreviations are expanded in each language. Orca’s French-only local name now appears in both versions. The unexplained `P` beside Triumfetta’s name was removed from the public label without guessing its meaning; the original remains archived.

The audit supplied 115 targeted image-alt overrides, including French translations and corrections where old metadata contradicted the revised body. These include coconut-crab mass and lifespan, humpback breach speed, male-only claw claims, ironwood branchlets, miro leaves, vanilla pollination, cowrie distribution, and sea-cucumber defence. Photographer credits were preserved.

Three potentially problematic photographs were inspected. The forest-hermit-crab photograph is consistent with its hairy, spiny description. Two photographs on the black-sea-cucumber profile show other sea cucumbers and now have explicit comparison captions: file 1164 is labelled `Holothuria signata` in the source photograph, while file 1163 remains unidentified. The images are retained without presenting both as `Holothuria atra`. [Museum Victoria taxonomic study distinguishing H. signata](https://museumsvictoria.com.au/media/4103/64-o-loughlin-paulay-vandenspiegel-samyn.pdf).

The missing orca scientific name was supplied as `Orcinus orca`, with the [NOAA species account](https://www.fisheries.noaa.gov/species/killer-whale) recorded for verification. Misspelled scientific names should remain searchable as labelled legacy source names, rather than being presented as valid taxonomic synonyms.

The exact migration overrides are in `.migration-cache/atoll-metadata-review.json`; all requested image IDs were checked against their source profile and language.
