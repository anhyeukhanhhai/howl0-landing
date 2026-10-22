# PARA homepage photography

## Composition

- `Grainy Nirvana Guitar Stage Lights.png` is the belief scene's atmospheric image. Its open left side supports the existing statement on desktop. A separate Espresso scrim protects text; the image itself has restrained saturation and contrast. Below 901 px, the complete landscape photograph sits above the statement rather than being cropped into a portrait background.
- `Grainy Retro Guitar Duo on Stage.png` is the larger portrait at the opening of the existing closing scene.
- `Grainy Bassist in Sunlit Crowd.png` is the smaller, vertically staggered companion. Both portraits retain their original framing, with quiet Ivory frames and existing brand shadow/radius tokens. The approved clean logo sits alongside them on desktop and below them on mobile.
- No captions, locations, affiliations, testimonials or product claims were added. Existing visible copy and dictionaries are unchanged. Only informative image alt text was added in English and Vietnamese.

## Motion and delivery

- The background uses one entrance scale settle, from 1.015 to 1. The portrait pair uses one shared 10 px entrance translation. Both reuse existing section progress and become static with reduced motion. There are no continuous photo animations, new listeners or dependencies.
- Originals remain unchanged in `design-resources/images`. `scripts/prepare-performance-images.mjs` produces WebP derivatives using the existing Sharp dependency. `public/images/performance/provenance.json` records original hashes and output dimensions.
- Export sizes: landscape 1436 × 1095, 419,400 bytes; duo 900 × 1358, 249,414 bytes; bassist 800 × 1421, 193,956 bytes.
- Next Image supplies responsive optimised delivery. All photographs are below the fold and lazy loaded. Explicit dimensions/aspect ratios reserve space. At DPR 2 the three responses total 135,498 bytes at 390 px and 441,243 bytes at 1024/1440 px in the tested browser.

## Files for this task

- `src/components/BeliefMoment.tsx`
- `src/components/WaitlistSection.tsx`
- `src/components/PerformancePortraits.tsx`
- `src/app/photography.css`
- `src/app/para.css` (photography import only, existing finish import preserved)
- `scripts/prepare-performance-images.mjs`
- `scripts/verify-photography.mjs`
- `public/images/performance/` (three derivatives and provenance)
- This handoff

Previous uncommitted polish changes were preserved. No routes, backend infrastructure, dependencies, learning-loop logic or belief-cycle timing were changed. The waitlist remains an honest preview that does not save submissions.

## Validation

- Production build, TypeScript, ESLint, Prettier and `git diff --check` passed.
- Existing visual, storytelling and device suites passed, including English/Vietnamese routing, navigation, language switching, waitlist state, dash punctuation, learning-loop synchronisation/reverse scrolling and belief focus timing/interactions.
- Automated accessibility scans passed in light and dark modes, both languages, desktop and mobile. These scans do not replace manual accessibility testing.
- Chromium and WebKit device checks passed, including phone, tablet, laptop and ultrawide layouts.
- `node scripts/verify-photography.mjs` passed both languages at 1440, 1024 and 390 px with DPR 2. It verifies source hashes, image optimisation, aspect ratios, lazy loading, reserved height, no overflow/browser errors, and reduced-motion photo transforms.
- Before/after screenshots are in `.qa/para-photos/`. Final screenshots were reviewed in both languages across desktop, tablet and mobile. Forward/reverse scroll recordings were captured in `.qa/para-photos/walkthrough/` for English desktop and Vietnamese mobile.
- Physical-device frame rate and real network performance were not measured. Browser device emulation and WebKit checks are not a substitute for a final review on the founders' own phones.

No commit, push or deployment was performed. Local production preview: `http://localhost:3004`.
