# PARA website

The existing howl0 Next.js application, rebranded to PARA with the supplied Music Resource Pack and the later Refined Logo Package. Shared English/Vietnamese components and all established routes remain in place.

See [PARA_IMPLEMENTATION.md](PARA_IMPLEMENTATION.md) for the changed-file inventory, completed checks and remaining asset decisions.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. For production verification, run `npm run build` followed by `npm start`.

Checks: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run build`. With a server running, use `npm run test:visual`, `npm run test:devices`, `npm run test:a11y`, and `COLOR_SCHEME=dark npm run test:a11y`. Set `BASE_URL` to use a different port. Browser screenshots are generated under the ignored `.qa/para/` directory.

## Brand sources and assets

- `design-resources/para/PARA_Music_Resource_Pack/`: design tokens, licensed fonts, original music icons, conceptual illustrations, editorial layouts and motion guidance.
- `design-resources/para/PARA_Refined_Logo_Package/`: the controlling logo source. Production Raspberry, Cocoa and White SVGs are supplied copies, without modified paths or crops.
- `public/brand/para/`: selected production assets, WOFF2 files and font licences. The compact P/favicon proposal is not used.
- `src/app/para.css` and `para-tokens.css`: the active presentation system. Earlier styles and howl0 assets are retained as historical resources and are not imported into the PARA pages.

Headlines use Cormorant Garamond 500; body text uses Be Vietnam Pro. Paper, Cocoa and Raspberry carry the interface; Apricot and Butter remain music accents. Device dark mode uses the supplied White wordmark and Paper illustration panels. Only serif Roman and body Regular are preloaded.

## Routes and content

First-time visits to `/` open `/welcome`. Language selection uses the existing validated `/choose-language/[locale]?next=…` handler and `howl0-language-choice` cookie so returning visitors retain their choice.

The seven shared page pairs are `/` ↔ `/vi`, plus `/product`, `/how-it-works`, `/why-howl0`, `/for-you`, `/people` and `/faq` under both locale roots. Existing educator and legacy redirects remain. The old `why-howl0` URL is intentional. The waitlist anchor survives language switching.

Core copy remains in `src/lib/i18n.ts`, rebranded from the approved original content. `src/lib/para.ts` holds the resource pack's additional conceptual captions, workflow descriptions and PARA name explanation. Product capabilities remain qualified as intended or in development. Henry and Aaron's approved roles and music backgrounds remain.

The homepage retains progress → learning loop → three perspectives → feedback belief → waitlist. Its story is static until the visitor starts it; playback stops after one five-step cycle, on pause, when the tab is hidden, or when reduced motion is enabled. Next works manually. There is no audio, scoring animation or real upload simulation.

## Waitlist and remaining decisions

The name/email form is visibly disabled while its backend is pending. No data is transmitted or stored, and no success state is displayed. `src/lib/waitlist.ts` remains the development adapter for future integration.

The supplied compact favicon is still a proposal, so no replacement favicon or social image has been invented. Submission domains, contact details, legal identity and privacy wording need separate approval before being changed. No PARA submission domain has been invented. New PARA name-explanation wording in Vietnamese comes from the pack and should receive the editorial review requested by its handoff.

Set `NEXT_PUBLIC_SITE_URL` only to the agreed canonical website origin. This work does not change hosting, deploy, push or create a commit.
