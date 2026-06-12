<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

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
