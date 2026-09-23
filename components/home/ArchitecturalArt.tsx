/**
 * Original architectural illustration for the hero (guide p.3: illustrative, not an RNK office).
 * The three slides share the drawing but change tone and crop, as the guide asks (p.21):
 * 01 natural, 02 monochrome, 03 warm and closer.
 */
const variants = [
  { filter: "none", transform: "" },
  { filter: "grayscale(1) contrast(1.04)", transform: "translate(-30 -10) scale(1.04)" },
  { filter: "sepia(0.18) saturate(0.95)", transform: "translate(-90 -60) scale(1.12)" },
];

export default function ArchitecturalArt({ variant }: { variant: number }) {
  const v = variants[variant % variants.length];
  const id = (name: string) => `arch-${variant}-${name}`;
  const gridX = [100, 187, 272, 358];
  const gridY = [253, 325, 398, 470, 543, 615, 688, 760, 832];

  return (
    <svg
      viewBox="0 0 980 840"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      style={{ filter: v.filter }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efeeea" />
          <stop offset="1" stopColor="#e6e5e0" />
        </linearGradient>
        <linearGradient id={id("wedge")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#323939" />
          <stop offset="1" stopColor="#5c615f" />
        </linearGradient>
        <linearGradient id={id("glass")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#445656" />
          <stop offset="1" stopColor="#3a4949" />
        </linearGradient>
        <pattern id={id("fins")} x="466" y="0" width="43" height="840" patternUnits="userSpaceOnUse">
          <rect width="43" height="840" fill="#d9d8cf" />
          <rect x="0" width="9" height="840" fill="#a3aca6" />
          <rect x="9" width="3" height="840" fill="#6d7a75" />
          <rect x="34" width="9" height="840" fill="#cfcec5" />
        </pattern>
        <linearGradient id={id("drum")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.62" />
          <stop offset="0.35" stopColor="#f1f0ec" stopOpacity="0.4" />
          <stop offset="0.75" stopColor="#c9cbc6" stopOpacity="0.45" />
          <stop offset="1" stopColor="#aeb1ac" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={id("slab-shade")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f7f5ef" />
          <stop offset="1" stopColor="#e7e4db" />
        </linearGradient>
        <clipPath id={id("wedge-clip")}>
          <polygon points="0,400 433,60 433,840 0,840" />
        </clipPath>
        <clipPath id={id("panel-clip")}>
          <polygon points="85,440 378,208 378,840 85,840" />
        </clipPath>
      </defs>

      <rect width="980" height="840" fill={`url(#${id("sky")})`} />

      <g transform={v.transform}>
        {/* Dark wedge with inset glass panel */}
        <polygon points="0,400 433,60 433,840 0,840" fill={`url(#${id("wedge")})`} />
        <polygon points="85,440 378,208 378,840 85,840" fill={`url(#${id("glass")})`} />
        <g clipPath={`url(#${id("panel-clip")})`} stroke="#93a6a3" strokeOpacity="0.75" strokeWidth="1.6">
          {gridX.map((x) => (
            <line key={`x${x}`} x1={x} y1="0" x2={x} y2="840" />
          ))}
          {gridY.map((y) => (
            <line key={`y${y}`} x1="0" y1={y} x2="433" y2={y} />
          ))}
        </g>

        {/* Light beams crossing the wedge */}
        <g clipPath={`url(#${id("wedge-clip")})`} fill="#b3bbb5">
          <polygon points="0,655 433,328 433,380 0,707" />
          <polygon points="150,840 433,636 433,690 222,840" />
        </g>

        {/* Cream frame along the diagonal, and the vertical pillar */}
        <polygon points="0,352 445,10 458,10 458,48 433,62 0,402" fill="#f3f1ea" />
        <rect x="433" y="40" width="25" height="800" fill="#f8f6f0" />

        {/* Finned facade */}
        <polygon points="445,10 980,148 980,190 458,50" fill="#f1efe8" />
        <polygon points="458,50 980,190 980,840 458,840" fill={`url(#${id("fins")})`} />

        {/* Floor slabs */}
        <polygon points="465,305 980,428 980,494 465,370" fill={`url(#${id("slab-shade")})`} />
        <polygon points="465,370 980,494 980,502 465,378" fill="#b9bcb5" opacity="0.6" />
        <polygon points="458,624 980,720 980,790 458,690" fill={`url(#${id("slab-shade")})`} />
        <polygon points="458,690 980,790 980,798 458,698" fill="#b9bcb5" opacity="0.6" />

        {/* Glass drum on the right, reflecting over the facade */}
        <path d="M755 0 L980 0 L980 840 L826 840 C812 640 796 470 790 390 C782 300 760 200 755 130 Z" fill={`url(#${id("drum")})`} />
        <path d="M755 0 L755 130 C760 200 782 300 790 390 C796 470 812 640 826 840" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="2" />
      </g>
    </svg>
  );
}
