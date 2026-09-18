# howl0 landing page

A responsive landing page for howl0, built with Next.js App Router, TypeScript, Tailwind CSS and focused custom CSS. The approved identity assets are in `public/brand/howl0/`.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Quality checks: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:visual`, and `npm run test:a11y`. Run the visual and accessibility scripts while the development server is running. They cover desktop, tablet, mobile, interactions, reduced motion, anchors, Vietnamese font loading and WCAG automated checks.

## Scroll storytelling

The page uses native `scroll` events with passive listeners and one animation-frame update per visible scene. `src/hooks/useScrollProgress.ts` writes a CSS progress property without re-rendering React on each frame; `ScrollScene` shares that behaviour across selected sections. The Practice Loop draws an open SVG route and moves its link marker directly from scroll progress. It holds the composition for about 330vh on desktop and 285vh on tablet. On mobile the section becomes a shorter sequential layout, with stage emphasis triggered as each item enters the viewport. Reduced motion shows the complete static route and every stage without pinning or parallax. The reference recording is not shipped with the site.

## Waitlist integration

`src/lib/waitlist.ts` is a development adapter. It sends and stores **no data** and reports that submissions are unavailable. Connect an approved HTTPS endpoint there, add the required privacy notice, and return only after the service confirms storage. The form then shows “You’re in the loop.” Do not put API credentials in client code.

## Before public launch

- Connect the waitlist service and confirm the required consent and privacy copy.
- Replace footer contact, privacy, terms and social placeholder text with approved destinations.
- Set `NEXT_PUBLIC_SITE_URL` to the approved production URL to enable absolute canonical and social preview image URLs.

No remote is configured in the starter repository. Deployment can use a Git provider after a remote is added, or a Next.js compatible host. For a Vercel preview, import this repository, set the root to `/`, and deploy the feature branch.
