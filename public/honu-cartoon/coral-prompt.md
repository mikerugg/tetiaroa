# HONU coral asset provenance

Mode: built-in `image_gen`, generate. One image call, no input images. Matches the previously generated HONU gouache sprites. The generated original was copied unchanged into the workspace; no local image editing.

Destination: `public/honu-cartoon/coral.png`

Generated original: `/home/node/.codex/generated_images/01a0b0eb-76e9-7e53-bcd1-aeece47f24be/exec-0acea99b-3bb4-42ea-a5e8-d6d9071250a7.png`

Validation: visually inspected the generated output. It depicts a branching stony coral colony on a small rock, with pale tips, ring corallites and small extended polyps. Read-only pixel inspection with the installed Sharp dependency confirmed a 1254 × 1254 RGBA PNG with alpha ranging from 0 to 255 and 794,769 fully transparent pixels. The generated alpha is preserved unchanged.

Exact prompt:

```text
Use case: illustration-story.
Asset type: transparent 2D game sprite for the educational HONU painted ocean adventure.
Primary request: One single healthy branching stony coral COLONY attached to a small natural rocky base. A fixed solid reef organism with stout calcified fingerlike branches forming a broad irregular branching silhouette. Rose, dusty lavender, and warm tan branches with healthy pale cream growing tips. Tiny cup and ring corallites dapple the textured branch surfaces, with a few delicate small tentacle polyps visible close up. The colony should read immediately as branching hard coral rather than a plant.
Style/medium: Premium children's natural history picture-book illustration, hand-painted gouache with subtle paper texture confined to the painted subject, beautifully clean silhouette, softly outlined dark teal contours, thoughtful warm/cool color harmony. Match an ocean picture-book with textured olive/mint sea turtles, golden butterflyfish, coral-orange octopuses and rich turquoise water. Sophisticated natural-history illustration, not generic clip art.
Scene/backdrop: Genuine alpha-transparent background; do not draw a checkerboard or solid background.
Composition/framing: Center the complete colony and its small attached rock in a square approximately 1024px canvas, comfortably visible safe margins around every branch and the base. Front three-quarter view with a broad branching silhouette. Readable as a stationary small game sprite.
Constraints: One coral colony only with its small natural rocky attachment base; no other animals, no face, no swimming pose, no sea fan, no leafy seaweed or plant shape, no scenery, no ocean backdrop, no water, no bubbles, no cast or drop shadow, no text, no labels, no logo, no watermark. Not 3D, not pixel art, not emoji, not photorealistic. Preserve actual transparent alpha outside the painted coral and its small base.
```

