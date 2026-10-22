# PARA v2 website implementation

Local redesign in the existing Next.js repository. No commit, push, deployment or backend/infrastructure change was made for this revision.

## Source precedence and design

1. `design-resources/para/PARA_Refined_Logo_Package/` remains the logo authority. Existing production Raspberry, Cocoa, White and Black SVGs are unchanged copies. The rejected guitar-body treatment, text approximations and proposed compact icon are not used.
2. `design-resources/PARA_Design_Resource_Pack_v2/` supplies shared foundations, tokens, motion guidance, abstract SVGs and bilingual website direction. Its preview HTML was reviewed, not copied wholesale. Platform templates inform visual consistency only; no product workflow or backend was implemented.
3. Existing original content preserves teacher-led guidance, student practice, authorised/contextual parent understanding and the development boundary. The core belief remains “Feedback is a signal, not a verdict.” People roles and biographies are unchanged.

The website uses Cormorant Garamond and Be Vietnam Pro, Raspberry/Cocoa/Paper with restrained Apricot/Butter music accents, a 1240px reading grid, generous spacing, subtle grain and warm gradients. V2 surface, muted, border, focus, radius and duration values are mapped into the existing tokens. Device dark mode retains exact supplied White wordmarks and accessible art/text surfaces.

All active illustrations are abstract: signals, waves, rhythm, feedback markers and practice arcs. Older people/instrument illustrations remain stored but are no longer rendered. Seven v2 SVGs are copied verbatim to `public/brand/para/abstract/`. The new inline hero recomposes approved abstract geometry; it does not modify or reconstruct the logo.

## Story, behaviour and truthfulness

- Hero: the v2 headline, qualified “being built” supporting copy and a safe explanation CTA.
- The concept story shows teacher assignment → student uploading an existing audio/video recording through a link → specific teacher feedback → another practice attempt. All four labels remain visible; every illustration is labelled as conceptual and in development.
- Playback starts only on request, takes 7.2 seconds for one four-stage cycle and then stops. It pauses on artwork hover, stage-control focus and while offscreen; hiding the document or enabling reduced motion stops it. Manual stage selection/Next works independently. No autoplay audio, fake percentage, scoring or functioning upload is simulated.
- The original five-step workflow remains below the hero. Three keyboard-accessible audience perspectives, the feedback belief and development status remain in the established order. The secondary PARA acronym block was removed from the homepage to keep the product story concise; no product meaning depends on that block.
- Navigation says “Build status,” not an invitation to unavailable registration. Waitlist/FAQ wording explicitly reflects missing storage. The legacy `#waitlist` destination and two disabled Name/Email fields remain. Nothing is collected, sent or saved.
- Product/workflow introductions are qualified as intended or being designed. No AI, launch date, pricing, outcome, customer or guardian-access implementation claim was added.

## Routes and bilingual behaviour

All seven page pairs remain: `/` ↔ `/vi`, and `product`, `how-it-works`, `why-howl0`, `for-you`, `people`, `faq` under both roots. Legacy educator and other redirects remain unchanged. Welcome, the validated language-choice handler, existing preference cookie, EN/VI navigation and waitlist fragments are retained. Shared components and dictionaries prevent structural locale drift.

The v2 EN/VI hero and safe CTA are used, with development qualifications added. Additional technical/transitional labels documented for native editorial review: “Build status” / “Tiến độ phát triển”; “A learning loop, illustrated” / “Minh họa vòng học”; four concept-stage descriptions; disabled-form privacy wording and honest availability FAQ answers. Existing approved belief wording is retained in both languages.

## Files changed in this revision

