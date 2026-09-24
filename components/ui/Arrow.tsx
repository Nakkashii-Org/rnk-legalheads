type Direction = "north-east" | "left" | "right";

const paths: Record<Direction, string> = {
  "north-east": "M4.5 11.5 11.5 4.5M5.5 4.5h6v6",
  left: "M13 8H3M7 4 3 8l4 4",
  right: "M3 8h10M9 4l4 4-4 4",
};

/**
 * Decorative arrow drawn as SVG. Text arrows (↗) render as coloured emoji on iOS and some
 * Android fonts, so an icon keeps the same look on every device. Sized to the surrounding text.
 */
export default function Arrow({ className = "", direction = "north-east" }: { className?: string; direction?: Direction }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block h-[0.85em] w-[0.85em] shrink-0 ${className}`}
    >
      <path d={paths[direction]} />
    </svg>
  );
}
