# PARA appearance and interaction polish

This pass uses the current version as its baseline. Copy, translations, section order, stages, headline thresholds, belief timing, links, routes, form state and approved assets are unchanged. No dependency was added.

## Refinements

- Balanced headline wrapping, CTA spacing and artwork footprint. Vietnamese belief text uses natural paragraph wrapping rather than breaking the phrase “tín hiệu” through automatic balancing.
- Tablet navigation switches to the existing native menu at 1100px, allowing long Vietnamese labels room. The same focus trap, Escape handling, language action and scroll restoration apply. Desktop resize closes the menu.
- Audience text sits centrally in its reserved stable-height reading surface. The supplied warm material adds restrained detail behind Quiet Glass. Raised shadows use the package's existing material levels; radii remain 12px for panels.
- Buttons, language/menu controls, links and audience tabs have consistent hover, focus and pressed feedback. The clean closing logo aligns with the text column.
- Loop artwork settles over a 55ms time constant while the document continues native scrolling. A single settled progress drives the stage, headline, path and traveller. Anchor jumps and refresh/resize synchronise immediately. Frames stop when settled, offscreen or hidden, and listeners/observers are cleaned up.
- Loop visual transitions settle alongside the existing 340ms headline entrance. Outgoing decorative symbols and old next-step text become hidden immediately, avoiding double exposure while the new visual enters. Audience panes also avoid overlapping readable text.
- The belief cycle source remains unchanged: 400ms transitions plus 3000ms reading holds, with the existing interaction and visibility pauses.

## Source evaluation and licences

Reviewed the public implementations and licence sources below. No code or component was copied, vendored or installed, so there are no new third-party notices to distribute.

- [Lenis source](https://github.com/darkroomengineering/lenis/blob/main/packages/core/src/lenis.ts), [MIT licence](https://github.com/darkroomengineering/lenis/blob/main/LICENSE): evaluated its scroll interpolation and lifecycle approach. The refinement smooths only scene progress, retaining the browser's document scrolling and touch behaviour.
- [GSAP core source](https://github.com/greensock/GSAP/blob/master/src/gsap-core.js), [standard licence](https://gsap.com/community/standard-license/): timeline coordination and scoped cleanup were considered. The existing CSS/SVG and passive frame loop already own these properties; adding a second coordinator offered little benefit here.
- [React Bits AnimatedContent](https://github.com/DavidHDev/react-bits/blob/main/src/content/Animations/AnimatedContent/AnimatedContent.jsx), [licence](https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md): reviewed its reveal, reduced-motion and cleanup techniques. Existing semantic heading wrappers and CSS transitions were refined directly. The current licence includes Commons Clause conditions; this is not recorded as a plain MIT dependency.
- [Vanta base source](https://github.com/tengbao/vanta/blob/master/src/_base.js), [MIT licence](https://github.com/tengbao/vanta/blob/master/LICENSE.md): the renderer, animation loop and resource lifecycle were evaluated. A separate 3D background would compete with the supplied grain artwork and add rendering work, so none was introduced.

## Files

- `src/app/finish.css`, imported by `src/app/para.css`: visual finish and responsive treatments.
- `src/hooks/useScrollProgress.ts`: optional scene-progress settling and visibility cleanup; existing callers retain their default behaviour.
- `src/components/SubmissionFlow.tsx`: opts into settling and the supplied raised material.
- `src/components/PerspectiveSwitcher.tsx`: uses supplied Quiet Glass elevation.
- `src/components/Navigation.tsx`: matches the tablet presentation breakpoint.

## Validation and review artifacts

Build, TypeScript, ESLint, formatting, routing, material and story checks passed. Both languages were inspected at 1440, 1024 and 390px, including forward/reverse scroll, intermediate visual states, keyboard interaction, reduced motion, glass fallbacks and responsive resizing. Additional Chromium and WebKit device checks covered small phones, landscape, tablets, laptops and ultrawide layouts. Light/dark automated accessibility scans reported zero violations.

Before/after captures are under `.qa/para-polish/before/` and `after/`. Final desktop English and mobile Vietnamese transition recordings are `.qa/para-polish/scroll-en-1440.webm` and `scroll-vi-390.webm`. The existing story suite also captures scroll recordings under `.qa/para-focus/`. Tablet menu focus restoration and resize cleanup were checked separately in both languages. Git comparison confirms no edits to dictionaries, metadata, belief-cycle logic, package dependencies or waitlist implementation.

Physical-device GPU performance and screen-reader certification remain outside these browser-emulation checks. The production preview runs on port 3003. No commit, push or deployment was performed.
