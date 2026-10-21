import Link from "next/link";

/** Newsletter invitation (final screens: on the homepage, before the footer). */
export default function NewsletterBand({
  heading = "Insights from RNK Legalheads.",
  text = "Choose the subjects you wish to receive by email. Unsubscribe at any time.",
}: {
  heading?: string;
  text?: string;
}) {
  return (
    <section aria-labelledby="newsletter-band-title" className="bg-warm print:hidden">
      <div className="shell py-12 md:py-16">
        <h2 id="newsletter-band-title" className="font-serif text-[26px] leading-[34px] md:text-[30px] md:leading-[38px]">
          {heading}
        </h2>
        <p className="mt-3 text-[15px] leading-[24px] text-muted">{text}</p>
        <Link href="/subscribe" className="btn btn-primary mt-6">
          Subscribe
        </Link>
      </div>
    </section>
  );
}
