# Product Designer Portfolio

A static, animated portfolio that combines two visual languages:

| From **extrafazant.nl** | From **balky-vana.webflow.io** |
| --- | --- |
| Off-white and ink sections, script logo, white pill nav | Electric blue `#0a24ff`, lilac loader with a `LOADING 0%` counter |
| Heavy condensed caps mixed with a condensed serif (`SELECTED` *WORK*) | Monospace body copy, chunky condensed display type |
| Tilted polaroids with stickers, thick colour-framed project cards | `WORD │ coloured tile │ WORD` rows ("How I │ ▢ │ work") |
| Rotating "This is how I scroll" badge, arrow-square buttons | Rounded colour tiles holding UI artefacts, centred mono paragraphs |

Illustrations are **old-Mac style 1-bit pixel icons with Figma UI props**
(computer, pencil, window, hand pointer, magnifier, floppy, folders) drawn by a tiny rasteriser in `illustrations.js`; the hero uses `assets/img/mac.webp`. They are SVG,
so every background is **transparent**, and the pixel computer's eyes follow the mouse.

## Pages

- `index.html`: hero, client marquee, scroll word-fill statement, about, selected work (stacking cards),
  services, process, draggable toolbox, pinned horizontal testimonials, contact.
- `case.html?p=<slug>`: a case study per project (`pocket`, `orbit`, `medly`, `shoply`), structured the way
  senior product designers document their work:
  1. **Overview**: role, timeline, team, platform, deliverables, tools
  2. **TL;DR / Impact**: four headline metrics (animated counters)
  3. **Problem**: problem statement, business goals, user goals, constraints
  4. **Research**: methods with sample sizes and tools, before/after funnel (interactive toggle), insights, HMWs
  5. **Process**: phases with weeks, activities and tools (FigJam, Figma, Maze, Dovetail, Amplitude…)
  6. **Solution**: key decisions and annotated hi-fi phone and desktop screens
  7. **Results**: before → after metrics table and a stakeholder quote
  8. **Reflection**: learnings and a next-project card

All case-study content lives in `assets/js/projects.js`. Edit that one file to replace the sample projects with your own.

## Motion & interaction

- **Loading**: lilac counter loader, a blue wipe on exit, and the wipe also runs between pages.
- **Smooth scroll**: Lenis, synced with GSAP ScrollTrigger.
- **Mouse**: custom cursor with contextual labels (View / Drag / Peel), magnetic buttons, 3D tilt, cartoon eyes
  that follow the pointer, and **click anywhere to slap a sticker**. Stickers can be dragged, or clicked to peel off,
  and the "Clear" HUD removes them all.
- **Text**: split-character and split-word reveals, scroll-scrubbed word fill, scramble-on-hover nav, bouncing letters.
- **Scroll objects**: parallax polaroids, stacking work cards, velocity-reactive marquee, rotating badge,
  sliding `WORD │ tile │ WORD` rows, a toolbox pile that drops in with physics, pinned horizontal quotes, a drawn timeline,
  floating phone mockups, and a reading-progress bar with a section index.
- **Pictures**: clip and scale reveals, hover zoom and rotate, wiggling stickers, a waving character arm, floating components.
- `prefers-reduced-motion` is respected.

## Run locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080. There is no build step. GSAP 3.12.5 and Lenis 1.1.13 are vendored in `assets/vendor/`,
and fonts load from Google Fonts (Anton, Instrument Serif, DM Mono, Inter Tight, Yellowtail).

## Static build (one page per case study)

```bash
node scripts/build-static.js
```

This writes `dist/` with `case-pocket.html`, `case-orbit.html` and so on instead of `case.html?p=…`, which suits any static host
(GitHub Pages, Netlify). Add `--fragment` to emit `index.html` without its `<html>`/`<head>`/`<body>` wrapper, for hosts that
add their own (this is how the claude.ai artifact preview is published).

## Illustrations as files

```bash
node scripts/export-illustrations.js
```

This writes all characters and stickers as standalone transparent SVGs to `assets/illustrations/`, ready to drop into Figma.

## Personalise

- Name and logo: search for `Daniyar` in `index.html`, `case.html` and `assets/js/case.js`.
- Email and social links: the contact section in `index.html` (`hello@yourname.com` is a placeholder).
- Projects, metrics and copy: `assets/js/projects.js`. The sample projects and their numbers are illustrative.
