# PARA editorial homepage

Local-only redesign of the English `/` homepage using `design-resources/PARA_Homepage_Resources_v01`. The homepage now opens directly in English without the former welcome/cookie gate. `/welcome`, `/vi`, Vietnamese secondary routes and all existing shared pages remain available.

The current How it works section is the finished-demo feature showcase. See [PARA_FEATURE_SHOWCASE_HANDOFF.md](PARA_FEATURE_SHOWCASE_HANDOFF.md) for reference measurements, demo mapping, crop geometry, playback and current QA commands.

## Composition and implementation

Hero refinement: a single CTA sits below left-aligned copy, paired with the approved artwork on desktop and stacked above it on tablet/phone. The hero and navigation now share the demo panels’ 1120px maximum grid. The white opening panel uses the same neutral surround, corner radii and responsive copy insets as the demos, with a compact 24px/16px gap into the first demo. Both decorative side annotations are removed. The approved artwork remains unchanged, and the header retains the story anchor.

Motion uses the existing GSAP 3.15.1 and ScrollTrigger across the homepage: header and hero entrances, word-staggered panel headings, supporting copy, panel/media scale, icon arrivals, traced signals and underlines, subtle control hover/focus, belief text, closing CTA and footer. `EditorialMotionText.tsx` keeps split heading words selectable and reusable. Essential text stays fully opaque. Timelines and event listeners revert on unmount/media changes; font loading, resizing and history restoration refresh measurements. Native scrolling remains unpinned. Reduced motion removes the choreography. The supplied demos loop while visible, with Play/Pause controls and no Replay state.

The 12:14 PM recording informs the rounded showcases and quiet belief section. The latest hero uses the demo panels’ 1120px grid and left alignment rather than the former wider centred composition. `feature-showcase.css` scopes the light neutral column of white panels: two side-by-side compositions followed by a wide demonstration. The missing `design-references/feature-showcase.mov` path and fallback geometry are documented in the feature handoff. No Apple or Woday artwork, mascot, product claim or proprietary typeface is used.

- The English homepage is light-only regardless of the device colour preference: white canvas, pale neutral showcase surround and the approved black header logo. `color-scheme: light` keeps browser controls consistent. Shared and locale routes retain their existing appearance.
- The unmodified faceted Musical Window remains the only coloured artwork. No homepage glass, film reel, animated background or page-wide texture.
- `FeatureShowcase` and `DemoVideo` replace the old `RecordingJourney` component and all its navigation, synthetic animation and obsolete spacing. The original MP4s loop while visible, pause offscreen and support manual pause/resume. Posters and captions provide the static alternative; descriptions and direct Watch links work without JavaScript.
- `EditorialHome.tsx`, `EditorialHeader.tsx`, `EditorialGsapEffects.tsx`, `FeatureShowcase.tsx`, `DemoVideo.tsx` and three scoped CSS files isolate the composition. Only the root English route chooses this header. The shared product URL remains the CTA source.
- Media aspect ratios reserve layout space before loading. The teacher timestamp and comment share the same intact crop. The approved logo geometry and gradient files are unchanged.

## Runtime assets

Eight byte-for-byte package exports in `public/brand/para/homepage/`: black/white horizontal logos, faceted/solid-black symbols, Arrow, Repeat, Upload and Comment. Three byte-for-byte approved MP4 demos and three WebP posters extracted from their final frames are in `public/brand/para/demos/`. Existing approved Plus Jakarta Sans and Be Vietnam Pro WOFF2 files are reused. No package source was edited. No reference boards, reference recordings or extra raster textures are shipped.

## Conversion

All three “Try for free” anchors use `PRODUCT_URL`: `https://paramuzic.com`, same tab. The existing constant contains no query parameters or tracking. HTTPS reaches `www.paramuzic.com`, then `/vi`, returning HTTP 200. External signup/account creation is not exercised. Existing legal/contact destinations were placeholders, so no fictional links were added.

## Preview and checks

```sh
cd /Users/henry/Desktop/Git/howl0/howl0-landing-recovered
npm run dev -- --port 3010
```

Open `http://localhost:3010/`. Run `BASE_URL=http://localhost:3010 node scripts/verify-editorial-home.mjs` with the server running. Captures are under `.qa/para-editorial/`.

The general homepage suite checks Chromium and WebKit at 320×740, 390×844, 768×1024, 1280×720, 1440×900 and 3440×1440, including shared/locale route availability. `scripts/verify-feature-showcase.mjs` adds both themes at 390×844, 1024×768, 1440×900 and 2560×1080, responsive panel geometry, static fallbacks, axe, focus and real playback of all three demos on desktop/phone in both engines. Current captures are under `.qa/feature-showcase/`. The older recording-motion and reference-home entry points now delegate to that suite.

ESLint, TypeScript and the production build cover all 22 routes. Homepage axe scans cover light/dark desktop and mobile. An earlier repository-wide scan reported a pre-existing contrast issue on inactive Vietnamese desktop belief indices (`.belief-phrase-index`), outside this homepage scope.

The older visual/portal/reel suites encode the superseded English welcome gate and pinned homepage scenes. The new targeted suite covers this design rather than preserving those obsolete assertions. Browser checks use emulation, not physical devices. The supplied faceted artwork is static; no light-pass animation was invented.

No commit, push, deployment or teacher/student app change is part of this work. GSAP is the single added dependency for the requested motion system; no canvas, WebGL, video background or smooth-scroll dependency was added.
