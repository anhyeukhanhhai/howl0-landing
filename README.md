# howl0 website

A responsive editorial website for howl0, built with Next.js App Router, TypeScript, Tailwind CSS and focused custom CSS. The approved identity assets are in `public/brand/howl0/`.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Quality checks: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:visual`, and `npm run test:a11y`. Run the visual and accessibility scripts while the server is running. Set `BASE_URL` when the server uses a different port, for example `BASE_URL=http://localhost:3001 npm run test:visual`.

## Information architecture

- `/` — platform promise, submission flow, brand belief, product direction and waitlist
- `/product` — the music-specific learning-platform vision
- `/how-it-works` — teacher task, student recording, teacher response and the next attempt
- `/why-howl0` — the fragmented-between-lessons problem and brand belief
- `/for-educators` — teacher-led value, with student and parent perspectives
- `/faq` — detailed questions in an accessible accordion

Legacy `/about`, `/who-its-for` and `/why-howlo` URLs permanently redirect to the corresponding current routes.

Navigation and the footer are shared across every route. Active navigation uses `aria-current`, the mobile menu manages focus and Escape, and every page has route-specific metadata.

## Motion and responsive behaviour

The home hero shows a five-second CSS submission-flow preview. It plays once, then settles; the home submission sequence takes 4.8 seconds. Both pause outside the viewport or when the browser tab is hidden through `useVisibleAnimation`. The home flow labels each teacher-to-student and student-to-teacher handoff. The full `/how-it-works` sequence draws an open SVG route and moves its task marker from scroll progress in either direction.

The page uses passive `scroll` listeners and one animation-frame update per visible scene. `src/hooks/useScrollProgress.ts` writes a CSS progress property without re-rendering React per frame; it remeasures after resize, orientation changes, font loading, and page restoration. `ScrollScene` shares this behaviour. `Reveal` gives selected groups a 420ms transform entrance while keeping headings at full opacity. Decorative layers can fade; essential text is never hidden behind a reveal or mask. The submission sequence uses transform and colour animation, and audience text remains in normal flow during tab changes.

At widths above 1100px, hero layouts use a bounded two-column grid. Tablets use the accessible menu at 900px and below; page compositions stack below that width. The full submission journey pins for about 270vh on desktop and 235vh on tablet, with its art and row sizes capped by viewport height. Below 761px it becomes a shorter sequential layout. Text stays within the centred 1320px content area on ultrawide displays. Reduced motion shows the completed preview and a static five-stage journey without parallax or pinning.

The Playwright visual suite checks every route at 375×812, 390×844, 430×932, 768×1024, 1024×768, 1280×800, 1440×900, 1920×1080, 2560×1080 and 3440×1440. It covers direct routing, redirects, browser history, responsive overflow, mobile navigation, audience tabs, FAQ, waitlist states, reduced motion, immediate heading visibility and the finite submission animation. Screenshots are written to the ignored `.qa/ia-final/` directory.

## Waitlist integration

`src/lib/waitlist.ts` is a development adapter. It sends and stores **no data** and reports that submissions are unavailable. Connect an approved HTTPS endpoint there, add the required privacy notice, and return only after the service confirms storage. The form then shows “You’re in the loop.” Do not put API credentials in client code.

## Before public launch

- Connect the waitlist service and confirm the required consent and privacy copy.
- Replace footer contact, privacy, terms and social placeholder text with approved destinations.
- Set `NEXT_PUBLIC_SITE_URL` to the approved production URL to enable absolute canonical and social preview image URLs.

Deployment can use the configured Git remote or any Next.js compatible host. For a Vercel preview, import this repository, set the root to `/`, and deploy the feature branch.
