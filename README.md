<img src=".github/eglador-logo.svg" alt="eglador-ui-react-text-reveal" width="200" />

# eglador-ui-react-text-reveal

[![npm version](https://img.shields.io/npm/v/eglador-ui-react-text-reveal?style=flat-square&color=blue)](https://www.npmjs.com/package/eglador-ui-react-text-reveal)
[![npm downloads](https://img.shields.io/npm/dm/eglador-ui-react-text-reveal?style=flat-square&color=green)](https://www.npmjs.com/package/eglador-ui-react-text-reveal)
[![license](https://img.shields.io/npm/l/eglador-ui-react-text-reveal?style=flat-square)](https://github.com/eglador/eglador-ui-react-text-reveal/blob/main/LICENSE)
![zero runtime deps](https://img.shields.io/badge/zero%20deps-runtime-22C55E?style=flat-square)
![tailwind v4](https://img.shields.io/badge/tailwindcss-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![react 19](https://img.shields.io/badge/react-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![typescript](https://img.shields.io/badge/typescript-ready-3178C6?style=flat-square&logo=typescript&logoColor=white)

Letter-by-letter text reveal animations for React — pure CSS keyframes,
zero runtime dependencies, SSR-safe, Tailwind v4 friendly, and respects
`prefers-reduced-motion` out of the box.

## Features

- **36 built-in variants** — fade · cinematic-blur · decode · slide-up ·
  neon-flicker · flip-x · typewriter · elastic · drop-bounce · wave · skew ·
  spotlight · shatter · stretch-y · flip-y · color-burst · focus-pull ·
  wind-scatter · liquid-fill · cyber-glitch · long-shadow · sonar-pulse ·
  squash-stretch · ghost-float · origami-unfold · magnetic-snap ·
  outline-trace · spin-3d · pendulum · laser-snap · heartbeat · elevator ·
  magnifier · starburst · lantern-flicker · water-ripple
- **Pure CSS animations** — no framer-motion, no animation engine
- **Zero runtime deps** — `clsx` and `tailwind-merge` are pre-bundled
- **SSR-safe** — keyframes injected on client mount; final text renders on
  the server with `aria-label` so screen readers announce it once
- **Accessible** — `role="text"`, `aria-label`, letters are `aria-hidden`,
  `@media (prefers-reduced-motion: reduce)` disables animation
- **Color-neutral** — animations operate on opacity / transform / blur and
  inherit `color` from your styles. Works on any background
- **TypeScript-first** — typed variant union

## Installation

```bash
npm install eglador-ui-react-text-reveal
```

**Peer dependencies:** `react ^19` · `react-dom ^19` · `tailwindcss ^4`

## Quick Start

```tsx
import { TextReveal } from "eglador-ui-react-text-reveal";

export function Hero() {
  return (
    <TextReveal
      variant="cinematic-blur"
      staggerDelay={150}
      className="text-6xl font-light tracking-widest text-white"
    >
      ARVENIS
    </TextReveal>
  );
}
```

## Variants

| Variant | Description |
|---|---|
| `fade` | Baseline opacity reveal |
| `cinematic-blur` | Scale-down + blur-to-zero reveal |
| `decode` | Cycles random characters before settling on the target (JS-driven) |
| `slide-up` | Masked translate-from-below |
| `neon-flicker` | Multi-flash opening with `currentColor` glow |
| `flip-x` | 3D `rotateX` fold-up |
| `typewriter` | Step opacity reveal (for full typing/cursor behavior use `eglador-ui-react-typewriter`) |
| `elastic` | Scale-up with overshoot |
| `drop-bounce` | Fall-from-top with bounce |
| `wave` | Looping vertical wave (decorative) |
| `skew` | `skewX` + translate entry |
| `spotlight` | Soft fade with travelling light pulse |
| `shatter` | Letters assemble from random 3D positions |
| `stretch-y` | `scaleY(4)` vertical squash to natural |
| `flip-y` | 3D `rotateY` fold from the left edge |
| `color-burst` | Quick amber flash then settles back to inherited color |
| `focus-pull` | Camera-style focus pull (blur 20px → 0) |
| `wind-scatter` | Letters arrive from random 2D positions and rotations |
| `liquid-fill` | Outlined letters fill bottom-up with a gradient |
| `cyber-glitch` | Cyberpunk RGB-shift glitch loop |
| `long-shadow` | Drifting offset shadow (best on light backgrounds) |
| `sonar-pulse` | Looping concentric glow pulse |
| `squash-stretch` | Cartoon-style multi-step squash and stretch |
| `ghost-float` | Continuous gentle float with blur fade-in |
| `origami-unfold` | Paper-fold open from top-left corner |
| `magnetic-snap` | Letters snap from random offsets to position |
| `outline-trace` | Stroke traces the letter outline, fills on completion |
| `spin-3d` | `rotateX` + `rotateY` + depth reveal |
| `pendulum` | Rotational swing settling at vertical |
| `laser-snap` | Wide-thin scan line snaps to glyph |
| `heartbeat` | Looping red beat pulse |
| `elevator` | Drop-in from above with a spring overshoot |
| `magnifier` | Zoom-in from 6× with blur |
| `starburst` | Letters crunch toward the center and explode outward |
| `lantern-flicker` | Looping golden flicker (decorative, overrides color) |
| `water-ripple` | Looping skew + cyan tint wave |

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `string` | — | The text to animate (string only) |
| `variant` | `TextRevealVariant` | `"fade"` | Animation variant |
| `staggerDelay` | `number` (ms) | `80` | Delay between consecutive letters |
| `duration` | `number` (ms) | per-variant | Override animation duration |
| `startDelay` | `number` (ms) | `0` | Delay before the first letter starts |
| `splitBy` | `"letter" \| "word"` | `"letter"` | Split unit |
| `ariaLabel` | `string` | `children` | Accessible name override |
| `className` | `string` | — | Class on the wrapping `<span>` |

## Replay

Use the React `key` prop to remount and restart the animation:

```tsx
const [key, setKey] = useState(0);

<TextReveal key={key} variant="elastic">ARVENIS</TextReveal>
<button onClick={() => setKey((k) => k + 1)}>Replay</button>
```

## Development

```bash
npm install
npm run dev               # tsup watch mode
npm run build             # production build to dist/
npm run typecheck         # tsc --noEmit
npm run storybook         # Storybook dev (http://localhost:6006)
npm run build-storybook   # static Storybook export
```

## Publishing

Publishing is automated via GitHub Actions. When a GitHub Release is
created, the package is published to npm.

1. Update `version` in `package.json`
2. Commit and push
3. Create a GitHub Release with a matching tag (e.g. `v1.0.0`)

## Author

Kenan Gündoğan — [https://github.com/kenangundogan](https://github.com/kenangundogan)

Maintained under [Eglador](https://github.com/eglador)

## License

MIT
