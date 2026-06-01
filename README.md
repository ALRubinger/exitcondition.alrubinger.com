# exitcondition.alrubinger.com

Personal blog of Andrew Lee Rubinger.

Built on the same stack as the Aileron documentation site:

- [Astro 6](https://astro.build) (static output)
- [Svelte 5](https://svelte.dev) for interactive components (sidebar, TOC)
- [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite`
- MDX for post content
- Shared design tokens ported verbatim from `~/git/ALRubinger/aileron/design/`

## Authoring a post

Posts live in `src/content/posts/*.mdx`. Required frontmatter:

```yaml
---
title: My post
description: Short summary used on the index and in <meta>.
date: 2026-06-01
draft: false # optional; drafts are hidden in prod, visible in dev
---
```

Posts may use `<SectionBreak />` / `<SectionResume />` to control where the
section-card visual treatment opens and closes (see the Aileron design spec
for details). Both markers are globally available — no import needed.

## Commands

| Command         | Action                                  |
| --------------- | --------------------------------------- |
| `pnpm install`  | Install dependencies                    |
| `pnpm dev`      | Start dev server at `localhost:4321`    |
| `pnpm build`    | Build to `./dist/`                      |
| `pnpm preview`  | Preview the production build            |
| `pnpm check`    | Type-check the project                  |

## Design

The design system (tokens, prose, ink-bleed, card-stacked sections, textured
backgrounds) is shared with `aileron/docs`. To re-sync after changes upstream:

```sh
cp ../aileron/docs/src/styles/tokens.generated.css src/styles/tokens.generated.css
```
