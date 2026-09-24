import type { Metadata } from "next";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/admin/EmptyState";
import MediaUploader from "@/components/admin/MediaUploader";

export const metadata: Metadata = { title: "Media library" };

export default function MediaPage() {
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
        <EmptyState title="No images uploaded yet">
          Uploaded images appear here with their title, source, licence and alt text, ready to choose in any editor.
        </EmptyState>
      </section>
    </div>
  );
}
