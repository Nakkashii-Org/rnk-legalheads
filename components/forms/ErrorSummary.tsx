/** "There is a problem" summary: receives focus after a failed submit and links to each field. */
export default function ErrorSummary({
  errors,
  ref,
}: {
  errors: { field: string; message: string }[];
  ref?: React.Ref<HTMLDivElement>;
}) {
  if (errors.length === 0) return null;
  return (
    <div ref={ref} tabIndex={-1} role="alert" aria-labelledby="error-summary-title" className="border-2 border-action px-5 py-4 focus:outline-offset-4">
      <h2 id="error-summary-title" className="text-[16px] font-bold">
        There is a problem
      </h2>
      <ul className="mt-2 space-y-1 text-[14px]">
        {errors.map((error) => (
          <li key={error.field}>
            <a href={`#${error.field}`} className="text-action underline underline-offset-4">
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
