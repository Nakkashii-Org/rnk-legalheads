"use client";

import { useEffect, useRef } from "react";

type Command = { label: string; text: string; command: string; arg?: string };

const COMMANDS: Command[] = [
  { label: "Heading", text: "H2", command: "formatBlock", arg: "H2" },
  { label: "Subheading", text: "H3", command: "formatBlock", arg: "H3" },
  { label: "Paragraph", text: "¶", command: "formatBlock", arg: "P" },
  { label: "Bold", text: "B", command: "bold" },
  { label: "Italic", text: "I", command: "italic" },
  { label: "Bulleted list", text: "• List", command: "insertUnorderedList" },
  { label: "Numbered list", text: "1. List", command: "insertOrderedList" },
  { label: "Add link", text: "Link", command: "createLink" },
  { label: "Remove link", text: "Unlink", command: "unlink" },
];

/**
 * Minimal rich-text field: headings, paragraphs, lists, bold, italic and links. Pasted content is
 * inserted as plain text so formatting from Word or websites cannot bring in unsafe markup. The
 * backend sanitises the HTML again on save (guide p.162).
 */
export default function RichTextEditor({
  id,
  label,
  value,
  onChange,
  invalid,
  describedBy,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (html: string) => void;
  invalid?: boolean;
  describedBy?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Set the starting HTML once; afterwards the browser owns the content so the caret never jumps.
  useEffect(() => {
    if (ref.current && ref.current.innerHTML === "") ref.current.innerHTML = value || "<p><br></p>";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function run(c: Command) {
    let arg = c.arg;
    if (c.command === "createLink") {
      const url = window.prompt("Link address (must start with https://)", "https://");
      if (!url || !/^https?:\/\/\S+\.\S+/.test(url)) return;
      arg = url;
    }
    const el = ref.current;
    el?.focus();
    document.execCommand(c.command, false, arg);
    onChange(el?.innerHTML ?? "");
  }

  return (
    <div className={`mt-1.5 border bg-canvas ${invalid ? "border-action" : "border-[#8a8782]"} focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-charcoal`}>
      <div role="toolbar" aria-label={`${label} formatting`} aria-controls={id} className="flex flex-wrap gap-1 border-b border-line bg-warm p-1.5">
        {COMMANDS.map((c) => (
          <button
            key={c.label}
            type="button"
            aria-label={c.label}
            title={c.label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => run(c)}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center border border-transparent px-2 text-[13px] hover:border-line hover:bg-canvas md:min-h-8 md:min-w-8 ${
              c.text === "B" ? "font-bold" : c.text === "I" ? "font-serif italic" : ""
            }`}
          >
            {c.text}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        id={id}
        role="textbox"
        aria-multiline="true"
        aria-label={label}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onPaste={(e) => {
          e.preventDefault();
          document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
        }}
        className="min-h-[240px] px-4 py-3 text-[15px] leading-[26px] outline-none [&_a]:text-action [&_a]:underline [&_h2]:mt-4 [&_h2]:font-serif [&_h2]:text-[22px] [&_h2]:leading-[30px] [&_h3]:mt-3 [&_h3]:text-[17px] [&_h3]:font-bold [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-2 [&_ul]:list-disc [&_ul]:pl-6"
      />
    </div>
  );
}
