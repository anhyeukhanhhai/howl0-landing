# PARA — finished-demo feature showcase

Local-only replacement of the English homepage’s `#how-it-works`. The hero, header, belief, closing section, footer, product destination and locale/shared pages are preserved. No commit, push or deployment.

Subsequent requested refinement: the homepage is now light-only, including under a device dark-mode preference. The showcase surround is pale neutral `#F5F5F7` with the same white panels and video framing. The hero’s decorative audio waveform/timestamp group is removed. These changes intentionally supersede the earlier dark surround and theme-adaptive hero; the demo playback behaviour is unchanged.

Latest motion refinement: videos now loop automatically while visible, with Play/Pause controls only; there is no Replay button or final-frame stop. A single visible demo remains active, and offscreen/hidden-tab pause and reduced-motion manual playback still apply. GSAP now choreographs the header, hero text/artwork/signal, panel entrances, word-staggered headings, copy, icons, media, captions, controls, belief statement, closing CTA and footer. These are short, one-time entrances and interaction effects, not continuously moving text. Essential text remains fully opaque.

Latest hero alignment refinement: the opening and header now share the demo column’s 1120px cap, white panels on the same light neutral surround, matching corner radii and copy insets. The hero uses left copy/right artwork on desktop and copy-first stacking at 1000px and below. The detached focus-marker annotation is removed, and the gap into the first demo is 24px (16px on phones). GSAP still introduces the approved artwork; no logo asset or video framing changed. Before/after and responsive captures are under `.qa/hero-refinement/`.

## Reference inspection

`design-references/feature-showcase.mov` is not present in this checkout or the supplied source-material tree. This is **not a measured match to that missing file**. The supplied fallback geometry is used: 1120px cap, 24px gaps, 28px corners, 40px copy inset, 38/62 columns, 48px headlines; mobile uses 16px gutters/gaps, 20px corners and 24px copy insets.

The existing `design-resources/Screen Recording 2026-11-18 at 12.14.34 PM.mov` (actual filename uses a narrow space before PM) does contain all three named compositions. It was decoded at its native 3430×1276 resolution. There is no player or browser frame around its webpage. The webpage is ultrawide; its centred panel column is approximately 1200px wide, not 35% of a conventional desktop viewport. Approximate observations from that available recording, relative to each panel:

| Composition               | Native panel / corner                  | Copy and title                                                   | Artwork and media                                                                              |
| ------------------------- | -------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| More than just a calendar | 1200×760px; ~60px radius (5% of width) | Left/top inset ~60px (5% width / 8% height); heading ~400px wide | Art lower left, ~60px from bottom; interface begins ~42% across / 8% down and meets right edge |
| A place for every thought | 1200×830px; ~60px radius               | Same left/top guides; two-line title ~400px wide                 | Same left-copy/right-interface orientation; interface ~42% across / 7% down; art lower left    |
| Your AI planning partner  | 1200×1025px; ~60px radius              | Upper left, ~60px inset; wider heading and description           | Artwork at upper right; broad interface below, aligned with copy’s left edge, ~5% inset        |

These are observations of the **available older recording**, not of the missing requested file. Its ~60px gaps/corners are larger than the explicit fallback values used here. No Woday artwork, mascot, feature lists or AI claims were copied. The smaller approved functional PARA icons retain their proportions rather than being enlarged to mascot size.

Native stills and labelled chronological sheets are under `.qa/feature-study/`. Key source moments are calendar 7.646s, notes 13.333s and planning 10.876s. `reference-calendar.png`, `reference-notes.png` and `reference-planning-fullest.png` are lossless crops of the centred composition for closer inspection; the original full-width frames remain alongside them.

## Demo mapping and framing

All three source files are 1440×1080, 9.5 seconds. They were mapped from their decoded contents, not directory order. First frames (~0.07s) are faded in; the representative posters instead use inspected final frames (~9.415s).

| Panel                | Source in `design-resources/DEMO VID/` | Middle / final content                                                                                                           |
| -------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Your take.           | `para-your-take-macos.mp4`             | At ~4.77s the chosen `chord-study-take-01.mp4` is ready to send. The final frame says Submitted and Sent to Jamie Lee.           |
| Your teacher’s note. | `para-your-teachers-note-macos.mp4`    | By ~4.77s, both the player and teacher comment show 0:24. The final note reads “Keep the pulse steady through the chord change.” |
| Your next try.       | `para-your-next-try-macos.mp4`         | At ~4.77s and in the final frame, the student sees the teacher’s note, three next-practice instructions and Record next take.    |

The original MP4 files are copied byte-for-byte to `public/brand/para/demos/`. Following the request to show the Mac interface, runtime framing now shows source rectangle `(100,45)`–`(1340,1035)`: the complete recorded window, including the red close, yellow minimise and green expand controls, command bar and task area. Only the outer export margin is trimmed. The selected file, submission result, both 0:24 timestamps, entire comment, practice instructions and next-take action remain visible. CSS percentages preserve the source aspect ratio. No new browser frame, interface or playback button is drawn over the recording. The video’s own UI is explicitly labelled as an example concept demo.

`scripts/para-runtime-assets.json` records SHA-256 hashes of the approved runtime files. Both browser suites use `verify-para-assets.mjs`, so a fresh Git checkout can verify asset integrity without the local-only design package or reference recordings. Update the hashes only when intentionally replacing an approved asset or regenerating its poster.

