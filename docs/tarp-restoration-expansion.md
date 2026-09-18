# TARP: from the motu to the reef

Design reference: the user's annotated before/after island illustration, shared on 18 September 2026.

## First playable expansion

Four new animals join the existing white tern, strawberry hermit crab and native seedlings. Each animal uses a separate transparent gouache sprite in the island and a real photograph from its matching species guide in the discovery card.

| Animal | Scene placement | Internal species page |
| --- | --- | --- |
| Coconut crab | Forest edge, revealed after the third ant colony is removed | `/island/invertebrates/coconut-crab` |
| Horned ghost crab | Open beach, revealed after the second ant colony is removed | `/island/invertebrates/horned-ghost-crab` |
| Brown booby | Ground beside the trees, revealed after the third rat is removed | `/island/birds/brown-booby` |
| Sooty tern | Ground nesting spot, revealed when all rats have been removed | `/island/birds/sooty-tern` |

Removal order remains open. All six targets are still required to finish; the returning-life counter now includes seven discoveries. The complete desktop frame remains capped at 80svh, with mobile panning and the existing pause, restart and reduced-motion behavior.

Asset prompts and originals: [crabs](../public/pillars/research-conservation/tarp/crab-expansion-prompts.md), [birds](../public/pillars/research-conservation/tarp/bird-expansion-prompts.md). Both sets use the built-in image generation tool.

## Next scene: follow the birds

Use a second view within the same play window for the shoreline and reef. A gentle transition from the motu into a view across the water can show how the forest, birds, soil and lagoon connect. This keeps the current island legible on phones and avoids compressing a large infographic into the play window.

The recovery story should unfold through encounters:

1. **Room for a forest.** Add separately layered coconut palms and native trees so vegetation can change. Pisonia / pu’atea already has a species page at `/island/plants/cabbage-tree`. Build the forest stage around planting and canopy change.
2. **Room to nest.** Add red-footed boobies in trees and greater crested terns on the ground. Include a single masked booby in the recovered view, as annotated in the reference. All three have species guide entries and photographs.
3. **A busier shore.** Add the yellow land crab, also called yellow nipper, using `/island/invertebrates/geograpsus-crinipes`. Keep the different crab silhouettes and habitats distinct.
4. **A call across the water.** A visitor can activate a seabird calling station. The sound must start with that action and have a visible mute control. A wedge-tailed shearwater encounter needs a new species guide entry and real photograph first.
5. **What reaches the reef.** Follow a small, optional nutrient animation from the birds through the island toward the water. Add separate coral, grazing fish, manta and shark assets. Use the discoveries to explain the connection rather than covering the scene with labels or arrows.

Skink and gecko assets also need identified species, guide entries and real photographs before they become discovery cards. Current guide data has no matching published records for either, or for a wedge-tailed shearwater.

## Content basis

- [TARP](https://www.tetiaroasociety.org/programs/conservation/tarp-rat-eradication) and [terrestrial monitoring](https://www.tetiaroasociety.org/programs/research/effects-of-invasives-species-eradication-on-the-terrestrial-ecosystems-of-tetiaroa) support the island recovery story.
- [Reef research](https://www.tetiaroasociety.org/programs/research/impacts-of-rat-eradication-on-coral-reef-health) tracks land–sea nutrient pathways and reef changes. The scene can show that connection; removing rats should not be presented as a guarantee that coral bleaching disappears or that a particular marine animal immediately returns.
- [ATTRACT](https://www.tetiaroasociety.org/programs/research/tetiaroa-atoll-seabird-restoration) uses seabird calls, visual cues and monitoring. Its December 2025 report had no recorded target visits in the reviewed data. The calling-station encounter should express the restoration work and its aim, not invent a confirmed arrival.
- [Vegetation water-use research](https://www.tetiaroasociety.org/programs/research/water-use-rates-of-tropical-atoll-vegetation) offers a future freshwater discovery. Keep that story qualitative while the measurements and their interpretation develop.

Preserve the reference's editorial direction: no rat-waste arrow, no omics/eDNA labels, and use “fewer” for countable animals. Freshwater, nutrients and sediment should become things a visitor can discover through the scene, rather than a block of explanatory overlays.
