"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ensureTextRevealStyles } from "./styles";
import type { TextRevealVariant } from "./types";

export type TextRevealTrigger = "mount" | "viewport";

export interface TextRevealProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  children: string;
  variant?: TextRevealVariant;
  staggerDelay?: number;
  duration?: number;
  startDelay?: number;
  splitBy?: "letter" | "word";
  trigger?: TextRevealTrigger;
  viewportThreshold?: number;
  viewportRootMargin?: string;
  onComplete?: () => void;
  decodeChars?: string;
  ariaLabel?: string;
}

const RANDOM_TRANSFORM_VARIANTS = new Set<TextRevealVariant>([
  "shatter",
  "wind-scatter",
  "magnetic-snap",
]);

const DEFAULT_DECODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&<>?";

const DEFAULT_VARIANT_DURATION_MS: Partial<Record<TextRevealVariant, number>> = {
  fade: 600,
  "cinematic-blur": 1500,
  decode: 1500,
  "slide-up": 800,
  "neon-flicker": 2000,
  "flip-x": 800,
  typewriter: 100,
  elastic: 800,
  "drop-bounce": 800,
  wave: 1500,
  skew: 800,
  spotlight: 800,
  shatter: 1000,
  "stretch-y": 800,
  "flip-y": 700,
  "color-burst": 1200,
  "focus-pull": 1200,
  "wind-scatter": 1000,
  "liquid-fill": 1500,
  "cyber-glitch": 500,
  "long-shadow": 1000,
  "sonar-pulse": 500,
  "squash-stretch": 800,
  "ghost-float": 2000,
  "origami-unfold": 1000,
  "magnetic-snap": 800,
  "outline-trace": 2500,
  "spin-3d": 1200,
  pendulum: 1500,
  "laser-snap": 800,
  heartbeat: 500,
  elevator: 700,
  magnifier: 900,
  starburst: 1200,
  "lantern-flicker": 4000,
  "water-ripple": 500,
};

function randomTransform(variant: TextRevealVariant) {
  if (variant === "shatter") {
    return {
      "--egl-tr-x": `${(Math.random() - 0.5) * 400}px`,
      "--egl-tr-y": `${(Math.random() - 0.5) * 400}px`,
      "--egl-tr-z": `${(Math.random() - 0.5) * 400}px`,
      "--egl-tr-r": `${(Math.random() - 0.5) * 180}deg`,
    } as React.CSSProperties;
  }
  if (variant === "wind-scatter") {
    return {
      "--egl-tr-x": `${(Math.random() - 0.5) * 600}px`,
      "--egl-tr-y": `${(Math.random() - 0.5) * 600}px`,
      "--egl-tr-r": `${(Math.random() - 0.5) * 360}deg`,
    } as React.CSSProperties;
  }
  if (variant === "magnetic-snap") {
    return {
      "--egl-tr-y": `${(Math.random() - 0.5) * 150}px`,
      "--egl-tr-r": `${(Math.random() - 0.5) * 90}deg`,
    } as React.CSSProperties;
  }
  return undefined;
}

