# PARA creative-studio homepage handoff

Local work on the existing `feat/reposition-progress-visibility` branch, based on `550b40e`. No commit, push, merge or deployment was made. Original resource folders and unrelated work are preserved.

## Reference inspection and source priority

The latest creative brief controls composition and motion. The live English `https://www.howl0.com/` was inspected in Chrome after selecting the English home link. Examined the hero at different moments, floating assignment card, stage highlights, learning rail, all three audience tabs, belief, closing/footer and forward/reverse scroll positions. The first headless request timed out; the native-browser fallback succeeded. Local production verification uses Playwright browsers and screenshots rather than claiming physical-device certification.

Git history was inspected read-only, especially `9f235fd` and the original `HeroLoopPreview`, `PracticeLoop`, `SubmissionFlow`, `BeliefMoment`, `scroll.css` and `responsive-motion.css`. Recovered principles: floating capsule travel, stage highlighting, path-length drawing, SVG `getPointAtLength` traveller, contextual feedback wave and scroll-aware visibility. These were adapted, not restored by resetting history. The older files remain available.

The exact `PARA_Refined_Logo_Package` assets remain the authority for brand geometry. Neither logo component nor artwork was changed. New ribbon/loop artwork is separate editable SVG geometry, not a wordmark approximation. Shared fonts and Warm Signal tokens remain from the PARA packs; no Studio Green, literal instruments, musicians, stock pictures, scores or dashboard screenshots were introduced.

## Five connected scenes

1. **The learning signal:** oversized editorial headline with masked phrase entrance; one concise music-learning-platform sentence and development disclosure; large open-signal ribbon, floating assignment capsule, recording wave, teacher markers and next-practice opening. All five stage labels remain visible. The 11-second ambient cycle has Pause/Resume and manual stage controls, without autoplay audio.
2. **The learning loop:** one coordinated path instead of five feature cards. Native scroll draws the route, advances its traveller, highlights Assign / Practise / Submit / Respond / Next step, adds feedback pins and reveals a next-practice instruction. All five short explanations remain readable. Desktop uses 150svh total, less than one additional screen of travel. Mobile and screens at or below 740px height do not pin.
3. **Three perspectives:** the same signal diagram becomes teacher feedback, a student practice path or a contextual history of attempts. Only user interaction changes tabs. The indicator glides, the art crossfades, and all text contributes to a stable grid height. Arrow keys/Home/End, focus and no-JavaScript fallback remain supported. Parent access is qualified as being explored and authorised.
4. **The belief:** a feedback-path marker meets an expanding cocoa/raspberry boundary; the complete sentence settles into a large, stable reading scene. A fine signal is traced beneath it. The short supporting sentence is from this brief. Vietnamese headings are sized independently to avoid orphaned words and preserve diacritics.
5. **The open loop:** a quiet path resolves beside the exact PARA wordmark. Development copy and a real product-discovery link lead into the existing disabled two-field form. No ambient motion around fields; no invented storage, upload, pilot or success functionality.

Signature transitions use deliberate masks, crossfades and shared-position transformations. Incompatible SVG paths are not interpolated. The implementation reuses native CSS/SVG and existing passive requestAnimationFrame/IntersectionObserver hooks; no animation dependency was added. Native scrolling, reverse scroll, anchors, history, language choice and routes are unchanged.

## Accessibility and resilience

- Reduced motion: no continuous movement, no pinning, complete static stage/loop content; manual stage selection remains available.
- Hero visibility follows viewport and document visibility; explicit pause persists across viewport changes. No audio exists.
- Semantic headings retain their complete text; phrase wrappers do not produce duplicate screen-reader text. Copy remains available without animation or JavaScript.
- Visible keyboard focus, 44px controls, accessible tab semantics and stable tab layout are retained. The sticky header is accounted for by anchor padding.
- All product sequences are visibly labelled as concepts/in development. Name and Email remain disabled; the unchanged backend adapter stores nothing.

