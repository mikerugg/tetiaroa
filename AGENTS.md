
<!-- BEGIN:browser-verification-rules -->
# Browser verification uses agent-browser

When running a local dev server or checking rendered UI, use `agent-browser` for navigation, snapshots, screenshots, scrolling, clicks, and other browser verification. Do not add Playwright, Cypress, or other browser automation packages to this repo for one-off visual QA unless `agent-browser` is unavailable and the user approves the fallback.

Typical flow:

```bash
pnpm dev
agent-browser open http://localhost:3298
agent-browser wait --load networkidle
agent-browser snapshot -i
agent-browser screenshot
```

Close the browser session when finished.
<!-- END:browser-verification-rules -->

<!-- BEGIN:styling-rules -->
# Styling uses Tailwind v4 utilities

For normal UI styling, prefer Tailwind v4 utility classes inline in JSX/TSX `className` values. Use CSS Modules only for animation-specific rules, complex keyframes, generated visual effects, or styles that genuinely need selector/state machinery that is awkward in utilities.

Keep project-wide design tokens, font selection, resets, and reusable global utilities in `app/globals.css`. Avoid adding new page/component CSS Module rules for ordinary layout, spacing, color, typography, borders, and responsive styling when Tailwind v4 utilities can express the style directly.
<!-- END:styling-rules -->
