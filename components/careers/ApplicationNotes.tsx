import Link from "next/link";

/** Side notes shown next to every careers application form. */
export default function ApplicationNotes() {
  return (
    <aside aria-label="Before you apply" className="h-fit bg-warm px-6 py-6 text-[14px] leading-[22px] text-muted">
      <h2 className="text-[16px] font-bold text-charcoal">Before you apply</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5">
        <li>A resume is required: PDF, DOC or DOCX, up to 5 MB.</li>
        <li>Do not send identity documents, bank details or other financial information at this stage.</li>
        <li>Fields marked optional can be left blank.</li>
      </ul>
      <p className="mt-4">
        Your details and resume are used for recruitment only, as described in our{" "}
        <Link href="/privacy-policy" className="text-charcoal underline underline-offset-4 hover:text-action">
          privacy notice
        </Link>
        .
      </p>
    </aside>
  );
}
