import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  TextReveal,
  TEXT_REVEAL_VARIANTS,
  type TextRevealVariant,
} from "../components/text-reveal";

type StoryArgs = {
  children: string;
  variant: TextRevealVariant;
  staggerDelay: number;
  duration: number;
  startDelay: number;
  splitBy: "letter" | "word";
};

const meta: Meta<StoryArgs> = {
  title: "TextReveal",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Letter-by-letter text reveal animations. 36 built-in variants — pure CSS keyframes injected on mount, SSR-safe, color-agnostic, and `prefers-reduced-motion` aware. Wraps the output in `role=\"text\"` with `aria-label` so screen readers announce the whole string instead of each letter.",
      },
    },
  },
  args: {
    children: "ARVENIS",
    variant: "cinematic-blur",
    staggerDelay: 150,
    duration: 1500,
    startDelay: 0,
    splitBy: "letter",
  },
  argTypes: {
    children: { control: "text" },
    variant: {
      control: "select",
      options: [...TEXT_REVEAL_VARIANTS],
    },
    staggerDelay: { control: { type: "number", min: 0, max: 500, step: 10 } },
    duration: { control: { type: "number", min: 100, max: 5000, step: 100 } },
    startDelay: { control: { type: "number", min: 0, max: 3000, step: 50 } },
    splitBy: { control: "select", options: ["letter", "word"] },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  render: function DefaultStory(args) {
    const [key, setKey] = React.useState(0);
    return (
      <div className="flex flex-col items-start gap-4 rounded-sm border border-zinc-200 bg-white p-10">
        <div className="flex w-full items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
            variant: {args.variant}
          </span>
          <button
            type="button"
            onClick={() => setKey((k) => k + 1)}
            className="rounded-sm border border-zinc-200 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-zinc-700 transition hover:bg-zinc-50"
          >
            Replay
          </button>
        </div>
        <TextReveal
          key={key}
          variant={args.variant}
          staggerDelay={args.staggerDelay}
          duration={args.duration}
          startDelay={args.startDelay}
          splitBy={args.splitBy}
          className="text-5xl font-light uppercase tracking-[0.18em] text-zinc-900"
        >
          {args.children}
        </TextReveal>
      </div>
    );
  },
};

export const AllVariants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All 36 variants in a grid. Each card uses the same string and the variant's recommended default stagger.",
      },
    },
  },
  render: function AllVariantsStory() {
    const [key, setKey] = React.useState(0);
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
            36 variants
          </span>
          <button
            type="button"
            onClick={() => setKey((k) => k + 1)}
            className="rounded-sm border border-zinc-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-zinc-700 transition hover:bg-zinc-50"
          >
            Replay all
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TEXT_REVEAL_VARIANTS.map((v) => (
            <div
              key={`${v}-${key}`}
              className="flex flex-col gap-3 rounded-sm border border-zinc-200 bg-white p-6"
            >
              <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                {v}
              </span>
              <TextReveal
                variant={v}
                className="text-2xl font-light uppercase tracking-[0.16em] text-zinc-900"
              >
                ARVENIS
              </TextReveal>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export const WordLevel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`splitBy=\"word\"` reveals one word at a time instead of one letter at a time. Useful for longer phrases or taglines.",
      },
    },
  },
  render: function WordLevelStory() {
    return (
      <div className="rounded-sm border border-zinc-200 bg-white p-10">
        <TextReveal
          variant="slide-up"
          splitBy="word"
          staggerDelay={140}
          className="text-3xl font-light text-zinc-900"
        >
          The quick brown fox jumps
        </TextReveal>
      </div>
    );
  },
};

export const HeadlineAndTagline: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Marketing pattern — headline + tagline. The tagline waits for the headline via `startDelay`. Use the same key on both for a synchronized replay.",
      },
    },
  },
  render: function HeadlineStory() {
    const [key, setKey] = React.useState(0);
    return (
      <div className="flex flex-col items-start gap-4 rounded-sm border border-zinc-200 bg-white p-12">
        <TextReveal
          key={`title-${key}`}
          variant="cinematic-blur"
          staggerDelay={150}
          className="text-6xl font-light uppercase tracking-[0.22em] text-zinc-900"
        >
          ARVENIS
        </TextReveal>
        <TextReveal
          key={`tag-${key}`}
          variant="fade"
          startDelay={1200}
          staggerDelay={20}
          splitBy="word"
          className="text-xs uppercase tracking-[0.4em] text-zinc-500"
        >
          A new chapter in motion
        </TextReveal>
        <button
          type="button"
          onClick={() => setKey((k) => k + 1)}
          className="mt-2 rounded-sm border border-zinc-200 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-zinc-700 transition hover:bg-zinc-50"
        >
          Replay
        </button>
      </div>
    );
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "TextReveal inherits font-size, font-weight, and color from its parent. The same variant scales to any typographic context.",
      },
    },
  },
  render: function SizesStory() {
    return (
      <div className="flex flex-col gap-6 rounded-sm border border-zinc-200 bg-white p-10">
        {[
          { size: "text-sm", label: "sm" },
          { size: "text-xl", label: "xl" },
          { size: "text-3xl", label: "3xl" },
          { size: "text-5xl", label: "5xl" },
          { size: "text-7xl", label: "7xl" },
        ].map(({ size, label }) => (
          <div key={label} className="flex items-baseline gap-6">
            <span className="w-12 text-[10px] font-medium uppercase tracking-widest text-zinc-400">
              {label}
            </span>
            <TextReveal
              variant="elastic"
              className={`${size} font-light text-zinc-900`}
            >
              ARVENIS
            </TextReveal>
          </div>
        ))}
      </div>
    );
  },
};

export const ColorInheritance: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Glow / shadow effects use `currentColor`, so they take on whatever `color` you set on the parent. Variants like `color-burst`, `lantern-flicker`, `water-ripple`, and `heartbeat` use specific accent colors as part of their identity and are unaffected.",
      },
    },
  },
  render: function ColorInheritanceStory() {
    return (
      <div className="flex flex-col gap-3">
        {[
          { color: "text-zinc-900", bg: "bg-white", label: "zinc-900 on white" },
          { color: "text-blue-700", bg: "bg-white", label: "blue-700 on white" },
          { color: "text-emerald-700", bg: "bg-white", label: "emerald-700 on white" },
          { color: "text-zinc-900", bg: "bg-zinc-100", label: "zinc-900 on zinc-100" },
        ].map(({ color, bg, label }) => (
          <div
            key={label}
            className={`flex items-center justify-between gap-6 rounded-sm border border-zinc-200 ${bg} p-8`}
          >
            <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              {label}
            </span>
            <TextReveal
              variant="spotlight"
              className={`${color} text-3xl font-light uppercase tracking-[0.18em]`}
            >
              ARVENIS
            </TextReveal>
          </div>
        ))}
      </div>
    );
  },
};
