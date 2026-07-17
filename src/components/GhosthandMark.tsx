"use client";

import { motion, useReducedMotion } from "framer-motion";

export type GhosthandMarkProps = {
  /** Adds layout or presentation classes to the responsive SVG. */
  className?: string;
  /** Disables the introductory trace animation when true. */
  reducedMotion?: boolean;
};

type TracePath = {
  d: string;
  delay: number;
  emphasis?: boolean;
};

type FieldLabel = {
  name: string;
  code: string;
  x: number;
  y: number;
  line: string;
  dot: [number, number];
  align?: "start" | "end";
};

const framePaths: TracePath[] = [
  {
    d: "M360 76 L447 99 L511 163 L534 250 L511 337 L447 401 L360 424 L273 401 L209 337 L186 250 L209 163 L273 99 Z",
    delay: 0.05,
    emphasis: true,
  },
  {
    d: "M360 143 L425 184 L400 258 L320 258 L295 184 Z",
    delay: 0.34,
    emphasis: true,
  },
  {
    d: "M360 357 L425 316 L400 242 L320 242 L295 316 Z",
    delay: 0.58,
    emphasis: true,
  },
  { d: "M360 76 L360 143", delay: 0.18 },
  { d: "M447 99 L425 184", delay: 0.27 },
  { d: "M511 163 L425 184", delay: 0.42 },
  { d: "M534 250 L400 258", delay: 0.49 },
  { d: "M511 337 L425 316", delay: 0.66 },
  { d: "M447 401 L360 357", delay: 0.75 },
  { d: "M360 424 L360 357", delay: 0.83 },
  { d: "M273 401 L295 316", delay: 0.91 },
  { d: "M209 337 L295 316", delay: 0.99 },
  { d: "M186 250 L320 242", delay: 1.07 },
  { d: "M209 163 L295 184", delay: 1.15 },
  { d: "M273 99 L295 184", delay: 1.23 },
  { d: "M360 143 L360 357", delay: 1.34 },
  { d: "M295 184 L425 316", delay: 1.43 },
  { d: "M425 184 L295 316", delay: 1.52 },
];

const labels: FieldLabel[] = [
  {
    name: "Signals",
    code: "01",
    x: 52,
    y: 136,
    line: "M154 143 H205 L229 161",
    dot: [229, 161],
  },
  {
    name: "Workflow",
    code: "02",
    x: 530,
    y: 136,
    line: "M490 143 H525 L548 161",
    dot: [490, 143],
    align: "start",
  },
  {
    name: "Agents",
    code: "03",
    x: 570,
    y: 256,
    line: "M534 250 H558",
    dot: [534, 250],
    align: "start",
  },
  {
    name: "Outcome",
    code: "05",
    x: 502,
    y: 410,
    line: "M447 401 H502",
    dot: [447, 401],
    align: "start",
  },
  {
    name: "Human control",
    code: "04",
    x: 52,
    y: 410,
    line: "M209 401 H177 L154 382",
    dot: [209, 401],
  },
];

/**
 * A self-contained, scalable technical mark for Ghosthand's operating-system
 * language. The lines resolve once on entry; `reducedMotion` makes it static.
 */
export function GhosthandMark({
  className,
  reducedMotion,
}: GhosthandMarkProps) {
  const systemReducedMotion = useReducedMotion();
  const shouldReduceMotion = reducedMotion ?? systemReducedMotion ?? false;

  return (
    <svg
      aria-labelledby="ghosthand-mark-title ghosthand-mark-description"
      className={["block h-auto w-full", className].filter(Boolean).join(" ")}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      viewBox="0 0 720 500"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="ghosthand-mark-title">Ghosthand operating field</title>
      <desc id="ghosthand-mark-description">
        A technical field diagram linking signals, workflow, agents, human
        control, and outcome.
      </desc>

      <defs>
        <linearGradient
          id="ghosthand-mark-gradient"
          x1="186"
          x2="534"
          y1="76"
          y2="424"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#79AD8E" />
          <stop offset="0.48" stopColor="#F1F2EB" />
          <stop offset="1" stopColor="#C6A66B" />
        </linearGradient>
        <radialGradient
          id="ghosthand-mark-field"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="translate(360 250) rotate(90) scale(214 184)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3F765C" stopOpacity="0.19" />
          <stop offset="0.6" stopColor="#79AD8E" stopOpacity="0.06" />
          <stop offset="1" stopColor="#79AD8E" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g aria-hidden="true">
        <path
          d="M360 36V464M110 250H610"
          opacity="0.22"
          stroke="currentColor"
          strokeDasharray="2 8"
          strokeWidth="1"
        />
        <path
          d="M336 250H384M360 226V274"
          opacity="0.42"
          stroke="currentColor"
          strokeWidth="1"
        />
        <ellipse cx="360" cy="250" fill="url(#ghosthand-mark-field)" rx="184" ry="214" />

        <motion.g
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: [0.72, 1] }}
          initial={shouldReduceMotion ? false : { opacity: 0.72 }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.08 }}
        >
          {framePaths.map(({ d, delay, emphasis }) => (
            <motion.path
              key={d}
              animate={{ opacity: 1, pathLength: 1 }}
              initial={
                shouldReduceMotion ? { opacity: 1, pathLength: 1 } : { opacity: 0, pathLength: 0 }
              }
              stroke={emphasis ? "url(#ghosthand-mark-gradient)" : "currentColor"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={emphasis ? 0.92 : 0.42}
              strokeWidth={emphasis ? 1.45 : 0.85}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { delay, duration: emphasis ? 1.55 : 1.1, ease: "easeInOut" }
              }
              d={d}
            />
          ))}
        </motion.g>

        <motion.circle
          animate={{ opacity: 1, r: 4 }}
          cx="360"
          cy="250"
          fill="#F1F2EB"
          initial={shouldReduceMotion ? { opacity: 1, r: 4 } : { opacity: 0, r: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : { delay: 1.92, duration: 0.68, ease: "easeOut" }}
        />
        <circle cx="360" cy="250" r="8" stroke="#F1F2EB" strokeOpacity="0.32" strokeWidth="1" />

        {labels.map(({ name, code, x, y, line, dot, align }) => (
          <g key={name}>
            <path d={line} opacity="0.48" stroke="currentColor" strokeWidth="1" />
            <circle cx={dot[0]} cy={dot[1]} fill="currentColor" r="2.2" />
            <text
              fill="currentColor"
              fontFamily="var(--font-geist-mono, ui-monospace, SFMono-Regular, Menlo, monospace)"
              fontSize="10"
              fontWeight="500"
              letterSpacing="0.16em"
              opacity="0.64"
              textAnchor={align === "start" ? "start" : "end"}
              x={x}
              y={y - 16}
            >
              {code}
            </text>
            <text
              fill="currentColor"
              fontFamily="var(--font-geist-sans, Inter, ui-sans-serif, system-ui, sans-serif)"
              fontSize="13"
              fontWeight="500"
              letterSpacing="0.015em"
              textAnchor={align === "start" ? "start" : "end"}
              x={x}
              y={y}
            >
              {name}
            </text>
          </g>
        ))}

        <g opacity="0.5" stroke="currentColor" strokeWidth="1">
          <path d="M93 50H131M93 50V88M627 50H589M627 50V88M93 450H131M93 450V412M627 450H589M627 450V412" />
        </g>
      </g>
    </svg>
  );
}

export default GhosthandMark;
