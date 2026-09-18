# howl0 landing page

A responsive landing page for howl0, built with Next.js App Router, TypeScript, Tailwind CSS and focused custom CSS. The approved identity assets are in `public/brand/howl0/`.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Quality checks: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:visual`, and `npm run test:a11y`. Run the visual and accessibility scripts while the server is running. The visual script checks eleven viewports from 390×844 through 3440×1440, anchors, scene order, bounding boxes, scroll phases, tabs, FAQ, waitlist, and reduced motion. Screenshots are written to ignored `.qa/revision/`.

## Scroll storytelling

The sequence is Promise → Practice Loop → Problem → Mechanics → One-Link Difference → Audiences → Belief → Participation. The hero shows a five-second CSS loop preview, using the same five stages as Section 01. It pauses when out of view or when the browser tab is hidden. The full Practice Loop draws an open SVG route and moves its link marker from scroll progress in either direction.

The page uses passive `scroll` listeners and one animation-frame update per visible scene. `src/hooks/useScrollProgress.ts` writes a CSS progress property without re-rendering React per frame; it remeasures after resize, orientation changes, font loading, and page restoration. `ScrollScene` shares this behaviour. `Reveal` gives selected short groups a one-time entrance; text stays visible afterward. The One-Link scene has explicit entrance, readable hold, transformation, and resolved phases. Audience text remains in normal flow during tab changes.

At widths above 1100px, the hero uses a bounded two-column grid and the One-Link scene pins its comparison. Between 901px and 1100px, the hero keeps a smaller two-column composition; narrower tablets stack it. The Practice Loop pins for about 330vh on desktop and 285vh on tablet, with its art and row sizes capped by viewport height. Below 761px the hero preview becomes compact, the Practice Loop becomes a shorter sequential layout, and the fragmented route stacks vertically. Text stays within the centred 1320px content area on ultrawide displays. Reduced motion shows the completed preview, a static five-stage Practice Loop, and both complete routes without parallax or pinning. The reference recording is not shipped with the site.

## Waitlist integration

`src/lib/waitlist.ts` is a development adapter. It sends and stores **no data** and reports that submissions are unavailable. Connect an approved HTTPS endpoint there, add the required privacy notice, and return only after the service confirms storage. The form then shows “You’re in the loop.” Do not put API credentials in client code.

## Before public launch

- Connect the waitlist service and confirm the required consent and privacy copy.
- Replace footer contact, privacy, terms and social placeholder text with approved destinations.
- Set `NEXT_PUBLIC_SITE_URL` to the approved production URL to enable absolute canonical and social preview image URLs.

No remote is configured in the starter repository. Deployment can use a Git provider after a remote is added, or a Next.js compatible host. For a Vercel preview, import this repository, set the root to `/`, and deploy the feature branch.
