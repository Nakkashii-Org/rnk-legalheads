import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** 404 (final screens): say what happened and offer Services and Home. */
export default function NotFound() {
  return (
    <section className="shell py-16 md:py-24">
      <div className="max-w-[720px]">
        <span aria-hidden="true" className="block h-[2px] w-8 bg-rnk" />
        <p className="eyebrow mt-6">RNK Legalheads LLP</p>
        <h1 className="mt-5 font-serif text-[40px] leading-[44px] tracking-[-0.02em] md:text-[54px] md:leading-[59px]">
          We could not find this page.
        </h1>
        <p className="mt-5 max-w-[560px] text-muted">The address may have changed or the page may no longer be available.</p>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link href="/services" className="btn btn-primary">
            Explore services
          </Link>
          <Link href="/" className="btn btn-secondary">
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}
