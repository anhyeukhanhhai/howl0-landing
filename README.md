# PARA website

The existing howl0 Next.js application, rebranded to PARA. The current website follows `design-resources/PARA_Brand_Resources`: the approved Musical Window logo, Sandalwood colours and grain material system supersede earlier packs. Shared English/Vietnamese components and established routes remain in place.

See [PARA_MATERIAL_HANDOFF.md](PARA_MATERIAL_HANDOFF.md) for the current assets, glass/motion system and verification. [PARA_STUDIO_HANDOFF.md](PARA_STUDIO_HANDOFF.md) and [PARA_IMPLEMENTATION.md](PARA_IMPLEMENTATION.md) record preceding revisions.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. For production verification, run `npm run build` followed by `npm start`.

Checks: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run build`. With a server running, use `npm run test:visual`, `npm run test:devices`, `npm run test:story`, `npm run test:materials`, `npm run test:a11y`, and `COLOR_SCHEME=dark npm run test:a11y`. Set `BASE_URL` to use a different port. Current screenshots and two scroll walkthrough videos are generated under ignored `.qa/para-material/`.

## Brand sources and assets

- `design-resources/PARA_Brand_Resources/`: controlling production logo geometry, five-colour palette, typography, icon families, EN/VI listening artwork and raster-grain materials. Explicitly marked app/favicon proposals are excluded.
- `public/brand/para/resources/`: exact production copies, local WOFF2 fonts, OFL licences and `asset-provenance.json`. `npm run brand:sync` rebuilds this explicit allowlist from the package. Source assets are not edited.
- `src/app/para.css` and `para-tokens.css`: shared presentation and semantic colour/type roles. Legacy variable names are compatibility aliases to the new palette, not old colours.
- `studio.css` retains the established five-scene choreography; `material.css` applies the new artwork, typography and selective glass. Historical assets remain on disk but are not rendered by current pages.

Headlines use Plus Jakarta Sans 600; body text uses Be Vietnam Pro 400–600. Espresso, Ivory, Sand and Saddle Brown carry the interface, with Cool Grey confined to supplied artwork. Device dark mode uses the exact Ivory logo and inverse reading colours. Only the variable heading font and body Regular are preloaded. Solid logos are used at small sizes; larger closing/footer logos use the approved grain exports. Grain stays inside artwork, not on text or controls.

## Routes and content

First-time visits to `/` open `/welcome`. Language selection uses the existing validated `/choose-language/[locale]?next=…` handler and `howl0-language-choice` cookie so returning visitors retain their choice.

The seven shared page pairs are `/` ↔ `/vi`, plus `/product`, `/how-it-works`, `/why-howl0`, `/for-you`, `/people` and `/faq` under both locale roots. Existing educator and legacy redirects remain. The old `why-howl0` URL is intentional. The waitlist anchor survives language switching.

Core copy remains in `src/lib/i18n.ts`, adapted from the approved original content and v2 bilingual copy. `src/lib/studio.ts` holds the latest brief's concise bilingual scene copy; `src/lib/para.ts` retains supporting resource-pack captions. Product capabilities remain qualified as intended or in development. Henry and Aaron's approved roles and music backgrounds remain.

The homepage has five connected scenes: learning signal → five-stage learning loop → three perspectives → feedback belief → open-loop development status. Approved listening artwork, a floating assignment capsule, recording waveform, timestamp markers and next-practice path express the same journey. Glass is selective, uses opaque fallbacks and honours reduced transparency. Mobile drops artwork backdrop blur and uses expressive symbols rather than miniature text inside detailed illustrations. The primary CTA explains the product, rather than implying registration is operational. Legacy `#waitlist` anchors still work.

The hero uses an 11-second ambient sequence with explicit Pause/Resume and manual stages. It pauses over the artwork, while offscreen or when the document is hidden. Manual selection pauses playback. Reduced motion disables ambient movement and pinning, with the five stages and complete learning story visible. The desktop learning loop uses a short native-scroll sticky scene; mobile and short screens use normal flow. Audience tabs change only through user interaction and reserve their text height. There is no audio, grading, live upload or fake progress percentage.

## Waitlist and remaining decisions

The name/email form is visibly disabled while its backend is pending. No data is transmitted or stored, and no success state is displayed. `src/lib/waitlist.ts` remains the development adapter for future integration.

The supplied compact favicon is still a proposal, so no replacement favicon or social image has been invented. Submission domains, contact details, legal identity and privacy wording need separate approval before being changed. No PARA submission domain has been invented. New v2 copy and translated technical labels should receive native Vietnamese editorial review before launch.

Set `NEXT_PUBLIC_SITE_URL` only to the agreed canonical website origin. This work does not change hosting, deploy, push or create a commit.
