# PARA / Sandalwood material homepage

Built locally on the existing `feat/reposition-progress-visibility` branch, starting from `c5f3dd3`. No commit, push, deployment, backend or infrastructure change. The existing untracked source resource folders were preserved.

## Sources and approved assets

Read the new package's start file, designer/developer guide, logo, typography, palette, icon, artwork and material guides; reviewed the manifest, asset registers, quality decisions and font licences. Visually inspected the overview, logo suite, icon specimens, EN learning artwork and material boards. This package supersedes all earlier PARA palettes and the handwritten wordmark.

The live Howl0 site was inspected in native Chrome after choosing English: hero at multiple moments, floating assignment link/stages, learning rail, audience interaction and belief/closing scroll positions. Git history was inspected read-only (`9f235fd`, including the original hero preview and SVG traveller). Existing native CSS/SVG and passive scroll/visibility hooks are retained; no animation library or dependency was added.

37 source-identical production assets are copied to `public/brand/para/resources/`, with paths and SHA-256 hashes in `asset-provenance.json`. `npm run brand:sync` regenerates the allowlist; it does not alter source artwork.

- Exact Musical Window horizontal optical exports: solid Espresso/Ivory for navigation and small reproduction; approved light/dark grain for the larger closing/footer. At narrow phone widths the closing uses solid geometry rather than shrinking grain below its recommended size. The logo is never reconstructed, morphed, recoloured or filtered.
- Plus Jakarta Sans variable WOFF2 at heading weight 600; Be Vietnam Pro 400/500/600, with the original OFL licences. Both are self-hosted; only heading/body regular are preloaded.
- Espresso `#3B2F2A`, Saddle Brown `#8B5E34`, Sand `#D6B98C`, Ivory `#F3EDE2`; selective Cool Grey is retained inside the supplied artwork. Derived Espresso Strong, Paper Soft and Border Strong match the package. Legacy CSS variable names are compatibility aliases, not extra colours.
- Correct EN/VI listening grain artwork on sufficiently wide screens. Smaller screens use the listening expressive symbol with real localised HTML labels. No literal guitar, practising-person artwork or stock imagery is rendered.
- Expressive assignment, rhythm, recording, feedback, next-step and other contextual symbols for storytelling. Application icons remain solid 24-unit sources in controls. Legacy `arrow-right` and `alert` names map to the new `forward` and `warning` assets.
- Supplied warm/deep/quiet WebP material fields and the original grain tile. Grain remains raster, not claimed as vector. No live noise filter or shader runs.

App tiles and favicons marked `PROPOSAL` are not shipped. No replacement mark was invented. No real photography is needed for this abstract treatment.

## Scenes, glass and signature transitions

1. **Learning signal:** semantic masked headline phrases and concise platform sentence. Approved listening artwork sits within a grain-material interval; a frosted task capsule moves into an existing-recording waveform, timestamp markers and teacher feedback. Manual stages and Pause/Resume remain. The full five-stage meaning is visible without waiting for the 11-second cycle.
2. **Connected learning loop:** the hero contour unfolds into one native-scroll SVG route. A traveller advances through Assign / Practise / Submit / Respond / Next step, while approved expressive symbols crossfade, a recording surface settles into place and timestamped teacher feedback appears. Desktop uses 150svh total, not multiple empty screens; mobile and short screens are unpinned.
3. **Three perspectives:** user-controlled accessible tabs change one shared signal diagram and contextual symbol. Stable overlapping text panes prevent page jumps. Parent understanding remains authorised, teacher-guided and exploratory, not surveillance or a built report feature.
4. **Belief:** a marker/path expands into an Espresso/grain boundary. Large complete phrases remain readable, with Sand emphasis and a fine signal trace. No grades, automatic analysis or promised outcomes.
5. **Open loop:** the route resolves around the exact grain logo. The development copy, product-discovery action, disabled Name/Email form and footer remain quiet and truthful.

Glass uses palette-tinted 91% Ivory surfaces, a static 12px backdrop blur, fine functional borders, soft shadows and edge highlights. Navigation uses 94% of the active surface. Headlines remain on clear backgrounds; forms and audience copy remain opaque. There are no stacked continuously blurred panels or animated blur/gloss. Mobile removes artwork backdrop blur. Unsupported blur receives opaque surfaces; `prefers-reduced-transparency` explicitly restores opacity and removes blur. Dark scenes keep overlay text Espresso on an Ivory glass base.

Compatible path drawing, position/scale transforms, masks and deliberate crossfades are used—not incompatible path interpolation. No scroll hijack, sound, pointer requirement or new splash screen. The existing welcome language-choice page and routes remain intact.

## Accessibility and resilience