- `src/app/para-tokens.css`, `src/app/para.css`: v2 foundations, signal animation, spacing, responsiveness and theme support.
- `src/components/SignalStory.tsx` (new), `HomeIntro.tsx`: abstract four-stage concept and finite animation controls.
- `src/components/ParaFigure.tsx`: typed v2 abstract asset selection and correct 640×360 proportions.
- `src/components/SubmissionFlow.tsx`, `PracticeLoop.tsx`, `BeliefMoment.tsx`: concise five-step workflow, abstract loop/feedback art.
- `src/components/PerspectiveSwitcher.tsx`, `AudienceTabs.tsx`: abstract teacher/student/parent views, preserving keyboard tabs and no-JavaScript audience fallback.
- `src/components/pages/ProductPage.tsx`, `HowItWorksPage.tsx`, `WhyHowl0Page.tsx`: v2 artwork on existing pages.
- `src/lib/i18n.ts`, `src/lib/para.ts`: bilingual story, safe CTAs, factual development/registration boundaries.
- `public/brand/para/abstract/` (seven new supplied SVGs).
- `scripts/verify.mjs`, `scripts/verify-devices.mjs`, `scripts/accessibility.mjs`: current copy/story assertions, no literal artwork, motion/CTA regressions, settled-reveal contrast scans and separate v2 screenshots.
- `README.md`, `PARA_IMPLEMENTATION.md`: current behaviour, source mapping and handoff.

Original resource folders, logo files, routing handlers, layouts, backend adapter, infrastructure, dependencies and package lock were not changed.

## Verification

- `npm run format`, `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run build`, `git diff --check`: passed. Build retains all 22 route entries, including legacy redirects.
- `npm run test:visual`: passed for seven English/Vietnamese page pairs at 390×844, 430×932, 768×1024, 1440×900, 1920×1080, 2560×1080 and 3440×1440. Covers direct routes, metadata/lang, overflow/clipping, no old brand or literal musician art, welcome/persistence, equivalent language paths and history, redirects, waitlist fragments, tabs/FAQ, two disabled fields, truthful CTAs, Play/Pause/Next, hover/focus/offscreen suspension, finite playback and reduced motion.
- `npm run test:devices`: passed in Chromium at 320px minimum, Android, phone landscape, tablet, short laptop, laptop, desktop and ultrawide; WebKit iPhone portrait/landscape and MacBook. Covers all route pairs in dark mode, live theme changes, supplied logo selection/minimum size, menu focus/reachability, inert content and no-JavaScript dark mode.
- `npm run test:a11y` and `COLOR_SCHEME=dark npm run test:a11y`: passed with zero automated WCAG A/AA violations at 1440px and 390px across 15 routes, audience tabs, expanded FAQ, open mobile navigation and reduced motion. Entrance motion is allowed to settle before contrast is measured.
- Additional checks passed: all four hero frames in both languages at desktop/mobile, no browser console errors during those interactions, no-JavaScript stage/workflow/audience content, and 200% equivalent reflow on representative routes.
- All four production logo variants and seven abstract SVG copies were compared byte-for-byte with their supplied originals: identical.
- Rendered and visually inspected all seven main page pairs at desktop/mobile, plus welcome, dark, ultrawide and individual hero-state captures. Corrected the inherited panel-radius override found during review. No further clipping or overlap was found.

Screenshots are under ignored `.qa/para-v2/`; initial comparison captures are in `.qa/para-v2-before/`. Tests were run against the production build. A first test invocation using the numeric loopback host was rerun using the application's normal `localhost` origin so language redirects and cookies share the same origin; no routing handler was changed.

## Remaining limitations and owner decisions

- Waitlist storage, email delivery, consent, unsubscribe and privacy arrangements are not implemented. Keep fields/submission disabled until connected and tested.
- Actual uploads, media processing, teacher review, notifications and guardian access remain product development—not capabilities of this marketing site. Identity verification, access controls, minors' consent and retention/deletion need decisions before platform implementation.
- Approved compact favicon/social-preview artwork and confirmed legal/contact/submission domains are still missing. No substitutes or dead legal links were introduced.
- The resource pack labels its copy as proposed; native Vietnamese editorial review and owner approval of newly adapted microcopy remain advisable. Existing licensed font files and their licence documents were retained.
- Browser/device testing is emulation, not a claim of physical-device or assistive-technology certification.
