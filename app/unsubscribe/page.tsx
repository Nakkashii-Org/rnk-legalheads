import Link from "next/link";
import UnsubscribeConfirm from "@/components/newsletter/UnsubscribeConfirm";
import Arrow from "@/components/ui/Arrow";
import DraftNote from "@/components/ui/DraftNote";
import StatusPanel from "@/components/ui/StatusPanel";
import { previewState, readToken, tokenPageMetadata } from "@/lib/token-pages";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata = tokenPageMetadata("Unsubscribe");

/** L07. No login is needed for an email unsubscribe link (guide p.131). */
export default async function UnsubscribePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const preview = previewState(params, ["unsubscribed"]);
  const token = readToken(params);

  if (preview === "unsubscribed") {
    return (
      <StatusPanel
        note={<DraftNote className="mt-6 bg-canvas">Preview state. No subscription has been changed.</DraftNote>}
        title="You have been unsubscribed"
        actions={
          <Link href="/" className="btn btn-primary">
            Return to the website <Arrow />
          </Link>
        }
      >
        <p>You have been unsubscribed from RNK legal updates.</p>
      </StatusPanel>
    );
  }

  if (token) {
    return (
      <StatusPanel title="Unsubscribe from RNK legal updates">
        <UnsubscribeConfirm token={token} />
      </StatusPanel>
    );
  }

  return (
    <StatusPanel
      title="Unsubscribe from RNK legal updates"
      actions={
        <Link href="/newsletters" className="btn btn-primary">
          Newsletter archive <Arrow />
        </Link>
      }
    >
      <p>
        To stop receiving newsletters, use the <strong className="text-charcoal">Unsubscribe</strong> link at the foot of
        any RNK newsletter email. The link identifies your subscription securely, so no login is needed.
      </p>
    </StatusPanel>
  );
}
