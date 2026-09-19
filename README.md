# howl0 website

A responsive editorial website for howl0, built with Next.js App Router, TypeScript, Tailwind CSS and focused custom CSS. The approved identity assets are in `public/brand/howl0/`.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Quality checks: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:visual`, and `npm run test:a11y`. Run the visual and accessibility scripts while the server is running. Set `BASE_URL` when the server uses a different port, for example `BASE_URL=http://localhost:3001 npm run test:visual`.

## Information architecture

- `/` — concise promise, animated Practice Loop preview, one-link summary and waitlist
- `/how-it-works` — the full Share → Practise → Submit → Respond → Improve sequence
- `/why-howlo` — the scattered-homework problem and brand belief
- `/who-its-for` — compact Teacher, Student and Parent perspectives
- `/about` — what howl0 is building, why, and its initial focus
- `/faq` — detailed questions in an accessible accordion

Navigation and the footer are shared across every route. Active navigation uses `aria-current`, the mobile menu manages focus and Escape, and every page has route-specific metadata.

## Motion and responsive behaviour

The home hero shows a five-second CSS Practice Loop preview. It pauses when out of view or when the browser tab is hidden. The full `/how-it-works` sequence draws an open SVG route and moves its link marker from scroll progress in either direction.

The page uses passive `scroll` listeners and one animation-frame update per visible scene. `src/hooks/useScrollProgress.ts` writes a CSS progress property without re-rendering React per frame; it remeasures after resize, orientation changes, font loading, and page restoration. `ScrollScene` shares this behaviour. `Reveal` gives selected short groups a one-time entrance; text stays visible afterward. The compact One-Link sequence uses transform and colour animation, and audience text remains in normal flow during tab changes.

At widths above 1100px, hero layouts use a bounded two-column grid. Narrower tablets stack the composition. The full Practice Loop pins for about 330vh on desktop and 285vh on tablet, with its art and row sizes capped by viewport height. Below 761px it becomes a shorter sequential layout. Text stays within the centred 1320px content area on ultrawide displays. Reduced motion shows the completed preview and a static five-stage Practice Loop without parallax or pinning.

The Playwright visual suite checks every route at 390×844, 430×932, 768×1024, 1440×900, 1920×1080, 2560×1080 and 3440×1440. It covers direct routing, browser history, responsive overflow, mobile navigation, the audience tabs, FAQ, waitlist states and reduced motion. Screenshots are written to the ignored `.qa/ia-final/` directory.

## Waitlist integration

`src/lib/waitlist.ts` is a development adapter. It sends and stores **no data** and reports that submissions are unavailable. Connect an approved HTTPS endpoint there, add the required privacy notice, and return only after the service confirms storage. The form then shows “You’re in the loop.” Do not put API credentials in client code.

## Before public launch

- Connect the waitlist service and confirm the required consent and privacy copy.
- Replace footer contact, privacy, terms and social placeholder text with approved destinations.
- Set `NEXT_PUBLIC_SITE_URL` to the approved production URL to enable absolute canonical and social preview image URLs.

Deployment can use the configured Git remote or any Next.js compatible host. For a Vercel preview, import this repository, set the root to `/`, and deploy the feature branch.
