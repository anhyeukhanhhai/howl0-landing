# PARA motion refinement

## Added motion

- One broad, original SVG gradient wave in the hero. It replaces the previous drifting material layer rather than adding a second animated background. Warm/deep gradient stops and the cached grain tile come from the approved brand/glass package. The headline side stays quiet; mobile confines the wave to the artwork region.
- The wave's two connected planes move slowly over 24 seconds per direction (32 seconds on mobile). Desktop pointer depth is capped at 14 px horizontally and 9 px vertically. The existing bilingual pause control also controls this ambient motion. Visibility and reduced-motion handling reuse `useVisibleAnimation`.
- Selective pointer-following highlights and fine edge reflections on the primary CTA, audience reading panel and portrait frames. Meaningful keyboard focus uses a stable highlight and existing focus outline. CTA targets do not translate or tilt. The CTA's brightest highlight retains a conservative 4.5:1 text contrast budget.
- Supporting photographs gain up to 3 degrees of inner-image tilt per axis and a 4 px depth plane. The outer frames/pointer targets remain stable. Existing entry movement is preserved on a separate parent. Tilt is disabled for coarse/touch pointers and reduced motion.
- Dark-mode QA found an existing navigation CTA with identical text/background colours. Its label and the primary CTA's pressed state now retain contrasting approved colours.
- Header glass and compact controls switch device-theme colours directly rather than crossfading text/fill through unreadable intermediate colours. Hover feedback remains in light opacity, edges and existing focus states.

No content, translations, section order, routes, logo geometry, learning-loop sequence, belief timing or waitlist behaviour changed. Previous uncommitted work remains preserved.

## Engineering

No dependencies or third-party source components were added. Native CSS/SVG and the existing scene hooks were sufficient; GSAP, Lenis and a WebGL renderer would add a second coordination system without a necessary benefit here.

Reviewed approaches:

- [React Bits Aurora](https://reactbits.dev/backgrounds/aurora) and its [public source](https://github.com/DavidHDev/react-bits/blob/main/src/content/Backgrounds/Aurora/Aurora.jsx).
- [Vanta WAVES](https://github.com/tengbao/vanta/blob/master/src/vanta.waves.js) and [FOG](https://github.com/tengbao/vanta/blob/master/src/vanta.fog.js).

No source from those projects was copied. The implementation uses original geometry and the supplied gradient recipes instead of shaders, noise generation or an extra renderer.

Property ownership:

- Wave group transforms: CSS keyframes.
- Enclosing wave depth: pointer coordinates only.
- Portrait pair entrance: existing scroll progress.
- Inner portrait depth: pointer coordinates only.
- Existing hero artwork: its scroll transform, with the previous ambient animation disabled.

`usePointerSurface` batches pointer updates into one requested frame, with no idle render loop. It resets on scrolling, resizing, pointer cancellation, leaving the viewport, hidden tabs and preference changes. Listeners, pending frames and observers are cleaned up on unmount. Decorative layers ignore pointer input. No foreground blur or continuously animated shadow/filter was added.

Reduced motion keeps the full static story; a no-JavaScript page retains the SVG background, content and CTA. Existing opaque glass fallbacks remain intact. Reduced transparency, explicit solid mode and forced colours suppress the new light overlays.

## Files for this task

- `src/components/GradientWave.tsx`
- `src/components/PointerSurface.tsx`
- `src/hooks/usePointerSurface.ts`
- `src/components/HomeIntro.tsx`
- `src/components/GlassSurface.tsx`
- `src/components/PerspectiveSwitcher.tsx`
- `src/components/PerformancePortraits.tsx`
- `src/app/interaction-motion.css`
- `src/app/para.css` (new stylesheet import)
- `scripts/verify-interaction-motion.mjs`
- This handoff

## Verification

Production build, TypeScript, ESLint, formatting and whitespace checks passed. Existing visual/routing, story and photography suites passed. Light/dark accessibility scans reported zero automated violations across both languages and desktop/mobile routes. Story checks retained the synchronised forward/reverse loop stages and the belief cycle's full three-second reading hold.

The new interaction suite covers Chromium and WebKit at 1440, 1024 and 390 px in English and Vietnamese: wave pause/resume and hidden/offscreen state, stable CTA targets, highlight contrast, keyboard surface focus, desktop photo depth, touch/reduced-motion fallback, dark navigation label and static no-JavaScript rendering. Chromium emulates reduced transparency through CDP; WebKit checks the explicit solid override rather than claiming unsupported preference emulation.

Before/after screenshots, cycle states at 0/12/24 seconds, dark/reduced states and interaction recordings are under `.qa/para-motion/`. Visual inspection covered hero, audience and portrait compositions in both languages at desktop, tablet and mobile sizes. Existing route tests cover additional sizes through ultrawide.

Remaining limitation: physical-device frame rate, energy use and real network conditions were not measured. Browser emulation and WebKit testing do not replace a final check on the founders' actual phones/laptops.

Local preview: `http://localhost:3004`. No commit, push or deployment performed.
