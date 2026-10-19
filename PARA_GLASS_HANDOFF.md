# PARA glass refinement

Source: `design-resources/PARA_Brand_Resources/PARA_Glassmorphism_Resources/`.
The supplied Musical Window logo, Sandalwood palette, fonts and artwork remain unchanged.

## Material system

- Ivory Frost: assignment and recording surfaces; supplied 76% fill, 18px desktop / 10px mobile blur.
- Espresso Smoke: compact teacher-feedback markers; 82% fill, 20px desktop / 10px mobile blur.
- Quiet Glass: navigation and audience reading panel; 88% fill, 6px desktop / no mobile blur or grain.
- Forms remain opaque. Their disabled development state and backend contract are unchanged.

`GlassSurface` separates surface, texture, rim and real content into the package's four local layers. Decorative layers ignore pointer events. Motion stays on outer scene wrappers; glass foreground text is never filtered. The package supplies opaque unsupported-browser, reduced-transparency, explicit solid-mode and forced-colour fallbacks. The integration additionally makes solid-mode changes immediate instead of fading the old translucent fill.

Run `npm run brand:glass`, then format the generated CSS, to reproduce the three CSS files and three exact decorative asset copies. Only CSS asset URLs are relocated. `public/brand/para/glass/provenance.json` records source paths and hashes. The source package and preview layouts are untouched.

## Composition and interaction

- A dominant warm grain field now gives the hero glass a real backdrop. The headline and actions retain a clear separate reading area.
- Assignment-to-recording transitions have a short stagger to reduce competing labels. The existing waveform-to-feedback pins, scroll traveller and belief aperture remain connected to the same story.
- The learning loop's desktop section height is shortened from 150svh to 128svh (1.28 viewport heights); mobile, short screens and reduced motion stay unpinned.
- The audience scene uses a wider shared diagram beside a stable reading panel, stacking on mobile. Tabs remain user-controlled with arrow/Home/End navigation.
- Dark-mode audience captions and attempt numbers have a continuous light material behind them; their text stays Espresso.
- Existing offscreen/hidden-tab pause, pause button, reduced motion, anchors, routes and EN/VI copy are preserved.

## Files

- `src/components/GlassSurface.tsx`: reusable layer construction.
- `src/components/SignalStory.tsx`, `SubmissionFlow.tsx`, `PerspectiveSwitcher.tsx`, `Navigation.tsx`: material integration.
- `src/app/glass/`: supplied CSS tokens, effects and fallbacks.
- `src/app/glass-refinement.css`: responsive composition and integration rules.
- `src/app/material.css`: removes superseded single-material glass rules.
- `src/app/para.css`: stylesheet ordering.
- `public/brand/para/glass/`: grain, two rising-edge SVGs and provenance.
- `scripts/sync-glass-assets.mjs`, `package.json`: repeatable resource import.
- `scripts/verify-materials.mjs`: source-byte verification, material values and accessibility fallbacks.
- `scripts/verify-story.mjs`: current screenshot/recording output directory.

## Review artifacts and limits

Validation completed:

- Production build (22 route entries), TypeScript, ESLint, Prettier and diff whitespace checks passed.
- Bilingual route/interaction suite passed at 390, 430, 768, 1024, 1440, 1920, 2560 and 3440 px, including redirects, history, menus, tabs, FAQ, form state and reduced motion.
- Material checks passed in both languages at 1440, 1024 and 390 px: exact asset bytes, computed blur, solid/reduced-transparency modes, refresh, resize, anchors and no-JavaScript content.
- Story checks passed at all three requested widths in both languages; final desktop EN and mobile VI walkthroughs were refreshed after the motion fixes. Intermediate 350 ms handoffs were visually inspected.
- Chromium small-phone (320 px), Android, landscape, tablet, short laptop, laptop, desktop and ultrawide checks passed. WebKit iPhone, landscape and MacBook checks passed.
- Light/dark automated accessibility scans reported zero violations. The final dark audience composition also passed targeted checks at all three requested widths in both languages.
- Visual review fixed 320 px aspect-ratio overflow, short-laptop decorative overflow, dark-mode captions crossing onto light artwork, and blur flattening during the recording entrance.

Current material screenshots and intermediate handoff frames: `.qa/para-glass/`.
Scene screenshots and scroll walkthroughs: `.qa/para-glass/story/`.
Broader route/device captures retain their existing script output locations.

Visual checks use browser engines and viewport/device emulation, not physical-device GPU profiling or a screen-reader certification. Review the material strength on your own display and phone. The waitlist remains a disabled preview with no saved submissions; application workflows remain clearly labelled concepts. No new translation or product capability was introduced. No backend, deployment or Git publishing action is part of this refinement.
