# PARA reading hierarchy refinement

The hero now contains the approved artwork, positioning sentence, headline, two actions and a small ambient-motion control. The instructional animation and stage navigation have been removed from it.

The learning loop has one centred, section-scoped sticky composition. Its introduction occupies the first 12% of scroll progress. The remaining progress selects Assign, Practise, Submit, Respond and Next step, using the same value for the headline, SVG traveller and visual stage. Only the current headline is rendered. The reserved heading slot accommodates both languages. Desktop section height is 260svh, mobile 230svh; short landscape screens place text beside the artwork. Reduced motion and no JavaScript use an unpinned static story with a readable description.

The belief icon keeps its original asset and geometry on a contrasting approved Ivory material. The four phrase buttons cycle in order with a 400ms emphasis transition and a separate 3000ms reading hold. Hover and keyboard focus activate a phrase and suspend the timer. A click or tap also pauses until resumed with the cycle control. Leaving the viewport or hiding the browser tab cancels the timer; resuming allows another full reading interval. Reduced motion shows every phrase without blur, scaling or cycling.

Redundant audience explanations and diagram labels have been removed. Parent copy still qualifies the authorised view as exploratory. The closing logo is the supplied clean logo with its separate decorative SVG loop removed. The disabled Name and Email preview is unchanged and saves no data.

English and Vietnamese visible copy, accessible labels and metadata have been reviewed for dash punctuation. Sentences and compounds were rewritten naturally. Technical identifiers, paths and user input are unchanged. Henry's role is displayed as “Commercial Cofounder” to follow the punctuation request.

## Changed files

- Components: `HomeIntro`, `SignalStory`, `SubmissionFlow`, `PerspectiveSwitcher`, `PerspectiveSignal`, `BeliefMoment`, new `BeliefFocus`, `WaitlistSection`.
- Styles: new `src/app/focus-refinement.css`, imported from `src/app/para.css`.
- Copy and metadata: `src/lib/i18n.ts`, `studio.ts`, `para.ts`, `metadata.ts`, welcome page metadata.
- Checks: `scripts/verify-story.mjs`, `verify-materials.mjs`, `verify.mjs`.

## Validation

- Production build, TypeScript, ESLint, formatting and diff whitespace checks passed.
- Both languages checked at 1440, 1024 and 390 px, with screenshots of all loop states, reverse scrolling, stable headline slots, belief interaction and closing layout.
- Real browser timestamps verified a 400ms transition plus a full 3s hold, all four phrases in order, hover/focus/tap activation, offscreen and hidden-tab pauses.
- Material, solid-mode, reduced-transparency, reduced-motion, no-JavaScript, refresh, resize and anchor checks passed.
- Eight route viewports from 390 to 3440 px passed, including visible-copy dash checks. Navigation, language switching, redirects, history, tabs, FAQ, form state and menu checks passed.
- Light and dark automated accessibility scans reported zero violations.
- Chromium device emulation and WebKit iPhone, landscape and MacBook checks passed. Additional loop geometry and dark screenshots checked 320px phones and 844 × 390 landscape in both engines and languages.

Screenshots and recordings are in `.qa/para-focus/`. Browser emulation does not establish physical-device GPU performance or screen-reader certification. No brand source asset, backend or integration was changed. All work remains local and uncommitted.
