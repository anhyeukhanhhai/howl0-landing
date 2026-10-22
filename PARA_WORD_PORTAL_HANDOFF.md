# PARA hero to learning loop transition

## Implementation

The opening is now typography led, with the existing headline, positioning, actions and navigation. The old hero artwork and its ambient field are not mounted in this opening. Copy dictionaries and translations are unchanged.

`HeroLoopJourney` owns one section scoped sticky viewport and one native scroll progress measurement. The repository has no GSAP, ScrollTrigger or Lenis dependency, so the existing demand driven requestAnimationFrame coordinator was reused. No dependencies were added.

The phases are hero reading, hero departure, word entrance and hold, word expansion, loop introduction and the existing learning sequence. The loop receives zero progress until the introduction is complete. Its original 12 percent opening hold, five stages, one headline and traveller synchronization are preserved, including reverse scrolling.

The decorative SVG uses the exact four paths, offsets, counter geometry and proportions from `design-resources/PARA_Brand_Resources/01_LOGO/Solid/Web/para-wordmark-white-optical.svg`. It is not typed text or a redrawn approximation. The official navigation logo is unchanged. The camera zooms into the R's solid lower stem at source coordinate (392, 170), with analytically calculated viewport coverage and overscan. Only uniform scaling and translation are applied.

The same `LoopWaves` instance and static fallback sit behind the mask and the revealed loop. There is no second canvas or WebGL scene. The wave holds a static rendered frame behind the word, then resumes with its existing pause control as the loop appears. Its original offscreen, hidden tab and preference handling remain intact.

The physical `#submission-flow` anchor sits outside the sticky viewport at the introduction position. Later fragment clicks and browser history remain native. Initial fragments are corrected once after fonts and layout settle, including `#waitlist` and `#top`. A session scoped pagehide snapshot corrects reload restoration when hydration changes scene height; it never runs as a scroll system or changes history entries.

Hidden hero actions and the covered loop are inert and excluded from assistive technology. The transition SVG is decorative. Reduced motion, forced colours, very short landscape windows and JavaScript disabled presentation use normal document flow. Semantic headings, original CTAs and the complete static loop explanation remain available.

## Files for this transition

- `src/components/HeroLoopJourney.tsx`
- `src/components/ParaWordPortal.tsx`
- `src/app/hero-loop-journey.css`
- `src/components/HomeIntro.tsx`
- `src/components/SubmissionFlow.tsx`
- `src/components/LoopWaves.tsx`
- `src/components/pages/HomePage.tsx`
- `src/hooks/useScrollProgress.ts`
- `src/app/para.css`
- `scripts/verify-word-portal.mjs`
- `scripts/verify-story.mjs`
- `scripts/verify-loop-waves.mjs`
- `scripts/verify.mjs`
- `scripts/verify-materials.mjs`
- `scripts/verify-interaction-motion.mjs`
- This handoff.

The local commit also includes the previously pending PARA photography, glass, pointer interaction and Gradient Waves implementation required by the current baseline, its optimized public assets, tests, source notice and handoffs. Original `design-resources/` files remain untouched and uncommitted. The application does not need the original source ZIP to run; asset provenance checks and image preparation scripts use the locally supplied source package.

## Verification

- Production build generated all 22 routes successfully. TypeScript, ESLint, formatting of changed files and whitespace checks passed.
- A final TypeScript run found four identical generated `.next/types/* 2.ts` copies conflicting with canonical generated types. The duplicates were compared byte for byte and moved to `.qa/para-portal/duplicate-generated-types/`, not deleted. TypeScript passed afterward. No source or Git reference was changed by this cache cleanup.
- Portal suite passed in Chromium and WebKit at 1440 × 900, 1024 × 900 and 390 × 844, in both languages. It checks exact approved path geometry, full viewport coverage before handoff, one wave canvas, gated stages, stable headline space, reverse and fast scrolling, reload, resize, landscape fallback, native anchors/history, reduced motion and JavaScript disabled flow.
- Final deep link checks cover initial waitlist, loop and top fragments in the same twelve browser, size and language combinations. The portal suite also checks same document waitlist and top navigation, waiting for native smooth scrolling to settle.
- Existing route interaction suite passed, including languages, redirects, history, audience tabs, FAQ, mobile menu and truthful two field waitlist behavior.
- Existing story tests passed for English desktop and Vietnamese mobile, including the unchanged belief focus reading hold and interaction controls.
- Wave renderer regression passed on Vietnamese mobile: actual shader, resolution/frame cap, touch lighting, pause, visibility, reverse sequence, resource cleanup and static fallback.
- Existing glass and brand material suite passed across both languages and all three sizes, including exact production asset provenance, fonts, transparency fallback, reload, resize, anchors and no JavaScript content.
- Existing pointer/glass/photo interaction suite passed on mobile Chromium and WebKit in both languages.
- Sixteen targeted WCAG A/AA scans across the hero, word hold, loop introduction and response stages at desktop and mobile found zero violations.
- Representative desktop, tablet, mobile, English, Vietnamese, dark, intermediate mask and reduced motion screenshots were inspected. Evidence is under `.qa/para-portal/final/`. A short forward and reverse recording is `.qa/para-portal/final/portal-walkthrough-en.webm`. QA outputs are intentionally ignored by Git.

The attached reference recording was not available in this session. The written choreography was used. Browser emulation and WebKit are not physical phone GPU, battery or thermal profiling. Such profiling remains a real device review task. No deployment or push was performed.

Local production preview: <http://localhost:3004>.
