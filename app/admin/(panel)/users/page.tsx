import type { Metadata } from "next";
import AddUserForm from "@/components/admin/AddUserForm";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyTable from "@/components/admin/EmptyTable";
import { ROLES } from "@/lib/admin/config";

export const metadata: Metadata = { title: "Users and roles" };

const permissions: { action: string; roles: string[] }[] = [
  { action: "Create and edit drafts", roles: ["contributor", "reviewer", "publisher", "admin"] },
  { action: "Send for review", roles: ["contributor", "reviewer", "publisher", "admin"] },
  { action: "Approve or request changes", roles: ["reviewer", "admin"] },
  { action: "Publish or unpublish", roles: ["publisher", "admin"] },
  { action: "Media library", roles: ["contributor", "reviewer", "publisher", "admin"] },
  { action: "Enquiries and applications", roles: ["publisher", "admin"] },
  { action: "Site settings", roles: ["admin"] },
  { action: "Users and roles", roles: ["admin"] },
];

export default function UsersPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Users and roles" }]}
        title="Users and roles"
        description="Named accounts only, each with two-step sign-in. There is no public sign-up. Newsletter sending is done in Brevo and is not a CMS role."
      />

      <EmptyTable caption="CMS users" columns={["Name", "Email", "Roles", "Two-step sign-in", "Last sign-in", "Status"]} emptyTitle="No accounts yet">
        The first Administrator account is created during backend setup. Administrators then invite everyone else here.
      </EmptyTable>

      <AddUserForm />

      <section aria-labelledby="perm-title" className="space-y-3">
        <h2 id="perm-title" className="font-serif text-[20px] leading-[28px]">
          What each role can do
        </h2>
        <p className="text-[13px] text-muted">Enforced by the server on every request. Hidden buttons are not relied on for access control.</p>
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
            <caption className="sr-only">Role permissions</caption>
            <thead>
              <tr className="border-b border-charcoal">
                <th scope="col" className="py-2 pr-4 font-bold">
                  Action
                </th>
                {ROLES.map((r) => (
                  <th key={r.value} scope="col" className="px-2 py-2 text-center font-bold">
                    {r.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((p) => (
                <tr key={p.action} className="border-b border-line">
                  <th scope="row" className="py-2 pr-4 font-normal">
                    {p.action}
                  </th>
                  {ROLES.map((r) => (
                    <td key={r.value} className="px-2 py-2 text-center">
                      {p.roles.includes(r.value) ? (
                        <>
                          <span aria-hidden="true">✓</span>
                          <span className="sr-only">Yes</span>
                        </>
                      ) : (
                        <>
                          <span aria-hidden="true" className="text-muted">
                            –
                          </span>
                          <span className="sr-only">No</span>
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
