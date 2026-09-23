import Image from "next/image";
import type { Person } from "@/lib/content/people";

/** Approved portrait, or a neutral block labelled as a requirement (draft previews only). */
export default function Portrait({ person, sizes }: { person: Person; sizes: string }) {
  if (person.portrait) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden bg-warm">
        <Image src={person.portrait.src} alt={person.portrait.alt} fill sizes={sizes} className="object-cover grayscale-[15%]" />
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-[#e7e5df]">
      <svg viewBox="0 0 400 300" aria-hidden="true" className="h-full w-full">
        <circle cx="200" cy="120" r="48" fill="#c4c1ba" />
        <ellipse cx="200" cy="300" rx="110" ry="95" fill="#c4c1ba" />
      </svg>
      <span className="absolute bottom-3 left-3 bg-canvas px-2 py-1 text-[10px] uppercase leading-4 tracking-[0.12em] text-muted">
        Approved portrait required
      </span>
    </div>
  );
}