Keyboard focus, 44px targets, tab Arrow/Home/End controls, language switching, menu focus/Escape, anchors and history are retained. English/Vietnamese have independently tuned heading sizes, line heights and wrapping. Essential text is semantic, selectable and available without JavaScript. Reduced motion removes continuous animation and pinning, with all five stages and a complete static story. Visibility observers pause hero motion offscreen and when the document is hidden; manual selection pauses it too.

No copy claims live uploads, AI analysis, operational guardian access or successful registration. The unchanged waitlist adapter stores nothing and the two fields remain disabled, with a clear preview/development message.

## Changed files

- `src/app/para-tokens.css`, `para.css`, `studio.css`, new `material.css`: foundations, font setup, new scenes/glass, inverse and responsive treatments.
- `src/components/BrandLogo.tsx`, `BrandHead.tsx`, `ParaIcon.tsx`, `ParaFigure.tsx`, new `ExpressiveIcon.tsx`: exact production assets and two icon families.
- `src/components/SignalStory.tsx`, `SubmissionFlow.tsx`, `PerspectiveSignal.tsx`, `BeliefMoment.tsx`, `WaitlistSection.tsx`: coordinated artwork and motion layers.
- `src/components/pages/ProductPage.tsx`: supporting storytelling icons from the current package.
- `src/lib/viewport.ts`: matching browser theme colours.
- `scripts/sync-brand-assets.mjs`, `scripts/verify-materials.mjs` (new); existing visual/device/story scripts and `package.json`: asset provenance, current-brand assertions, glass/transparency, refresh/resize and screenshots.
- `public/brand/para/resources/`: 37 exact assets plus provenance record.
- `README.md` and this handoff.

Routes, translations, waitlist storage, consent behaviour, lockfile and original brand-source files are not changed.

## Verification

Passed checks:

- Formatting, ESLint (no warnings), TypeScript, production build (22 route entries) and `git diff --check`.
- `test:visual`: all seven English/Vietnamese route pairs at 390, 430, 768, 1024, 1440, 1920, 2560 and 3440px. Welcome/language choice, redirects, history, audience tabs, FAQ, menu focus/Escape, truthful two-field form, anchors, ambient pause/offscreen behaviour and reduced motion passed. Repeated against the production build to verify emitted CSS and routing.
- `test:devices`: Chromium small phone, Android, landscape, tablet, short laptop, laptop, desktop and ultrawide; WebKit iPhone portrait/landscape and MacBook emulation. All dark routes, live theme changes, layout and menu checks passed.
- `test:a11y` in light and dark: zero automated violations across welcome and all EN/VI routes, expanded menus, audience tabs and FAQ states at desktop/mobile. These scans were run against the completed design; the final VI heading-only size adjustment was then visually and structurally rechecked in production.
- `test:story`: EN/VI at 1440, 1024 and 390px. Five stages, forward/reverse progression, stable audience heights, keyboard tabs, slow/fast native scrolling, reduced-motion static content and header-safe anchors passed. After fixing a Vietnamese heading orphan, only the affected VI 1440/390 scenarios were rerun and their captures/video updated.
- `test:materials`: all 37 production assets match source bytes and the package checksum manifest. Exact responsive logos, correct fonts and language-specific artwork, desktop blur, mobile no-blur, emulated reduced-transparency opaque fallback, refresh mid-scroll, live resizing, anchors and no-JavaScript content passed against the final production build. No failed asset requests or runtime errors were found.
- Extra production captures checked assignment-to-recording and timestamp-feedback transitions at 350ms, the partially expanded belief boundary, and dark glass in EN/VI at 1440/390px. Native Chrome scrolling also verified the live reference and local production hero/loop at ultrawide size.

Screenshots were rendered and manually inspected in both languages at 1440, 1024 and 390px, including hero, active loop, three perspectives, belief and closing. Concrete fixes included a missing legacy-to-new icon mapping, compiler handling of duplicate blur declarations, narrow-phone logo sizing/clear space, Vietnamese headline wrapping and current-palette test expectations.

Current screenshots are under ignored `.qa/para-material/`; story captures and `walkthrough-en-1440.webm` / `walkthrough-vi-390.webm` are under its `story/` folder. `intermediate/` contains transient-state and dark-glass captures. Initial `first/` images are diagnostic captures, not final deliverables. No physical-device smoothness or screen-reader certification is inferred from these results.

## Decisions still requiring review

- Choose and approve app/favicon adaptations separately; none of the proposed marks was silently adopted.
- Native Vietnamese editorial review remains advisable, especially explanatory concept labels within the supplied artwork.
- A working waitlist/backend, contact/legal identity, privacy/consent/minors' access and retention remain separate product/legal decisions.
- Physical-device performance and assistive-technology certification are not claimed by browser emulation or automated accessibility scans.
