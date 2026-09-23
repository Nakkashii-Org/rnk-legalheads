import Link from "next/link";

/**
 * Text rendering of the supplied wordmark: a red bar spanning "RNK", above "RNK Legalheads".
 * Replace with the firm's vector logo file once supplied (guide p.8, R02).
 */
export default function Logo() {
  return (
    <Link href="/" className="inline-flex py-2" aria-label="RNK Legalheads home">
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
