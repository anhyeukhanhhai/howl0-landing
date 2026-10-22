# PARA learning-loop Gradient Waves

## Source and scope

Integrated the actual React Bits **Gradient Waves, TypeScript + plain CSS** source at revision `14330e6963f6c5ddd773ee2af844d0630c22b958`. Both shader strings were compared with the pinned upstream source and match exactly. Provenance, original SHA-256, local lifecycle adaptations and the full MIT + Commons Clause notice are retained in `src/components/react-bits/GradientWaves/`. A public copy of the notice is at `/notices/react-bits-gradient-waves.txt`.

Documentation: <https://reactbits.dev/backgrounds/gradient-waves>

Only the learning-loop scene was changed. The existing hero wave is a separate, unchanged CSS/SVG composition. No other homepage sections, routes, copy, translations, product claims, dependency versions or backend behaviour were changed. Previous uncommitted work was preserved. No commit, push or deployment was performed.

## Visual integration

- Slow satin-like waves use Sand, Saddle Brown, Ivory and Espresso from the current PARA package, with restrained lighting and the existing cached grain tile.
- Removed the loop's old decorative material element to avoid stacking backgrounds.
- Local layer stack: static fallback, WebGL waves, readability scrim, loop artwork, headline and controls. The background is confined to the sticky scene and cannot intercept input.
- The headline area stays quiet; the centre has a local reading scrim. Dark-mode labels have solid Espresso contrast planes, and the approved stage icons have an Ivory backing without changing their geometry.
- The existing bilingual pause/resume labels are reused for a discreet native button. It does not affect lesson progress.

## Behaviour and budgets

`LoopWaves` is memoised and lazy-loads the renderer near the viewport. It never reads or writes the loop's scroll progress or stage. The original opening title, five-stage sequence, single headline, geometry and reverse-scroll behaviour remain intact.

No WebGL library was added. The actual component uses native WebGL2. Desktop rendering is capped at 1100 × 700 pixels and 30 draws per second; mobile uses lower resolution and 24 draws per second, without pointer lighting. Click swells and shader-generated grain are disabled.

Rendering stops below 10% visibility, in hidden tabs and when paused. Wave time is retained across ordinary scene departure/re-entry. Reduced motion, forced colours and initial data-saving preference avoid creating the renderer. Context loss, unavailable WebGL or sustained frame gaps trigger the static fallback. Programs, shaders, buffers, vertex arrays, contexts, listeners, observers and pending frames are cleaned up on unmount.

The performance fallback uses sustained rendered-frame gaps over 100 ms for 2.5 seconds. It is a conservative safety measure, not a guarantee about every device or a replacement for physical-device profiling.

## Files

- `src/components/SubmissionFlow.tsx`: mount atmosphere and remove old decorative material only. Prior settling/glass changes preserved.
- `src/components/LoopWaves.tsx`: loading, eligibility, palette, settings, pause control and fallback.
- `src/components/react-bits/GradientWaves/`: actual TSX/CSS component, licence and provenance.
- `src/app/loop-waves.css`: loop-scoped integration and contrast.
- `src/app/para.css`: stylesheet import.
- `public/notices/react-bits-gradient-waves.txt`: full source notice.
- `scripts/verify-loop-waves.mjs`: renderer, lifecycle, stage and failure tests.
- `scripts/verify-story.mjs`: park the pointer before entering the belief scene, preventing incidental hover from changing the phrase under test. Production belief logic and timing were not changed.
- This handoff.

## Verification

- Production build, TypeScript, ESLint, formatting and whitespace checks passed.
- New wave suite passed in Chromium and WebKit, both languages, at 1440, 1024 and 390 px. Verified actual rendering, draw limits, pointer/touch settings, pause/resume, hidden/offscreen stopping, monotonic wave time during forward/reverse stage changes, one canvas, cleanup, no overflow and reduced-motion presentation.
- Simulated unavailable WebGL, context loss and sustained slow-frame conditions correctly removed the renderer and retained content/static background. Simulated frame gaps are not physical-device benchmarks.
- Failed renderer-chunk loading and JavaScript-disabled Vietnamese mobile presentation retained the static background and readable loop content. The public source notice was verified as available.
- Existing story suite passed, including single synchronised headlines, reverse scrolling, static story and the unchanged belief reading hold/interactions.
- Existing route/visual suite passed across both languages and sizes through ultrawide, including navigation, history, redirects, menu, tabs, form and dash-punctuation checks.
- Light/dark automated accessibility route scans passed. Additional scans of the active dark feedback stage passed in both languages at all three sizes after the contrast fix.
- Native keyboard pause/resume, client navigation resource release and English desktop/Vietnamese mobile scroll walkthroughs passed.
- Screenshots and recordings: `.qa/para-loop-waves/final/` and `.qa/para-loop-waves/video/`. Reviewed representative opening, active and next-step states, light/dark desktop/tablet/mobile layouts and fallbacks.

Remaining limitation: real-device GPU frame rate, battery use and sustained thermals were not measured. Browser emulation/WebKit checks cannot establish those. No visible clipping, layout shift or interaction regression remained in the inspected cases.

Local preview: `http://localhost:3004`.
