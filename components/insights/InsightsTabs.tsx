import Link from "next/link";

const tabs = [
  { label: "All insights", href: "/insights" },
  { label: "Articles", href: "/articles" },
  { label: "Recent judgments", href: "/recent-judgments" },
  { label: "Legal updates", href: "/legal-updates" },
  { label: "Newsletters", href: "/newsletters" },
];

/** Type navigation shared by the Insights hub and each publication listing (K01). */
export default function InsightsTabs({ current }: { current: string }) {
  return (
    <nav aria-label="Publication types" className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] md:mx-0 md:px-0">
      <ul className="flex gap-7 whitespace-nowrap border-b border-line">
        {tabs.map((tab) => {
          const active = tab.href === current;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`relative inline-flex min-h-12 items-center text-[13px] font-bold ${
                  active ? "text-action after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-rnk" : "hover:text-action"
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
