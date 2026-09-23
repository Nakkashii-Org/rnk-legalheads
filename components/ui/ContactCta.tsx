import Link from "next/link";
import Arrow from "@/components/ui/Arrow";

type ContactCtaProps = {
  href?: string;
  heading?: string;
  text?: string;
  label?: string;
};

/** One restrained contact action: no booking, response-time or representation promise (guide p.30). */
export default function ContactCta({
  href = "/contact",
  heading = "Contact the team",
  text = "Share your contact details and a brief, non-confidential description of the subject. Sending an enquiry does not create a lawyer-client relationship.",
  label = "Contact the team",
}: ContactCtaProps) {
  return (
    <section aria-labelledby="contact-cta-title" className="border-t border-line">
      <div className="shell flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center md:py-16">
        <div className="max-w-[620px]">
          <h2 id="contact-cta-title" className="font-serif text-[26px] leading-[34px] md:text-[30px] md:leading-[38px]">
            {heading}
          </h2>
          <p className="mt-2 text-[15px] leading-[24px] text-muted">{text}</p>
        </div>
        <Link href={href} className="btn btn-primary shrink-0">
          {label} <Arrow />
        </Link>
      </div>
    </section>
  );
}