The final panel is a broad composition with top-right Repeat icon and demonstration below. It is intentionally not another side-by-side row. The supplied desktop footage cannot be reflowed into a phone interface: the complete focal region is retained, with selectable, verbatim HTML captions on stacked layouts so the important note/instruction stays readable. The third demo’s single-task view is visually less dense than the reference’s wide multi-column interface.

## Playback and accessibility

`DemoVideo.tsx` is a reusable native-video player with no new dependency. Source URLs are attached only when at least 60% of the media frame is visible; all videos use `preload="none"`. Only the posters (~100KB combined) are required initially, rather than downloading all ~4.8MB of footage on first paint.

Playback is muted, inline and looping. A shared coordinator chooses the most visible eligible demo, with manual playback taking priority; offscreen videos and hidden tabs pause. This prevents a second partially visible mobile panel from stealing playback. The Play/Pause controls sit outside the focal content, with visible focus rings and 44px minimum targets. Manual pause is respected on re-entry. A live reduced-motion preference change pauses playback; an initial reduced-motion visit shows posters and manual Play controls. JavaScript-disabled visitors retain posters, descriptions and direct Watch links.

Each video has an accessible name and a complete text description. Mobile captions reproduce actual demo text, including the teacher authorship and timestamp. The section uses native scrolling, no pinning or scroll hijacking. GSAP timelines introduce each panel and its contents, then clear transforms; media cropping is unchanged. `EditorialMotionText.tsx` provides reusable selectable word wrappers for headings. All GSAP timelines, interaction listeners and underline effects revert under reduced motion and on navigation. The previous synthetic waveform, duplicate introduction and three-step navigation remain removed.

## Preview and verification

```sh
cd /Users/henry/Desktop/Git/howl0/howl0-landing-recovered
npm run dev -- --port 3010
```

Open `http://localhost:3010/`. The existing header anchor still points to `#how-it-works`; all Try for free links still use `https://paramuzic.com` in the same tab. No tracking parameters were changed.

```sh
npm run lint
npm run typecheck
npm run build
BASE_URL=http://localhost:3010 node scripts/verify-feature-showcase.mjs
BASE_URL=http://localhost:3010 node scripts/verify-editorial-home.mjs
```

The feature suite covers Chromium and WebKit at 1440×900, 1024×768, 390×844 and 2560×1080 under both device colour preferences (the page stays light); poster/manual mode, source-byte equality, layout/overflow, icon collisions, anchor offset, keyboard focus, accessible controls and axe scans. It runs each video through a complete loop at desktop and phone sizes in both engines, captures decoded late-sequence frames, verifies meaningful source regions stay inside the crop, and checks keyboard pause/resume, exclusive playback, offscreen pause, absence of Replay controls and live reduced-motion GSAP cleanup.

Screenshots are saved to `.qa/feature-showcase/`: `{engine}-{preference}-{width}-page.png`, panel crops, playing/middle states and decoded late-sequence frames. GSAP entry/settled captures are under `.qa/para-gsap/`; desktop and mobile checks also cover focus animation, readable text, reduced-motion cleanup, overflow and history restoration. The older recording-motion/reference-home script paths delegate to the new suite. The general homepage suite checks the 320px/768px/1280px/3440px layouts and shared/Vietnamese routes. Browser checks are emulated, not physical-device tests. No external account creation is attempted.

Feature-replacement results: ESLint, TypeScript, changed-file Prettier, `git diff --check` and the 22-route production build passed. Both browser suites passed: 16 feature layout/device-preference combinations, 12 general homepage layouts and four full playback profiles (desktop/phone × Chromium/WebKit). Every demo reached its final frame in each playback profile. All tested homepage axe scans reported zero violations. The later light-only/hero-waveform refinement updates those layout assertions; `LAYOUT_ONLY=1` runs the layout, device-preference, focus and axe checks without repeating the unchanged full-playback tests. The earlier header/hero pixel baselines are intentionally superseded by that requested visual change.

Latest looping/GSAP revision: the full feature suite passes again, including all three complete video loops in all four playback profiles, no Replay controls, keyboard pause/resume and reduced-motion transform cleanup. The general homepage suite, build, lint, TypeScript and formatting pass. Additional Chromium/WebKit desktop/phone checks verify readable text throughout entries, focus effects, overflow and Back navigation; captured entry/settled frames were visually reviewed under `.qa/para-gsap/`.

## Changed files in this revision

- Added `src/components/FeatureShowcase.tsx`, `src/components/DemoVideo.tsx` and `src/app/feature-showcase.css`.
- Updated `src/components/EditorialHome.tsx`, `src/components/EditorialGsapEffects.tsx`, `src/app/editorial-home.css` and `src/app/reference-home.css` to replace the section and remove obsolete animation/styles.
- Removed `src/components/RecordingJourney.tsx`.
- Added three MP4s and three WebP posters under `public/brand/para/demos/`; copied approved `upload.svg` and `comment.svg` into `public/brand/para/homepage/`.
- Added `scripts/verify-feature-showcase.mjs`; updated `scripts/verify-editorial-home.mjs`, `scripts/verify-recording-motion.mjs` and `scripts/verify-reference-home.mjs`.
- Updated `PARA_EDITORIAL_HOMEPAGE_HANDOFF.md` and added this handoff. Source resources remain unchanged. Earlier uncommitted work is preserved.