export const TextReveal = React.forwardRef<HTMLSpanElement, TextRevealProps>(
  function TextReveal(
    {
      children,
      variant = "fade",
      staggerDelay = 80,
      duration,
      startDelay = 0,
      splitBy = "letter",
      trigger = "mount",
      viewportThreshold = 0.1,
      viewportRootMargin = "0px",
      onComplete,
      decodeChars = DEFAULT_DECODE_CHARS,
      ariaLabel,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    React.useEffect(() => ensureTextRevealStyles(), []);

    const tokens = React.useMemo(() => {
      if (splitBy === "word") {
        const parts: string[] = [];
        const re = /(\S+|\s+)/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(children)) !== null) parts.push(m[0]);
        return parts;
      }
      return Array.from(children);
    }, [children, splitBy]);

    const rootRef = React.useRef<HTMLSpanElement>(null);
    React.useImperativeHandle(ref, () => rootRef.current as HTMLSpanElement);

    const [active, setActive] = React.useState(trigger === "mount");

    React.useEffect(() => {
      if (trigger === "mount") {
        setActive(true);
        return;
      }
      const el = rootRef.current;
      if (!el || typeof IntersectionObserver === "undefined") {
        setActive(true);
        return;
      }
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setActive(true);
            obs.disconnect();
          }
        },
        { threshold: viewportThreshold, rootMargin: viewportRootMargin },
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, [trigger, viewportThreshold, viewportRootMargin]);

    const [decoded, setDecoded] = React.useState<string[]>(() =>
      variant === "decode" ? tokens.map((t) => (/\s/.test(t) ? t : "?")) : [],
    );

    React.useEffect(() => {
      if (variant !== "decode" || !active) return;
      setDecoded(tokens.map((t) => (/\s/.test(t) ? t : "?")));
      const intervals: number[] = [];
      tokens.forEach((targetChar, idx) => {
        if (/\s/.test(targetChar)) return;
        let iterations = 0;
        const max = 8 + idx * 6;
        const id = window.setInterval(() => {
          if (iterations >= max) {
            setDecoded((prev) => {
              const next = [...prev];
              next[idx] = targetChar;
              return next;
            });
            window.clearInterval(id);
          } else {
            const rand =
              decodeChars[Math.floor(Math.random() * decodeChars.length)];
            setDecoded((prev) => {
              const next = [...prev];
              next[idx] = rand;
              return next;
            });
          }
          iterations++;
        }, 45);
        intervals.push(id);
      });
      return () => intervals.forEach((id) => window.clearInterval(id));
    }, [variant, tokens, active, decodeChars]);

    React.useEffect(() => {
      if (!active || !onComplete) return;
      const variantDuration =
        duration ?? DEFAULT_VARIANT_DURATION_MS[variant] ?? 1000;
      const lastDelay =
        startDelay + Math.max(0, tokens.length - 1) * staggerDelay;
      const total = lastDelay + variantDuration;
      const id = window.setTimeout(onComplete, total);
      return () => window.clearTimeout(id);
    }, [
      active,
      onComplete,
      duration,
      variant,
      staggerDelay,
      startDelay,
      tokens.length,
    ]);

    const rootStyle: React.CSSProperties = {
      ...style,
      ...(duration ? { ["--egl-tr-duration" as string]: `${duration}ms` } : {}),
    };

    const isRandomVariant = RANDOM_TRANSFORM_VARIANTS.has(variant);
    const middle = (tokens.length - 1) / 2;

    return (
      <span
        ref={rootRef}
        role="text"
        aria-label={ariaLabel ?? children}
        className={cn("egl-tr-root", className)}
        data-variant={variant}
        data-active={active || undefined}
        style={rootStyle}
        {...rest}
      >
        {tokens.map((token, i) => {
          const isWhitespace = /^\s+$/.test(token);
          const display =
            variant === "decode" && !isWhitespace && active
              ? decoded[i] ?? token
              : token;
          const animationDelay = `${startDelay + i * staggerDelay}ms`;
          const randomStyle =
            isRandomVariant && active ? randomTransform(variant) : undefined;
          const burstStyle =
            variant === "starburst" && active
              ? ({
                  "--egl-tr-burst-x": `${-(i - middle) * 60}px`,
                } as React.CSSProperties)
              : undefined;

          const letterStyle: React.CSSProperties = {
            ...randomStyle,
            ...burstStyle,
            animationDelay,
          };

          if (!active) {
            return (
              <span
                key={i}
                aria-hidden="true"
                className="egl-tr-letter"
                data-space={isWhitespace || undefined}
                style={{ opacity: 0 }}
              >
                {token}
              </span>
            );
          }

          if (variant === "slide-up") {
            return (
              <span
                key={i}
                aria-hidden="true"
                className="egl-tr-letter"
                data-variant={variant}
                data-space={isWhitespace || undefined}
                style={letterStyle}
              >
                <span style={{ animationDelay }}>{token}</span>
              </span>
            );
          }

          return (
            <span
              key={i}
              aria-hidden="true"
              className="egl-tr-letter"
              data-variant={variant}
              data-space={isWhitespace || undefined}
              style={letterStyle}
            >
              {display}
            </span>
          );
        })}
      </span>
    );
  },
);

TextReveal.displayName = "TextReveal";
