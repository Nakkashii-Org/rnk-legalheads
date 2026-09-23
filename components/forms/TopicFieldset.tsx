import { NEWSLETTER_TOPICS } from "@/lib/newsletter";

/** Labelled topic checkboxes with large click targets; never a tiny select (guide p.154). */
export default function TopicFieldset({
  selected,
  onToggle,
  error,
}: {
  selected: string[];
  onToggle: (id: string, checked: boolean) => void;
  error?: string;
}) {
  return (
    <fieldset id="topics" tabIndex={-1} aria-describedby={error ? "topics-error" : undefined}>
      <legend className="text-[14px] font-bold">Topics</legend>
      <ul className="mt-2">
        {NEWSLETTER_TOPICS.map((topic) => (
          <li key={topic.id}>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
              <input
                type="checkbox"
                name="topics"
                value={topic.id}
                checked={selected.includes(topic.id)}
                onChange={(e) => onToggle(topic.id, e.target.checked)}
                className="h-5 w-5 shrink-0 accent-charcoal"
              />
              {topic.label}
            </label>
          </li>
        ))}
      </ul>
      {error && (
        <p id="topics-error" className="mt-1.5 text-[13px] font-bold text-action">
          {error}
        </p>
      )}
    </fieldset>
  );
}
