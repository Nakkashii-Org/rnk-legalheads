import { statusLabel, type WorkflowStatus } from "@/lib/admin/config";

const tone: Record<WorkflowStatus, string> = {
  draft: "border-line bg-warm text-charcoal",
  in_review: "border-charcoal bg-canvas text-charcoal",
  changes_requested: "border-action bg-canvas text-action",
  approved: "border-charcoal bg-charcoal text-canvas",
  published: "border-[#2f6b3a] bg-[#eef5ef] text-[#2f6b3a]",
  unpublished: "border-line bg-canvas text-muted",
  archived: "border-line bg-canvas text-muted",
};

export default function StatusBadge({ status }: { status: WorkflowStatus }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap border px-2 py-0.5 text-[11px] font-bold uppercase leading-4 tracking-[0.08em] ${tone[status]}`}>
      {statusLabel(status)}
    </span>
  );
}
