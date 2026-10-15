# PARA implementation handoff

Implemented locally in the existing Next.js application on `feat/reposition-progress-visibility`. No commit, push, deployment, route rename or backend connection was made.

## Sources and decisions applied

- The refined logo package takes precedence over the music pack's older wordmark exports. The four SVGs in `public/brand/para/logo/` match their supplied refined originals byte for byte. Navigation uses Raspberry; the footer uses Cocoa; device dark mode uses White. Geometry, viewports and proportions are unchanged. The rejected guitar-body logo and compact P proposal are not used.
- The music resource pack supplies the licensed Cormorant Garamond and Be Vietnam Pro WOFF2 files, Warm Signal tokens, original music/UI icons, conceptual learning illustrations, progress graphics and reference layouts. Font licences accompany the production files.
- Active styles are `src/app/para.css` and `src/app/para-tokens.css`. Earlier styles and howl0 assets remain in the repository but are not imported by the PARA layouts.
- The original product dictionaries remain the factual copy source, with visible brand names updated to PARA. Existing Vietnamese headlines, teacher/student/parent meanings, People biographies, development qualifications and FAQ answers are retained. The additional name explanation, workflow descriptions and conceptual captions in `src/lib/para.ts` come from the supplied pack.
- The homepage keeps progress, the five-step loop, three perspectives, the feedback belief and the waitlist in that order. The simple submission-link sequence remains visible in the hero and workflow page. No PARA submission domain is invented.
- Playback is user-started, finishes after one cycle, pauses on document hiding and cleans up on navigation. Reduced motion uses manual state changes. Reading content and illustrations are visible without JavaScript; the audience page provides additional no-JavaScript perspective copy.
- Device dark mode continues to work. Transparent line art sits on Paper panels; exact White logos are used on Cocoa surfaces. Raspberry remains the primary action colour.

## Preserved route contract

English `/` and Vietnamese `/vi`, with equivalent `product`, `how-it-works`, `why-howl0`, `for-you`, `people` and `faq` subpages. The `why-howl0` slug is intentionally retained. Existing educator and legacy redirects remain.

The shared welcome page, validated `choose-language/[locale]` handler, `next` destinations and existing `howl0-language-choice` cookie remain. Language switching now also retains the homepage waitlist fragment. Both locale layouts continue to supply their correct document language and metadata.

## Files changed or added

Presentation and shared layouts:

- `src/app/para.css` (new)
- `src/app/para-tokens.css` (new)
- `src/app/(en)/layout.tsx`
- `src/app/vi/layout.tsx`
- `src/app/(welcome)/layout.tsx`
- `src/app/(welcome)/welcome/page.tsx`
- `src/lib/i18n.ts`
- `src/lib/metadata.ts`
- `src/lib/viewport.ts`
- `src/lib/para.ts` (new)

Components:

- `src/components/BrandHead.tsx` (new)
- `src/components/BrandLogo.tsx`
- `src/components/HomeIntro.tsx` (new)
- `src/components/ParaFigure.tsx` (new)
- `src/components/ParaIcon.tsx` (new)
- `src/components/Navigation.tsx`
- `src/components/SiteFooter.tsx`
- `src/components/PageCta.tsx`
- `src/components/AudienceTabs.tsx`
- `src/components/BeliefMoment.tsx`
- `src/components/PerspectiveSwitcher.tsx`
- `src/components/PracticeLoop.tsx`
- `src/components/SubmissionFlow.tsx`
- `src/components/WaitlistForm.tsx`
- `src/components/WaitlistSection.tsx`
- `src/components/pages/HomePage.tsx`
- `src/components/pages/ProductPage.tsx`
- `src/components/pages/HowItWorksPage.tsx`
- `src/components/pages/WhyHowl0Page.tsx`
- `src/components/pages/ForYouPage.tsx`

Checks, documentation and source exclusions:

- `scripts/verify.mjs`
- `scripts/verify-devices.mjs`
- `scripts/accessibility.mjs`
- `eslint.config.mjs`
- `.prettierignore`
- `README.md`
- `PARA_IMPLEMENTATION.md` (new)

Production assets: 53 supplied files under `public/brand/para/`: four refined SVG logos, six WOFF2 fonts and two licences, 27 SVG icons, seven illustration SVGs, six graphic SVGs and the supplied token stylesheet. The original `design-resources/` folders were present as untracked user resources and were not altered or staged.

## Verification completed

- Formatting and `npm run format:check`: passed.
- ESLint: passed without warnings.
- Production build: passed; all established routes are present.
- TypeScript: passed.
- `npm run test:visual`: passed across seven viewport sizes from 390×844 through 3440×1440, for all seven page pairs. Covers direct routes, redirects, language choices and cookies, Back/Forward, waitlist fragments, old-brand removal, keyboard tabs, FAQ, disabled two-field waitlist, menu focus/resize and story controls.
- `npm run test:devices`: passed with Chromium phone/Android/landscape/tablet/laptop/desktop/ultrawide profiles and WebKit iPhone portrait/landscape and MacBook profiles, including 320px minimum width. Device dark mode, live theme changes, complete logo sizing, clipping and menu scrolling/inert behaviour passed.
- `npm run test:a11y` and `COLOR_SCHEME=dark npm run test:a11y`: zero WCAG A/AA violations in both themes, desktop and mobile, including audience tabs, expanded FAQs and open navigation.
- Additional no-JavaScript audience fallback, 200% equivalent reflow, and reduced-motion manual story checks passed. Browser/device coverage is emulation.
- All main pages were rendered and visually inspected in English and Vietnamese at 1440×900 and 390×844, along with welcome, dark-mode and ultrawide samples. Screenshots are in the ignored `.qa/para/` directory. The missing Product pillar spacing found during review was corrected.
- All four refined logo copies were compared directly against the supplied originals. No old logo, rejected guitar-body logo, proposed compact icon, fake dashboard, testimonial, pricing or completed-capability claim was introduced.

## Remaining decisions and dependencies

- There is no approved compact favicon/app icon. The review-only compact P is not adopted, and the previous howl0 favicon and social image metadata are removed. A PARA favicon/social preview asset still needs approval.
- Waitlist storage is still absent. Name and email remain the only fields; submission and fields are disabled with the honest pending notice. No data is sent or saved. Endpoint/persistence, consent, unsubscribe and privacy arrangements must be completed before enabling it.
- The pack asks for native editorial review of its new Vietnamese brand explanation and conceptual captions. Existing approved Vietnamese product copy was retained.
- Submission domains, contact details and legal identity remain separate owner decisions. No replacement domain, contact address, legal page or launch date was invented.
