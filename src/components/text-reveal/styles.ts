"use client";

const STYLE_ID = "eglador-text-reveal-styles";

const STYLES = `
.egl-tr-root {
  display: inline-block;
}

.egl-tr-letter {
  display: inline-block;
  will-change: transform, opacity, filter;
}

.egl-tr-letter[data-space="true"] {
  white-space: pre;
}

/* fade */
@keyframes egl-tr-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.egl-tr-letter[data-variant="fade"] {
  opacity: 0;
  animation: egl-tr-fade var(--egl-tr-duration, 600ms) ease-out forwards;
}

/* cinematic-blur */
@keyframes egl-tr-cinematic-blur {
  0%   { opacity: 0; transform: scale(1.5); filter: blur(15px); }
  100% { opacity: 1; transform: scale(1);   filter: blur(0); }
}
.egl-tr-letter[data-variant="cinematic-blur"] {
  opacity: 0;
  animation: egl-tr-cinematic-blur var(--egl-tr-duration, 1500ms)
    cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

/* decode — purely a JS-driven character swap; the CSS only handles fade-in */
@keyframes egl-tr-decode-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.egl-tr-letter[data-variant="decode"] {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  opacity: 0;
  animation: egl-tr-decode-fade 200ms ease-out forwards;
}

/* slide-up (masked) */
.egl-tr-letter[data-variant="slide-up"] {
  overflow: hidden;
  padding-bottom: 0.1em;
}
.egl-tr-letter[data-variant="slide-up"] > span {
  display: inline-block;
  transform: translateY(110%);
  animation: egl-tr-slide-up var(--egl-tr-duration, 800ms)
    cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: inherit;
}
@keyframes egl-tr-slide-up {
  to { transform: translateY(0); }
}

/* neon-flicker — opening flash sequence with currentColor glow */
@keyframes egl-tr-neon-flicker {
  0%   { opacity: 0; text-shadow: none; }
  10%  { opacity: 1; text-shadow: 0 0 10px currentColor, 0 0 20px currentColor; }
  15%  { opacity: 0; text-shadow: none; }
  25%  { opacity: 1; text-shadow: 0 0 10px currentColor, 0 0 20px currentColor; }
  30%  { opacity: 0; text-shadow: none; }
  40%  { opacity: 1; text-shadow: 0 0 10px currentColor, 0 0 20px currentColor; }
  50%  { opacity: 0.2; text-shadow: none; }
  100% { opacity: 1; text-shadow: 0 0 15px currentColor, 0 0 30px currentColor; }
}
.egl-tr-letter[data-variant="neon-flicker"] {
  opacity: 0;
  animation: egl-tr-neon-flicker var(--egl-tr-duration, 2000ms) forwards;
}

/* flip-x (3D fold) */
@keyframes egl-tr-flip-x {
  0%   { opacity: 0; transform: rotateX(-90deg) translateY(20px); }
  100% { opacity: 1; transform: rotateX(0deg)   translateY(0); }
}
.egl-tr-letter[data-variant="flip-x"] {
  opacity: 0;
  transform-style: preserve-3d;
  transform-origin: bottom center;
  animation: egl-tr-flip-x var(--egl-tr-duration, 800ms)
    cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

/* typewriter — opacity step reveal */
@keyframes egl-tr-typewriter {
  to { opacity: 1; }
}
.egl-tr-letter[data-variant="typewriter"] {
  opacity: 0;
  animation: egl-tr-typewriter 100ms steps(1, end) forwards;
}

/* elastic */
@keyframes egl-tr-elastic {
  to { opacity: 1; transform: scale(1); }
}
.egl-tr-letter[data-variant="elastic"] {
  opacity: 0;
  transform: scale(0);
  animation: egl-tr-elastic var(--egl-tr-duration, 800ms)
    cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

/* drop-bounce */
@keyframes egl-tr-drop-bounce {
  0%   { transform: translateY(-150px); opacity: 0; }
  50%  { transform: translateY(15px);   opacity: 1; }
  75%  { transform: translateY(-10px);  opacity: 1; }
  100% { transform: translateY(0);      opacity: 1; }
}
.egl-tr-letter[data-variant="drop-bounce"] {
  opacity: 0;
  animation: egl-tr-drop-bounce var(--egl-tr-duration, 800ms)
    cubic-bezier(0.28, 0.84, 0.42, 1) forwards;
}

/* wave (looping) */
@keyframes egl-tr-wave {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-25px); }
}
.egl-tr-letter[data-variant="wave"] {
  animation: egl-tr-wave var(--egl-tr-duration, 1500ms) ease-in-out infinite;
}

/* skew */
@keyframes egl-tr-skew {
  to { transform: translateX(0) skewX(0); opacity: 1; }
}
.egl-tr-letter[data-variant="skew"] {
  opacity: 0;
  transform: translateX(100px) skewX(-30deg);
  animation: egl-tr-skew var(--egl-tr-duration, 800ms)
    cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

/* spotlight — currentColor-based, works on any background */
@keyframes egl-tr-spotlight-in {
  to { opacity: 1; }
}
@keyframes egl-tr-spotlight-pulse {
  0%, 30%, 100% {
    opacity: 0.15;
    text-shadow: none;
  }
  15% {
    opacity: 1;
    text-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
  }
}
.egl-tr-letter[data-variant="spotlight"] {
  opacity: 0;
  animation: egl-tr-spotlight-in 800ms forwards,
             egl-tr-spotlight-pulse 3000ms infinite;
}

/* shatter — random scatter via CSS vars set by component */
@keyframes egl-tr-shatter {
  to { transform: translate3d(0,0,0) rotate(0deg); filter: blur(0); opacity: 1; }
}
.egl-tr-letter[data-variant="shatter"] {
  opacity: 0;
  filter: blur(5px);
  transform: translate3d(var(--egl-tr-x, 0), var(--egl-tr-y, 0), var(--egl-tr-z, 0))
             rotateZ(var(--egl-tr-r, 0));
  animation: egl-tr-shatter var(--egl-tr-duration, 1000ms)
    cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* stretch-y */
@keyframes egl-tr-stretch-y {
  to { transform: scaleY(1); opacity: 1; filter: blur(0); }
}
.egl-tr-letter[data-variant="stretch-y"] {
  opacity: 0;
  transform: scaleY(4);
  filter: blur(10px);
  transform-origin: bottom;
  animation: egl-tr-stretch-y var(--egl-tr-duration, 800ms)
    cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

/* flip-y */
@keyframes egl-tr-flip-y {
  to { transform: rotateY(0); opacity: 1; }
}
.egl-tr-letter[data-variant="flip-y"] {
  opacity: 0;
  transform: rotateY(90deg);
  transform-origin: left center;
  animation: egl-tr-flip-y var(--egl-tr-duration, 700ms)
    cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

/* color-burst — flashes amber then settles */
@keyframes egl-tr-color-burst {
  0%   { opacity: 0; transform: scale(0.8); color: inherit; text-shadow: none; }
  40%  { opacity: 1; transform: scale(1.1); color: #f59e0b; text-shadow: 0 0 20px #f59e0b; }
  100% { opacity: 1; transform: scale(1);   color: inherit; text-shadow: none; }
}
.egl-tr-letter[data-variant="color-burst"] {
  opacity: 0;
  animation: egl-tr-color-burst var(--egl-tr-duration, 1200ms) forwards;
}

/* focus-pull */
@keyframes egl-tr-focus-pull {
  to { opacity: 1; filter: blur(0); transform: scale(1); }
}
.egl-tr-letter[data-variant="focus-pull"] {
  opacity: 0;
  filter: blur(20px);
  transform: scale(2.5);
  animation: egl-tr-focus-pull var(--egl-tr-duration, 1200ms)
    cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* wind-scatter — random initial via CSS vars */
@keyframes egl-tr-wind-scatter {
  to { transform: translate(0, 0) rotate(0deg); opacity: 1; }
}
.egl-tr-letter[data-variant="wind-scatter"] {
  opacity: 0;
  transform: translate(var(--egl-tr-x, 0), var(--egl-tr-y, 0))
             rotate(var(--egl-tr-r, 0));
  animation: egl-tr-wind-scatter var(--egl-tr-duration, 1000ms)
    cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

/* liquid-fill — gradient text fill from bottom up */
.egl-tr-letter[data-variant="liquid-fill"] {
  color: transparent;
  -webkit-text-stroke: 1px currentColor;
  background-image: linear-gradient(to top, currentColor 50%, transparent 50%);
  background-size: 100% 200%;
  background-position: top left;
  background-repeat: no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  animation: egl-tr-liquid-fill var(--egl-tr-duration, 1500ms)
    cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
@keyframes egl-tr-liquid-fill {
  to { background-position: bottom left; }
}

/* cyber-glitch */
@keyframes egl-tr-cyber-glitch-in {
  to { opacity: 1; }
}
@keyframes egl-tr-cyber-glitch-shift {
  0%, 6%, 100% { transform: translate(0); text-shadow: none; }
  2% { transform: translate(-3px, 1px); text-shadow: 2px 0 #ff003c, -2px 0 #00f0ff; }
  4% { transform: translate(2px, -1px); text-shadow: -2px 0 #ff003c, 2px 0 #00f0ff; }
}
.egl-tr-letter[data-variant="cyber-glitch"] {
  opacity: 0;
  animation: egl-tr-cyber-glitch-in 500ms forwards,
             egl-tr-cyber-glitch-shift 2000ms infinite 500ms;
}

/* long-shadow */
@keyframes egl-tr-long-shadow-in {
  to { opacity: 1; transform: translateY(0); }
}
@keyframes egl-tr-long-shadow-pan {
  0%   { text-shadow: 15px 15px 0 rgba(0,0,0,0.06), 30px 30px 0 rgba(0,0,0,0.03); }
  100% { text-shadow: -15px 15px 0 rgba(0,0,0,0.06), -30px 30px 0 rgba(0,0,0,0.03); }
}
.egl-tr-letter[data-variant="long-shadow"] {
  opacity: 0;
  transform: translateY(10px);
  animation: egl-tr-long-shadow-in 1000ms forwards,
             egl-tr-long-shadow-pan 4000ms infinite alternate ease-in-out;
}

/* sonar-pulse */
@keyframes egl-tr-sonar-pulse-in {
  to { opacity: 1; }
}
@keyframes egl-tr-sonar-pulse {
  0%   { text-shadow: 0 0 0 currentColor; }
  100% { text-shadow: 0 0 30px transparent; }
}
.egl-tr-letter[data-variant="sonar-pulse"] {
  opacity: 0;
  animation: egl-tr-sonar-pulse-in 500ms forwards,
             egl-tr-sonar-pulse 2000ms infinite ease-out;
}

/* squash-stretch */
@keyframes egl-tr-squash-stretch {
  0%   { transform: translateY(-100px) scaleY(1.5) scaleX(0.5); opacity: 0; }
  50%  { transform: translateY(0)      scaleY(0.5) scaleX(1.5); opacity: 1; }
  75%  { transform: translateY(0)      scaleY(1.2) scaleX(0.8); opacity: 1; }
  100% { transform: translateY(0)      scaleY(1)   scaleX(1);   opacity: 1; }
}
.egl-tr-letter[data-variant="squash-stretch"] {
  opacity: 0;
  transform-origin: bottom;
  animation: egl-tr-squash-stretch var(--egl-tr-duration, 800ms) forwards;
}

/* ghost-float */
@keyframes egl-tr-ghost-appear {
  to { opacity: 0.9; filter: blur(0); }
}
@keyframes egl-tr-ghost-float {
  from { transform: translateY(5px); }
  to   { transform: translateY(-15px); }
}
.egl-tr-letter[data-variant="ghost-float"] {
  opacity: 0;
  filter: blur(10px);
  animation: egl-tr-ghost-appear 2000ms forwards,
             egl-tr-ghost-float 3000ms ease-in-out infinite alternate;
}

/* origami-unfold */
@keyframes egl-tr-origami {
  to { opacity: 1; transform: rotateX(0) rotateY(0); }
}
.egl-tr-letter[data-variant="origami-unfold"] {
  opacity: 0;
  transform-origin: top left;
  transform: rotateX(-90deg) rotateY(45deg);
  animation: egl-tr-origami var(--egl-tr-duration, 1000ms)
    cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

/* magnetic-snap — random initial via CSS vars */
@keyframes egl-tr-magnetic-snap {
  to { transform: translate(0, 0) rotate(0); opacity: 1; }
}
.egl-tr-letter[data-variant="magnetic-snap"] {
  opacity: 0;
  transform: translateY(var(--egl-tr-y, 0)) rotate(var(--egl-tr-r, 0));
  animation: egl-tr-magnetic-snap var(--egl-tr-duration, 800ms)
    cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

/* outline-trace */
@keyframes egl-tr-outline-trace {
  0%   { -webkit-text-stroke-color: transparent; color: transparent; }
  20%  { -webkit-text-stroke-color: currentColor; color: transparent; }
  70%  { -webkit-text-stroke-color: currentColor; color: transparent; }
  100% { -webkit-text-stroke-color: transparent; color: inherit; }
}
.egl-tr-letter[data-variant="outline-trace"] {
  color: transparent;
  -webkit-text-stroke: 1px transparent;
  animation: egl-tr-outline-trace var(--egl-tr-duration, 2500ms)
    cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

/* spin-3d */
@keyframes egl-tr-spin-3d {
  to { opacity: 1; transform: rotateX(0) rotateY(0) translateZ(0); }
}
.egl-tr-letter[data-variant="spin-3d"] {
  opacity: 0;
  transform: rotateX(180deg) rotateY(180deg) translateZ(200px);
  animation: egl-tr-spin-3d var(--egl-tr-duration, 1200ms)
    cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

/* pendulum */
@keyframes egl-tr-pendulum {
  0%   { opacity: 0; transform: rotateZ(60deg); }
  30%  { opacity: 1; transform: rotateZ(-40deg); }
  50%  { transform: rotateZ(20deg); }
  70%  { transform: rotateZ(-10deg); }
  90%  { transform: rotateZ(5deg); }
  100% { opacity: 1; transform: rotateZ(0); }
}
.egl-tr-letter[data-variant="pendulum"] {
  opacity: 0;
  transform-origin: top center;
  animation: egl-tr-pendulum var(--egl-tr-duration, 1500ms) ease-out forwards;
}

/* laser-snap */
@keyframes egl-tr-laser-snap {
  to { opacity: 1; transform: scaleX(1) scaleY(1); filter: blur(0); }
}
.egl-tr-letter[data-variant="laser-snap"] {
  opacity: 0;
  transform: scaleX(4) scaleY(0.1);
  filter: blur(10px);
  animation: egl-tr-laser-snap var(--egl-tr-duration, 800ms)
    cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

/* heartbeat */
@keyframes egl-tr-heartbeat-in {
  to { opacity: 1; }
}
@keyframes egl-tr-heartbeat {
  0%, 100% { transform: scale(1); color: inherit; text-shadow: none; }
  10%, 30% { transform: scale(1.2); color: #ef4444; text-shadow: 0 0 20px #ef4444; }
  20%, 40% { transform: scale(1); color: inherit; text-shadow: none; }
}
.egl-tr-letter[data-variant="heartbeat"] {
  opacity: 0;
  animation: egl-tr-heartbeat-in 500ms forwards,
             egl-tr-heartbeat 1500ms infinite 500ms;
}

/* elevator */
@keyframes egl-tr-elevator {
  to { opacity: 1; transform: translateY(0); }
}
.egl-tr-letter[data-variant="elevator"] {
  opacity: 0;
  transform: translateY(-120%);
  animation: egl-tr-elevator var(--egl-tr-duration, 700ms)
    cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* magnifier */
@keyframes egl-tr-magnifier {
  to { opacity: 1; transform: scale(1); filter: blur(0); }
}
.egl-tr-letter[data-variant="magnifier"] {
  opacity: 0;
  transform: scale(6);
  filter: blur(20px);
  animation: egl-tr-magnifier var(--egl-tr-duration, 900ms)
    cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

/* starburst — letters explode outward from center (per-letter translateX, does not touch root letter-spacing) */
@keyframes egl-tr-starburst {
  0%   { opacity: 0; transform: translateX(var(--egl-tr-burst-x, 0)); filter: blur(15px); }
  100% { opacity: 1; transform: translateX(0);                         filter: blur(0); }
}
.egl-tr-letter[data-variant="starburst"] {
  opacity: 0;
  animation: egl-tr-starburst var(--egl-tr-duration, 1200ms)
    cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* lantern-flicker — continuous golden flicker */
@keyframes egl-tr-lantern-flicker {
  0%, 10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%, 100% {
    opacity: 1;
    text-shadow: 0 0 15px #fce096;
    color: #b45309;
  }
  5%, 15%, 25%, 85% {
    opacity: 0.2;
    text-shadow: none;
    color: inherit;
  }
  35%, 65% { opacity: 0.5; }
}
.egl-tr-letter[data-variant="lantern-flicker"] {
  opacity: 0;
  animation: egl-tr-lantern-flicker 4000ms infinite alternate;
}

/* water-ripple — looping skew + translate */
@keyframes egl-tr-water-ripple-in {
  to { opacity: 1; }
}
@keyframes egl-tr-water-ripple {
  0%, 100% { transform: translateY(0)   skewX(0); }
  25%      { transform: translateY(-8px) skewX(-10deg); color: #06b6d4; text-shadow: 0 5px 15px rgba(6,182,212,0.4); }
  75%      { transform: translateY(8px)  skewX(10deg);  color: inherit; text-shadow: none; }
}
.egl-tr-letter[data-variant="water-ripple"] {
  opacity: 0;
  animation: egl-tr-water-ripple-in 500ms forwards,
             egl-tr-water-ripple 2500ms ease-in-out infinite;
}

/* Respect prefers-reduced-motion — show final state without animating. */
@media (prefers-reduced-motion: reduce) {
  .egl-tr-letter,
  .egl-tr-letter[data-variant="slide-up"] > span {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    text-shadow: none !important;
    color: inherit !important;
  }
  .egl-tr-letter[data-variant="liquid-fill"],
  .egl-tr-letter[data-variant="outline-trace"] {
    color: inherit !important;
    background: none !important;
    -webkit-text-fill-color: inherit !important;
    -webkit-text-stroke: 0 !important;
  }
}
`;

export function ensureTextRevealStyles(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = STYLES;
  document.head.appendChild(el);
}
