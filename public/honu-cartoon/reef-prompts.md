# HONU reef creature asset provenance

Mode: built-in `image_gen`, generate. Two separate image calls, no input images. The existing turtle sprite and creature prompts were inspected for style; the generated originals were copied unchanged into the workspace. No local image editing.

Validation: visually inspected both outputs with `view_image`. Read-only pixel inspection using the installed Sharp dependency confirmed both are 1254 × 1254 RGBA PNGs with alpha ranging from 0 to 255. `butterflyfish.png` contains 856,675 fully transparent pixels; `octopus.png` contains 791,343. Original alpha channels are preserved.

## butterflyfish.png

Destination: `public/honu-cartoon/butterflyfish.png`

Generated original: `/home/node/.codex/generated_images/01a0b0eb-76e9-7e53-bcd1-aeece47f24be/exec-56c1c271-23ef-4bca-a150-410b52faa0e2.png`

Exact prompt:

```text
Use case: illustration-story.
Asset type: transparent 2D game sprite for an educational HONU ocean adventure.
Primary request: One single tropical coral reef butterflyfish swimming toward the RIGHT, in readable side profile. Biologically recognizable butterflyfish shape: tall oval flattened body, small pointed snout, fine continuous dorsal fin, narrow tail base and delicate fanned tail. Cream and golden-yellow body with a bold dark stripe through the eye, fine warm-yellow flank markings, softly teal shaded fin edges. Small natural gentle eye, no human facial expression.
Style/medium: Premium children's natural history picture-book illustration, hand-painted gouache with subtle paper texture confined to the painted subject, beautifully clean silhouette, softly outlined dark teal contours, thoughtful warm/cool color harmony. Match an ocean picture-book with textured olive/mint sea turtles and rich turquoise coral. Sophisticated illustration with personality, not generic clip art.
Scene/backdrop: Genuine alpha-transparent background; do not draw a checkerboard or solid background.
Composition/framing: Center the complete fish in a square approximately 1024px canvas with comfortable safe margins around every fin and tail. Full body horizontal and facing right. Readable as a small game sprite.
Constraints: Single animal only, no scenery, no coral, no water, no bubbles, no additional objects, no drop shadow, no text, no logo, no watermark. Not 3D, not pixel art, not emoji, not photorealistic. Preserve actual transparent alpha outside the painted fish.
```

## octopus.png

Destination: `public/honu-cartoon/octopus.png`

Generated original: `/home/node/.codex/generated_images/01a0b0eb-76e9-7e53-bcd1-aeece47f24be/exec-721894ae-e558-41ac-88cd-a5d8825eee54.png`

Exact prompt:

```text
Use case: illustration-story.
Asset type: transparent 2D game sprite for an educational HONU ocean adventure.
Primary request: One single warm coral and rust-orange reef octopus, in a readable three-quarter side view with its head looking gently toward the right. Rounded mantle, two natural octopus eyes with horizontal pupils, exactly eight gracefully spreading and curling arms with small pale suckers. Its body has subtle mottled orange gouache texture and pale warm-cream highlights. Grounded low crawling posture, arms spread below and around its head in a balanced readable silhouette. Biologically recognizable octopus anatomy, curious but without a human cartoon face or smile.
Style/medium: Premium children's natural history picture-book illustration, hand-painted gouache with subtle paper texture confined to the painted subject, beautifully clean silhouette, softly outlined dark teal contours, thoughtful warm/cool color harmony. Match an ocean picture-book with textured olive/mint sea turtles and rich turquoise coral. Sophisticated illustration with personality, not generic clip art.
Scene/backdrop: Genuine alpha-transparent background; do not draw a checkerboard or solid background.
Composition/framing: Center the complete octopus in a square approximately 1024px canvas with comfortable safe margins around all eight arms. Full body visible, short rounded mantle above broadly spreading curled arms, readable as a small game sprite.
Constraints: Single animal only, no scenery, no rock, no coral, no water, no bubbles, no additional objects, no drop shadow, no text, no logo, no watermark. Not 3D, not pixel art, not emoji, not photorealistic. Preserve actual transparent alpha outside the painted octopus.
```

