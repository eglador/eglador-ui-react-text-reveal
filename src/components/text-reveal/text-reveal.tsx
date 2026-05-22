"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ensureTextRevealStyles } from "./styles";
import type { TextRevealVariant } from "./types";

export interface TextRevealProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  children: string;
  variant?: TextRevealVariant;
  staggerDelay?: number;
  duration?: number;
  startDelay?: number;
  splitBy?: "letter" | "word";
  ariaLabel?: string;
}

const RANDOM_TRANSFORM_VARIANTS = new Set<TextRevealVariant>([
  "shatter",
  "wind-scatter",
  "magnetic-snap",
]);

const DECODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&<>?";

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

    const [decoded, setDecoded] = React.useState<string[]>(() =>
      variant === "decode" ? tokens.map((t) => (/\s/.test(t) ? t : "?")) : [],
    );

    React.useEffect(() => {
      if (variant !== "decode") return;
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
              DECODE_CHARS[Math.floor(Math.random() * DECODE_CHARS.length)];
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
    }, [variant, tokens]);

    const rootStyle: React.CSSProperties = {
      ...style,
      ...(duration ? { ["--egl-tr-duration" as string]: `${duration}ms` } : {}),
    };

    const isRandomVariant = RANDOM_TRANSFORM_VARIANTS.has(variant);
    const middle = (tokens.length - 1) / 2;

    return (
      <span
        ref={ref}
        role="text"
        aria-label={ariaLabel ?? children}
        className={cn("egl-tr-root", className)}
        data-variant={variant}
        style={rootStyle}
        {...rest}
      >
        {tokens.map((token, i) => {
          const isWhitespace = /^\s+$/.test(token);
          const display =
            variant === "decode" && !isWhitespace ? decoded[i] ?? token : token;
          const animationDelay = `${startDelay + i * staggerDelay}ms`;
          const randomStyle = isRandomVariant
            ? randomTransform(variant)
            : undefined;
          const burstStyle =
            variant === "starburst"
              ? ({ "--egl-tr-burst-x": `${-(i - middle) * 60}px` } as React.CSSProperties)
              : undefined;

          const letterStyle: React.CSSProperties = {
            ...randomStyle,
            ...burstStyle,
            animationDelay,
          };

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
