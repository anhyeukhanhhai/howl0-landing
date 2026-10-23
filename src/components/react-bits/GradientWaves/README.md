# Gradient Waves provenance

This is the actual React Bits **TypeScript + plain CSS** Gradient Waves component, integrated into PARA's learning-loop section. It is not the homepage hero's original CSS/SVG wave.

- Documentation: <https://reactbits.dev/backgrounds/gradient-waves>
- Source: <https://github.com/DavidHDev/react-bits/blob/14330e6963f6c5ddd773ee2af844d0630c22b958/src/ts-default/Backgrounds/GradientWaves/GradientWaves.tsx>
- Revision: `14330e6963f6c5ddd773ee2af844d0630c22b958`
- Original TSX SHA-256: `7c8e13a0b3e379464d6c3e54bf43e06c486d6f8beb8803ab3eae6005baa13317`
- Original licence: `LICENSE.md` from that same revision, retained here, in the source banner and at `/notices/react-bits-gradient-waves.txt`.

Copyright (c) 2026 David Haz. The source is licensed under **MIT + Commons Clause License Condition v1.0**, not unrestricted MIT alone. Retain the full notice when redistributing this implementation. The included licence permits use as part of a website/product and restricts selling or redistributing the component itself. See the complete licence for its terms.

## Local adaptations

The vertex and fragment shader strings are unchanged from the pinned upstream source. The component still uses its own native WebGL2 surface/ray marching, lighting and perspective, without Three.js, Vanta or another renderer.

- Props for frame-rate and resolution limits, readiness, failure and sustained-stall reporting.
- Low-power context preference; desktop output capped at 1100 × 700 and 30 draws per second. Mobile uses 0.65 DPR, a 720 px width ceiling and 24 draws per second. RAF checks between draws do not rerender the shader.
- Render only when at least 10% of the surface is visible, with immediate cancellation on hidden tabs. The upstream already stops scheduling when offscreen; the integration tightens cancellation and tiny-edge visibility handling.
- A paused image holds lighting/camera position and releases its render loop after settling its settings. Resuming retains wave time. Resize and props can wake a redraw.
- Context loss/error cleanup, initial failure resource release and a fallback callback if rendered-frame gaps stay above 100 ms for 2.5 seconds. This is a conservative safety mechanism, not a hardware performance guarantee.
- React settings-ref updates moved into the existing effect for current hooks lint rules. Valid six-digit hex colours do not need a canvas colour probe.
- Existing callbacks, observers, RAF, buffers, vertex array, shaders, program and context are released on unmount. The integration does not attach scroll controls or write lesson progress.

`LoopWaves.tsx` owns PARA colours, source props, lazy loading, reduced-motion/data-saving eligibility, coarse-pointer simplification and the static background. The homepage mounts one shared instance through `SharedWaveEnvironment.tsx`; `scene-atmosphere.css` owns the shared layer stack. Rendering pauses automatically when hidden or inactive. Manual motion controls were removed at the user's request. Click swells and shader grain are disabled; grain comes from the supplied cached texture.
