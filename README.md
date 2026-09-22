# howl0 website

A responsive editorial website for howl0, built with Next.js App Router, TypeScript, Tailwind CSS and focused custom CSS. The approved identity assets are in `public/brand/howl0/`.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Quality checks: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:visual`, and `npm run test:a11y`. Run the visual and accessibility scripts while the server is running. Set `BASE_URL` when the server uses a different port, for example `BASE_URL=http://localhost:3001 npm run test:visual`.

## Information architecture and content

English is the default at `/`. The same page components render Vietnamese at `/vi` with equivalent `/product`, `/how-it-works`, `/why-howl0`, `/for-you` and `/faq` subpages. Approved English and Vietnamese copy lives in `src/lib/i18n.ts`, sourced from `02-howl0-website-content-en-vi.md`; page markup is shared in `src/components/pages/`.

The homepage leads with progress between lessons, then the teacher-led learning loop, three perspectives, the feedback belief and the waitlist. The one-link submission remains the easy entry point on `/how-it-works`. `/for-educators` and `/vi/for-educators` permanently redirect to their `/for-you` pages. Legacy `/about`, `/who-its-for` and `/why-howlo` also retain their English redirects.

The language switch follows the equivalent path. Navigation and footer links remain in the selected language, including the homepage waitlist anchor. Explicit URLs are never automatically redirected by a stored preference. Both root layouts set their own `<html lang>` and metadata; active navigation uses `aria-current`, and the mobile menu manages focus and Escape.

## Motion and responsive behaviour

The home hero shows a five-second CSS learning-loop preview. It plays once, then settles; the home loop sequence takes 4.8 seconds. Both pause outside the viewport or when the browser tab is hidden through `useVisibleAnimation`. The parent progress update is a secondary view, outside the teacher/student loop. The full `/how-it-works` sequence draws an open SVG route and moves its task marker from scroll progress in either direction.

The page uses passive `scroll` listeners and one animation-frame update per visible scene. `src/hooks/useScrollProgress.ts` writes a CSS progress property without re-rendering React per frame; it remeasures after resize, orientation changes, font loading, and page restoration. `ScrollScene` shares this behaviour. `Reveal` gives selected groups a 420ms transform entrance while keeping headings at full opacity. Decorative layers can fade; essential text is never hidden behind a reveal or mask. The submission sequence uses transform and colour animation, and audience text remains in normal flow during tab changes.

At widths above 1100px, hero layouts use a bounded two-column grid. Tablets use the accessible menu at 900px and below; page compositions stack below that width. The full submission journey pins for about 270vh on desktop and 235vh on tablet, with its art and row sizes capped by viewport height. Below 761px it becomes a shorter sequential layout. Text stays within the centred 1320px content area on ultrawide displays. Reduced motion shows the completed preview and a static five-stage journey without parallax or pinning.

The Playwright visual suite checks all 12 paired routes at 390×844, 430×932, 768×1024, 1440×900, 1920×1080, 2560×1080 and 3440×1440. It covers direct routing, redirects, browser history, responsive overflow, mobile navigation and language switching, audience tabs, FAQ, waitlist states and reduced motion. Screenshots are written to the ignored `.qa/reposition/` directory.

## Waitlist integration

`src/lib/waitlist.ts` is a development adapter. The form has exactly name and email fields, but it sends and stores **no data** and reports that submissions are unavailable. Connect an approved HTTPS endpoint, validate and store only those two fields, provide the required privacy and consent mechanisms, and return only after the service confirms storage. Do not put API credentials in client code. Research questions are handled later by email, not on this form.

## Before public launch

- Connect the waitlist service and confirm consent, unsubscribe, retention and privacy copy for families and minors.
- Replace footer contact, privacy, terms and social placeholder text with approved destinations.
- Set `NEXT_PUBLIC_SITE_URL` to the approved production URL to enable absolute canonical and social preview image URLs.

Deployment can use the configured Git remote or any Next.js compatible host. For a Vercel preview, import this repository, set the root to `/`, and deploy the feature branch.
