import Link from "next/link";
import LinkExpired from "@/components/newsletter/LinkExpired";
import Arrow from "@/components/ui/Arrow";
import DraftNote from "@/components/ui/DraftNote";
import StatusPanel from "@/components/ui/StatusPanel";
import { backendGet } from "@/lib/backend";
import { previewState, readToken, tokenPageMetadata } from "@/lib/token-pages";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata = tokenPageMetadata("Subscription confirmation");

function Confirmed({ manageHref, note }: { manageHref: string; note?: React.ReactNode }) {
  return (
    <StatusPanel
      note={note}
      title="Your subscription is confirmed"
      actions={
        <Link href={manageHref} className="btn btn-primary">
          Manage preferences <Arrow />
        </Link>
      }
    >
      <p>Your subscription is confirmed. You can change your topics or unsubscribe at any time using the links in our emails.</p>
    </StatusPanel>
  );
}

/**
 * L05 / L08. Brevo redirects here after the subscriber clicks the confirmation email. The backend
 * checks Brevo's real state; a query parameter alone is never trusted (guide p.130, p.158).
 */
export default async function SubscribeConfirmPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const preview = previewState(params, ["confirmed", "expired"]);
  const previewNote = preview && (
    <DraftNote className="mt-6 bg-canvas">Preview state. No subscription has been created or changed.</DraftNote>
  );

  if (preview === "confirmed") return <Confirmed manageHref="/preferences" note={previewNote} />;
  if (preview) return <LinkExpired note={previewNote} />;

  const token = readToken(params);
  if (token) {
    const result = await backendGet<{ status: string; manageToken?: string }>(`/api/subscribe/confirm?token=${encodeURIComponent(token)}`);
    if (result.ok && result.data.status === "confirmed" && result.data.manageToken)
      return <Confirmed manageHref={`/preferences?token=${encodeURIComponent(result.data.manageToken)}`} />;
  }

  return <LinkExpired />;
}
