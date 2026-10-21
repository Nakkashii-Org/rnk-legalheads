import Link from "next/link";

/**
 * The firm's logo (vector file supplied by the firm: public/rnk-legalheads-logo.svg).
 * `onDark` uses the copy with white lettering (same red bar) for the dark footer.
 */
export default function Logo({ href = "/", label = "RNK Legalheads home", onDark = false }: { href?: string; label?: string; onDark?: boolean }) {
  return (
    <Link href={href} className="inline-flex shrink-0 py-2" aria-label={label}>
      {/* eslint-disable-next-line @next/next/no-img-element -- a small vector logo needs no image optimisation */}
      <img src={onDark ? "/rnk-legalheads-logo-white.svg" : "/rnk-legalheads-logo.svg"} alt="" width={830} height={134} className="h-[26px] w-auto md:h-[30px]" />
    </Link>
  );
}

/**
 * Earlier text rendering of the wordmark: a red bar spanning "RNK", above "RNK Legalheads".
 * Kept for now, unused, as a fallback; the SVG above is the logo shown on the website.
 */
export function TextLogo({ href = "/", label = "RNK Legalheads home" }: { href?: string; label?: string }) {
  return (
    <Link href={href} className="inline-flex py-2" aria-label={label}>
      <span
        aria-hidden="true"
        className="whitespace-nowrap font-sans text-[20px] font-extrabold leading-none tracking-[-0.02em] text-charcoal min-[360px]:text-[21px] md:text-[24px]"
      >
        <span className="relative inline-block pt-[10px] md:pt-[11px]">
          <span className="absolute inset-x-0 top-0 h-[5px] bg-rnk md:h-[6px]" />
          RNK
        </span>{" "}
        Legalheads
      </span>
    </Link>
  );
}
