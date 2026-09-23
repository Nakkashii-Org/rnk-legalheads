/** Wraps matched words in <mark> using React text nodes, never raw HTML (guide p.23). */
export default function Highlight({ text, words }: { text: string; words: string[] }) {
  const terms = [...new Set(words.filter((w) => w.length > 1))];
  if (terms.length === 0) return <>{text}</>;

  const escaped = terms.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "gi"));

  return (
    <>
      {parts.map((part, i) =>
        terms.includes(part.toLowerCase()) ? (
          <mark key={i} className="bg-[#f6e3c8] text-charcoal">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}
