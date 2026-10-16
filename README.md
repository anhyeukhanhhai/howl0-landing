# PARA website

The existing howl0 Next.js application, rebranded to PARA. The current website follows PARA Design Resource Pack v2, with the Refined Logo Package remaining the sole logo authority. Shared English/Vietnamese components and established routes remain in place.

See [PARA_STUDIO_HANDOFF.md](PARA_STUDIO_HANDOFF.md) for the current five-scene homepage, motion/reference notes, changed files and verification. [PARA_IMPLEMENTATION.md](PARA_IMPLEMENTATION.md) records the preceding v2 revision.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. For production verification, run `npm run build` followed by `npm start`.

Checks: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run build`. With a server running, use `npm run test:visual`, `npm run test:devices`, `npm run test:story`, `npm run test:a11y`, and `COLOR_SCHEME=dark npm run test:a11y`. Set `BASE_URL` to use a different port. Screenshots and two scroll walkthrough videos are generated under ignored `.qa/para-studio/`.

## Brand sources and assets

- `design-resources/PARA_Design_Resource_Pack_v2/`: controlling shared palette, typography, abstract SVGs, website copy and motion guidance. Platform examples are design references, not functioning screens or released capabilities.
- `design-resources/para/PARA_Music_Resource_Pack/`: licensed fonts and supporting UI/music icons. Its literal illustrations are no longer rendered.
- `design-resources/para/PARA_Refined_Logo_Package/`: the controlling logo source. Production Raspberry, Cocoa and White SVGs are supplied copies, without modified paths or crops.
- `public/brand/para/`: selected production assets, WOFF2 files and font licences. The compact P/favicon proposal is not used.
- `src/app/para.css` and `para-tokens.css`: the active shared presentation system; `studio.css` is scoped to the homepage. Earlier styles and howl0 assets are retained as historical resources and are not imported into the PARA pages.

Headlines use Cormorant Garamond 500; body text uses Be Vietnam Pro. Paper, Cocoa and Raspberry carry the interface; Apricot and Butter remain music accents. Device dark mode uses the supplied White wordmark and Paper illustration panels. Only serif Roman and body Regular are preloaded.

## Routes and content

First-time visits to `/` open `/welcome`. Language selection uses the existing validated `/choose-language/[locale]?next=…` handler and `howl0-language-choice` cookie so returning visitors retain their choice.

The seven shared page pairs are `/` ↔ `/vi`, plus `/product`, `/how-it-works`, `/why-howl0`, `/for-you`, `/people` and `/faq` under both locale roots. Existing educator and legacy redirects remain. The old `why-howl0` URL is intentional. The waitlist anchor survives language switching.

Core copy remains in `src/lib/i18n.ts`, adapted from the approved original content and v2 bilingual copy. `src/lib/studio.ts` holds the latest brief's concise bilingual scene copy; `src/lib/para.ts` retains supporting resource-pack captions. Product capabilities remain qualified as intended or in development. Henry and Aaron's approved roles and music backgrounds remain.

The homepage has five connected scenes: learning signal → five-stage learning loop → three perspectives → feedback belief → open-loop development status. An abstract ribbon, floating assignment capsule, recording waveform, teacher markers and next-practice path express the same journey. The primary CTA explains the product, rather than implying registration is operational. Legacy `#waitlist` anchors still work.

The hero uses an 11-second ambient sequence with explicit Pause/Resume and manual stages. It pauses over the artwork, while offscreen or when the document is hidden. Manual selection pauses playback. Reduced motion disables ambient movement and pinning, with the five stages and complete learning story visible. The desktop learning loop uses a short native-scroll sticky scene; mobile and short screens use normal flow. Audience tabs change only through user interaction and reserve their text height. There is no audio, grading, live upload or fake progress percentage.

## Waitlist and remaining decisions

The name/email form is visibly disabled while its backend is pending. No data is transmitted or stored, and no success state is displayed. `src/lib/waitlist.ts` remains the development adapter for future integration.

The supplied compact favicon is still a proposal, so no replacement favicon or social image has been invented. Submission domains, contact details, legal identity and privacy wording need separate approval before being changed. No PARA submission domain has been invented. New v2 copy and translated technical labels should receive native Vietnamese editorial review before launch.

Set `NEXT_PUBLIC_SITE_URL` only to the agreed canonical website origin. This work does not change hosting, deploy, push or create a commit.
