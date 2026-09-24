import EmptyState from "@/components/admin/EmptyState";

/**
 * Table shell for records that only the backend can supply (enquiries, applications, users,
 * audit events). Shows the columns reviewers will see and an honest empty state.
 */
export default function EmptyTable({
  caption,
  columns,
  emptyTitle,
  children,
}: {
  caption: string;
  columns: string[];
  emptyTitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-charcoal">
              {columns.map((c) => (
                <th key={c} scope="col" className="py-2 pr-4 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
      <EmptyState title={emptyTitle}>{children}</EmptyState>
    </div>
  );
}
