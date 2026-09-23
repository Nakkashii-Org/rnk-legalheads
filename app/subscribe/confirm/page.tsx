import Link from "next/link";
import LinkExpired from "@/components/newsletter/LinkExpired";
import Arrow from "@/components/ui/Arrow";
import DraftNote from "@/components/ui/DraftNote";
import StatusPanel from "@/components/ui/StatusPanel";
import { previewState, tokenPageMetadata } from "@/lib/token-pages";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata = tokenPageMetadata("Subscription confirmation");

/**
 * L05 / L08. Confirmation is shown only after the server has verified the provider's
 * confirmation state; a query parameter alone is never trusted (guide p.130, p.158).
 * Verification is added with the backend. Until then every link is treated as unverifiable.
 */
export default async function SubscribeConfirmPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const preview = previewState(params, ["confirmed", "expired"]);
  const previewNote = preview && (
    <DraftNote className="mt-6 bg-canvas">Preview state. No subscription has been created or changed.</DraftNote>
  );

  if (preview === "confirmed") {
    return (
      <StatusPanel
        note={previewNote}
        title="Your subscription is confirmed"
        actions={
          <Link href="/preferences" className="btn btn-primary">
            Manage preferences <Arrow />
          </Link>
        }
      >
        <p>Your subscription is confirmed. You can change your topics or unsubscribe at any time using the links in our emails.</p>
      </StatusPanel>
    );
  }

  return <LinkExpired note={previewNote} />;
}
