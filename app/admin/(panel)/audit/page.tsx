import type { Metadata } from "next";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyTable from "@/components/admin/EmptyTable";

export const metadata: Metadata = { title: "Audit log" };

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Audit log" }]}
        title="Audit log"
        description="A permanent record of sign-ins, saves, approvals, publishing and account changes: who, what, which revision and when (guide p.152). It never stores enquiry text or resumes."
      />
      <EmptyTable caption="Audit events" columns={["Time", "User", "Action", "Record", "Revision"]} emptyTitle="No events recorded yet">
        Events are recorded by the backend from the first sign-in onwards.
      </EmptyTable>
    </div>
  );
}
