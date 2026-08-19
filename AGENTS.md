
<!-- BEGIN:browser-verification-rules -->
# Browser verification uses agent-browser

When running a local dev server or checking rendered UI, use `agent-browser` for navigation, snapshots, screenshots, scrolling, clicks, and other browser verification. Do not add Playwright, Cypress, or other browser automation packages to this repo for one-off visual QA unless `agent-browser` is unavailable and the user approves the fallback. Only capture screenshots when major design or layout changes or functionality needs to be checked or tested. Minor changes do not require this.

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

<!-- BEGIN:shadcn-styling-rules -->
# shadcn/ui styling and composition rules

When using shadcn/ui, prefer installed components from `@/components/ui` before writing custom UI primitives. Use the project's package runner for CLI work: `pnpm dlx shadcn@latest ...`.

Use built-in component variants before custom class overrides, for example `variant="outline"` or `size="sm"`. Prefer semantic tokens such as `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`, `border-border`, and `text-destructive`; do not use raw Tailwind color utilities for component state or status styling unless a custom CSS variable has been added to `app/globals.css`.

For shadcn components, treat `className` as layout glue first: spacing, width, grid/flex, positioning, and responsive behavior. Avoid overriding component colors, typography, border styling, or interaction states directly when a variant, semantic token, or theme variable can express the intent.

Use `gap-*` for spacing. Do not use `space-x-*` or `space-y-*`; vertical stacks should be `flex flex-col gap-*`. Use `size-*` when width and height match, and use `truncate` instead of manually combining overflow, text ellipsis, and whitespace utilities.

Do not add manual `dark:` color overrides to shadcn component usage. Theme light/dark behavior through semantic tokens and CSS variables. Do not add manual `z-*` stacking to overlay components such as `Dialog`, `Sheet`, `Drawer`, `DropdownMenu`, `Popover`, `Tooltip`, or `HoverCard`.

Use `cn()` from `@/lib/utils` for conditional class names and Tailwind merging. Avoid hand-written template literal class ternaries.

Forms must use `FieldGroup` and `Field` with `FieldLabel`; do not build form layout from raw `div`/`label` wrappers. Option sets with a small fixed set of choices should use `ToggleGroup`; grouped checkboxes/radios/switches should use `FieldSet` and `FieldLegend`. Validation should use `data-invalid` on `Field` and `aria-invalid` on the control.

Compose shadcn components fully: use `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter` for cards; put `SelectItem` inside `SelectGroup`; put `TabsTrigger` inside `TabsList`; include `AvatarFallback` with every `Avatar`. Dialog, Sheet, and Drawer content must include the matching title component, visually hidden with `sr-only` if needed.

Use component primitives instead of styled markup: `Badge` for chips/status, `Separator` instead of `<hr>` or border divider divs, `Empty` for empty states, `Skeleton` for loading placeholders, `Alert` for callouts, and `sonner` for toast notifications.

Use `Button asChild` for link-style buttons in this Radix-based shadcn setup. `Button` does not have `isPending` or `isLoading`; compose loading states with `Spinner`, `disabled`, and icon placement.

Icons should come from the configured project icon library, currently `lucide-react`. Icons inside `Button` need `data-icon="inline-start"` or `data-icon="inline-end"` and should not have manual sizing classes. Pass icon components as objects rather than string lookup keys.
<!-- END:shadcn-styling-rules -->

<!-- BEGIN:text-writing-rules -->
Anytime headers or copy is written, the initial AI coding agent should not be trusted to write contextual relevant, human sounding copy. Upon completion of the sessions coding efforts, when appropriate, create a copywriting expert agent to rewrite that session's copy. The writing should be compelling, should have a viewpoint, should tell a story, and should never be *safe*. I don't want generic AI corporate slop. I want writing that connects with people on a human level, and sounds like an actual human wrote it.
<!-- END:text-writing-rules -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
