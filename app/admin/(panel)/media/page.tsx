import type { Metadata } from "next";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/admin/EmptyState";
import MediaLibrary from "@/components/admin/MediaLibrary";
import MediaUploader from "@/components/admin/MediaUploader";
import { listMedia } from "@/lib/admin/records";
import { getAdminUser, isAdmin } from "@/lib/admin/session";

export const metadata: Metadata = { title: "Media library" };

export default async function MediaPage() {
  const [media, user] = await Promise.all([listMedia(), getAdminUser()]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Media library" }]}
        title="Media library"
        description="Approved portraits and images for the website. Large originals are resized automatically for fast pages. Do not label decorative images as the firm's office."
      />
      <MediaUploader />
      <section aria-labelledby="library-title" className="space-y-3">
        <h2 id="library-title" className="text-[16px] font-bold">
          Library
        </h2>
        {!media.ok ? (
          <EmptyState title="The library could not be loaded">Please refresh the page. If it keeps happening, the backend may be asleep or down.</EmptyState>
        ) : media.data.length === 0 ? (
          <EmptyState title="No images uploaded yet">
            Uploaded images appear here with their title, source, licence and alt text, ready to choose in any editor.
          </EmptyState>
        ) : (
          <MediaLibrary items={media.data} email={user?.email ?? ""} admin={isAdmin(user)} />
        )}
      </section>
    </div>
  );
}
