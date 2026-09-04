# Paystack State of Ecommerce

A responsive, editorial web experience exploring the evolution of ecommerce across Africa.

## Live demo

[View the deployed implementation](https://state-of-ecommerce.barnabas.lol/)

## Source code

[View the repository](https://github.com/BarnabasAsha/paystack-state-of-ecommerce)

## Run locally

### Prerequisites

- Node.js 20+
- pnpm

### Installation

```bash
pnpm install
```

### Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production checks

```bash
pnpm lint
pnpm build
```

## Key implementation decisions

- Built with Next.js, React, TypeScript, CSS Modules, and GSAP.
- Structured as a single long-form editorial page: hero, commerce timeline, and closing section.
- Built the hero artwork as a responsive DOM/CSS circle grid rather than a static image.
- Defined the Africa silhouette on a contained 13 × 16 logical grid, then placed it within the larger responsive circle grid.
- Modelled the timeline as phases containing years, with each year supporting one or more events.
- Used authored description lines and content-position variants because text wrapping and placement are intentional parts of the visual composition.
- Used a horizontally scrubbed timeline interaction on desktop, with responsive adaptations for smaller screens.
- Added reduced-motion handling for animated and scroll-driven interactions.

## Assumptions

- The experience is a single long-form editorial page, with the commerce timeline presented as a page section rather than a separate route.
- The supplied content is static for this exercise; no CMS, backend, or content-management workflow was required.
- Navigation links and CTA destinations were treated as presentational unless a destination or behaviour was specified.

## Tradeoffs

- I implemented the hero circle-grid visual with DOM and CSS rather than WebGL or Three.js. The DOM approach keeps the implementation lighter, responsive, easier to maintain, and compatible with reduced-motion preferences. A WebGL approach could support more elaborate particle behaviour or shader-driven animation, but would add complexity disproportionate to this exercise.
- The timeline is data-driven and supports phases, years, and multiple events per year, but its content is currently defined locally rather than connected to a CMS.
- The supplied design used a very low-opacity treatment for the timeline phase title. I increased its opacity from approximately 30% to 60% to improve contrast and readability, while preserving its intended muted hierarchy.

## AI usage

I used Claude Code as a collaborative implementation aid, while retaining responsibility for the final design and engineering decisions.

### What I worked through independently

- The overall implementation of the page sections, including their HTML structure, layout, styling, responsiveness, and visual refinement.
- The event timeline content model, including phases, years, events, authored description lines, visual vectors, and content-position variants.
- The interaction and visual design decisions needed to match the supplied design direction.

### Where I used AI (Claude Code)

- Implementing and iterating on the `HeroCircleGrid` component.
- Horizontal-scroll/pinned interaction for the events timeline and the initial shape of the timeline data model.
- The reveal/scroll-transition system across the hero, commerce timeline, and closing section — reusable split-text, slide, and grid-stagger reveal recipes, plus reduced-motion handling throughout.
- Debugging several GSAP- and React-specific issues surfaced along the way: animations conflicting with pre-hidden elements, timeline pause/resume sequencing, and a React effect-timing race that left the hero grid's reveal animation running on cells that didn't exist yet.
- Mobile-responsive fixes for the commerce timeline section (vector scaling, font sizing, vertical overflow).
- Explored a pinned "section scroll" paging feature across several iterations; ultimately removed it after it kept conflicting with the commerce timeline's own pinned scroll behaviour.

### What I changed or rejected

The initial approach for the hero grid was to plot the Africa shape across the entire responsive grid. I rejected that approach because it made placement, scaling, and responsive repositioning unnecessarily complex.

Instead, I chose to define the Africa silhouette on a contained 13 × 16 logical grid, then place that smaller shape within the larger responsive circle grid. This makes the silhouette easier to scale, reposition, and adapt across desktop, tablet, and mobile breakpoints.

I also refined the timeline data structure so phases contain years, and years contain one or more events. This keeps the model aligned with the visual timeline while supporting multiple events in the same year.

### Validation

- Compared the implementation against the supplied Figma design throughout development.
- Tested responsive behaviour across desktop, tablet, and mobile breakpoints.
- Reviewed motion and scroll behaviour in the browser, including event reveals, active timeline markers, pinned horizontal scrolling, and reduced-motion handling.
- Reviewed and adjusted AI-assisted output to fit the desired interaction, visual system, and code structure.
