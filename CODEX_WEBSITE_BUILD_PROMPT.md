# Codex build brief — howl0 landing page

Act as a senior front-end engineer and creative developer. Build the howl0 landing page as a production-quality responsive website using the existing repository’s framework and conventions.

Before editing code:

1. Read this entire brief.
2. Inspect every file under `public/brand/howl0/`.
3. Identify the existing framework, scripts, components and styling approach.
4. Propose a concise implementation plan and file map.
5. Preserve unrelated existing work.

## Product truth

howl0 is under development. It helps music teachers assign practice through a simple homework link, students submit an existing audio or video recording, and teachers return organised feedback.

Do not invent dashboards, traction, testimonials, launch dates, pricing, AI accuracy, partnerships or finished product features.

## Approved brand

- Name: `howl0`
- Pronunciation: “Howl-lo”
- Belief: “Feedback is a signal, not a verdict.”
- Primary differentiator: a student can open one link, upload an existing recording and submit homework with minimal friction.
- Audiences: independent teachers, students and parents.
- Markets: Australia and Vietnam.

Use only these colours:

```css
--cocoa-ink: #2a1b22;
--raspberry-signal: #a92e5d;
--retriever-apricot: #f0a06b;
--bright-butter: #f5cf59;
--warm-paper: #fff7f2;
--white: #ffffff;
```

Use the supplied logo assets exactly. Do not redraw, retype or add effects to the logo.

The authoritative file is `public/brand/howl0/01-logo/howl0-logo-master.svg`. It is a custom-drawn five-character mark: Cocoa Ink `howl` plus a flat Raspberry `0` cut by a precise 22° return slot. Never replace it with the older multicolour/ringed-zero logo, a normal font, or a decorative approximation. Use `02-symbols/howl0-return-loop-master.svg` for the standalone symbol. The gradient is allowed on the app-icon container only; the master wordmark itself stays flat.

## Art direction

Create a sophisticated editorial website with intelligent warmth:

- Oversized, confident typography.
- One strong message per screen.
- Controlled asymmetry and generous whitespace.
- Signals, waveform paths, musical staff lines and circular practice loops.
- The homework link acts as a recurring visual thread.
- Warm, experimental and credible—not childish or corporate.
- Avoid repeated generic SaaS card grids.
- Avoid musical-note icons, cartoon instruments, fake product dashboards and excessive gradients.

## Noise system

Use the PNG files under `05-noise-overlays/` as controlled texture layers.

- Apply through pseudo-elements with `pointer-events: none`.
- Light surfaces: `opacity: .04` to `.07`, normal or multiply blend.
- Dark/gradient surfaces: `opacity: .03` to `.06`, soft-light blend.
- The editorial signal texture may appear at `opacity: .08` to `.12` in the hero or belief section.
- Never texture the logo, form controls or body-copy containers.
- Respect `prefers-reduced-motion` and do not animate grain.

## Required page structure and copy

### 1. Navigation and hero

Navigation: How it works, Why howl0, Who it’s for, Our belief, FAQ, Join the waitlist.

Status: `Currently in development · Join our early community`

Headline: `Music homework, shared and submitted in one simple link.`

Supporting copy: `howl0 is building a calmer way for teachers to assign practice, students to submit recordings, and families to stay connected to progress.`

Buttons: `Join the waitlist`, `Watch how it works`.

Create an abstract, accessible hero animation using the supplied signal, loop, link, audio, video and feedback assets. No fake software interface.

### 2. Problem

Headline: `Practice happens between lessons. Feedback often gets lost there.`

Show messages, audio files, video files, music sheets and comments moving from scattered positions into one organised howl0 signal.

### 3. How it works

Headline: `From assignment to improvement, without the app-switching.`

Stages: Share, Submit, Respond, Improve.

### 4. One-link differentiator

Headline: `Students shouldn’t need to learn a platform before they can submit their learning.`

Contrast:

- Current: Find message → locate instructions → find upload destination → send file → wait.
- howl0: Open link → upload recording → submit.

### 5. Audience perspectives

Headline: `One practice loop, understood from every side.`

- Teacher: `Keep homework and feedback connected.`
- Student: `Submit your practice without the platform headache.`
- Parent: `Support progress without managing the entire process.`

Implement as accessible tabs.

### 6. Brand belief

Primary statement: `Feedback is a signal, not a verdict.`

Show right/wrong judgement transforming into:

- What improved.
- What to listen for.
- What to practise next.
- What to try differently.

### 7. Building howl0

Headline: `We’re building howl0 with music educators and learners.`

Button: `Share your experience`.

### 8. Waitlist

Headline: `Join the next practice loop.`

Fields: email, role, instrument/teaching area, country and biggest homework/feedback difficulty.

Button: `Join the waitlist`.

Success: `You’re in the loop.`

### 9. FAQ and footer

Create accessible accordion questions covering availability, audience, homework delivery, submission formats, app download, launch and waitlist cost.

Footer belief: `Feedback is a signal, not a verdict.`

## Motion

- Sticky navigation and smooth anchor scrolling.
- Hero sequence: create → link → share → open → select → submit → respond → improve.
- 18–22 seconds, muted by default, understandable without sound.
- Provide play, pause and replay controls.
- Use 180–450 ms UI transitions with restrained ease-out curves.
- No elastic bounce or decorative parallax.
- Provide a complete static alternative under `prefers-reduced-motion: reduce`.

## Responsive requirements

Test at minimum:

- 1440 × 900 desktop.
- 1024 × 768 tablet.
- 390 × 844 mobile.

Mobile must preserve story order, CTA visibility and readable signal graphics. Do not simply shrink desktop artwork.

## Engineering and QA

- Use semantic HTML and accessible controls.
- Meet WCAG AA contrast for normal text.
- Support keyboard navigation and visible focus states.
- Optimise PNGs and use responsive image sizing.
- Avoid cumulative layout shift.
- Do not block content while decorative assets load.
- Run formatter, linter, tests and production build.
- Capture screenshots at the required desktop and mobile sizes.
- Compare screenshots against `06-reference/howl0-asset-index.png` and the supplied landing-page presentation.
- Report remaining assumptions clearly rather than inventing product behaviour.

## Definition of done

The page should feel like a distinctive music-learning platform: warm enough for students, credible to teachers and parents, and polished enough for Antler and investors. The one-link submission experience must be understood within five seconds.
