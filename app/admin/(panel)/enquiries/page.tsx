import type { Metadata } from "next";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyTable from "@/components/admin/EmptyTable";

export const metadata: Metadata = { title: "Enquiries" };

const select = "mt-1 block h-11 border border-[#8a8782] bg-canvas px-3 text-[14px] focus:border-charcoal";

export default function EnquiriesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Enquiries" }]}
        title="Enquiries"
        description="Messages sent from the website contact form. Each one is also emailed to contact@rnklegalheads.com. Publishers and Administrators only."
      />
      <form action="/admin/enquiries" className="flex flex-wrap items-end gap-3" aria-label="Filter enquiries">
        <div>
          <label htmlFor="enq-status" className="text-[13px] font-bold">
            Status
          </label>
          <select id="enq-status" name="status" className={select} defaultValue="">
            <option value="">All</option>
            <option value="new">New</option>
            <option value="in-progress">In progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <button type="submit" className="btn btn-secondary h-11">
          Filter
        </button>
      </form>
      <EmptyTable caption="Contact enquiries" columns={["Reference", "Received", "Name", "Service", "Status"]} emptyTitle="No enquiries to show">
        Enquiries appear here once the contact form is connected to the backend. Opening one shows the message, the
        sender&apos;s details and a status you can update.
      </EmptyTable>
    </div>
  );
}