## Files changed or added

- `src/app/studio.css` (new): scoped scene typography, layout, signature transitions, mobile/reduced-motion/dark treatments.
- `src/app/para.css`: imports the scoped scene stylesheet.
- `src/components/SceneHeading.tsx` (new): semantic phrase masks.
- `src/components/PerspectiveSignal.tsx` (new): one SVG, three perspectives.
- `src/components/HomeIntro.tsx`, `SignalStory.tsx`, `SubmissionFlow.tsx`, `PerspectiveSwitcher.tsx`: the first three scenes.
- `src/components/BeliefMoment.tsx`: homepage-only immersive mode; the Why page retains its existing presentation.
- `src/components/WaitlistSection.tsx`: quiet branded closing; existing form/backend untouched.
- `src/components/pages/HomePage.tsx`: five-scene assembly.
- `src/hooks/useScrollProgress.ts`, `useVisibleAnimation.ts`: enter/exit progress and visibility/reduced-motion/explicit-pause handling.
- `src/lib/studio.ts` (new), `src/lib/i18n.ts`: concise EN/VI scene copy and homepage labels. New Vietnamese scene/technical labels should receive native editorial review.
- `scripts/verify-story.mjs` (new), `scripts/verify.mjs`, `scripts/verify-devices.mjs`, `package.json`: story regression coverage, updated homepage expectations, 1024px coverage and screenshots/videos.
- `README.md`, `PARA_STUDIO_HANDOFF.md`: current implementation and handoff.

No dependencies, lockfile, route handlers, infrastructure, logo assets, storage or language cookie identifiers changed.

## Verification

The final production run passed:

- `npm run format`, `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run build` and `git diff --check`.
- `npm run test:visual`: all seven English/Vietnamese page pairs at 390, 430, 768, 1024, 1440, 1920, 2560 and 3440px widths; routing, language/history, redirects, anchors, tabs, FAQ, disabled two-field form, menu, ambient pause and reduced motion.
- `npm run test:story`: both languages at 1440, 1024 and 390px; five manual hero states, forward/reverse loop progression, stable audience views, keyboard tabs, slow/fast native scrolling, reduced-motion static content and scene captures. No runtime console errors were found.
- `npm run test:devices`: Chromium phone/Android/landscape/tablet/short laptop/laptop/desktop/ultrawide and WebKit iPhone/landscape/MacBook emulation, including dark mode, live theme changes and responsive menus.
- `npm run test:a11y` and `COLOR_SCHEME=dark npm run test:a11y`: zero automated violations across the welcome page and all English/Vietnamese routes at desktop/mobile, including expanded menus, tabs and FAQ states.
- Additional checks passed for byte-identical approved logo assets, live resizing through mobile/tablet/ultrawide/short-screen layouts, live reduced-motion switching and no-JavaScript content.

Screenshots were rendered and manually inspected in both languages at desktop, tablet and mobile sizes, including hero, active loop/feedback, audience, belief and closing states. Fixes included heading overhang, Vietnamese wrapping, dark active-label contrast, an SVG fill, mobile CTA spacing and ultrawide sticky-scene height. Native Chrome was also used to inspect live reference motion and the local desktop hero/loop; the recorded walkthroughs supplement those checks, not physical-device testing.

Artifacts are ignored under `.qa/para-studio/`. Story captures include hero states, five-stage scroll positions, each audience view, belief/closing, and reduced motion. `story/walkthrough-en-1440.webm` and `story/walkthrough-vi-390.webm` record short forward/reverse native-scroll walkthroughs.

## Remaining limitations

The waitlist does not save data and stays disabled. Upload/review/guardian workflows are concepts, not a functioning platform. Backend/email, privacy/consent/minors' access, retention, legal/contact details and approved favicon/social-preview art remain separate decisions. Native Vietnamese editorial review remains advisable. Tests emulate browsers/devices; performance on physical hardware and assistive-technology certification are not claimed.
