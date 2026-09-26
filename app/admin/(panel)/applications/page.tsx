import type { Metadata } from "next";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyTable from "@/components/admin/EmptyTable";
import { GENERAL_POSITIONS } from "@/lib/career-form";
import { getContent } from "@/lib/content/source";

export const metadata: Metadata = { title: "Job applications" };

const select = "mt-1 block h-11 max-w-full border border-[#8a8782] bg-canvas px-3 text-[14px] focus:border-charcoal";

export default async function ApplicationsPage() {
  const positions = [...(await getContent()).openJobs().filter((j) => !j.preview).map((j) => ({ value: j.slug, label: j.title })), ...GENERAL_POSITIONS];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Applications" }]}
        title="Job applications"
        description="Applications from the careers pages. Resumes are stored privately and open through a link that expires after a few minutes. Publishers and Administrators only."
      />
      <form action="/admin/applications" className="flex flex-wrap items-end gap-3" aria-label="Filter applications">
        <div className="min-w-0">
          <label htmlFor="app-position" className="text-[13px] font-bold">
            Position
          </label>
          <select id="app-position" name="position" className={select} defaultValue="">
            <option value="">All positions</option>
            {positions.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="app-status" className="text-[13px] font-bold">
            Status
          </label>
          <select id="app-status" name="status" className={select} defaultValue="">
            <option value="">All</option>
            <option value="new">New</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Not progressed</option>
          </select>
        </div>
        <button type="submit" className="btn btn-secondary h-11">
          Filter
        </button>
      </form>
      <EmptyTable caption="Job applications" columns={["Reference", "Received", "Name", "Position", "Experience", "Resume", "Status"]} emptyTitle="No applications to show">
        Applications appear here once the careers form is connected to the backend. Resumes are kept only for the
        retention period the firm agrees.
      </EmptyTable>
    </div>
  );
}
