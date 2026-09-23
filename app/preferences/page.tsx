import Link from "next/link";
import LinkExpired from "@/components/newsletter/LinkExpired";
import PreferencesForm from "@/components/newsletter/PreferencesForm";
import Arrow from "@/components/ui/Arrow";
import DraftNote from "@/components/ui/DraftNote";
import PageHero from "@/components/ui/PageHero";
import StatusPanel from "@/components/ui/StatusPanel";
import { previewState, readToken, tokenPageMetadata } from "@/lib/token-pages";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata = tokenPageMetadata("Newsletter preferences");

const PREVIEW_TOKEN = "preview-token-not-valid";

/**
 * L06. Preferences load only for the owner of a signed link; there is no public subscriber
 * lookup and no email address in the URL (guide p.10, p.131).
 */
export default async function PreferencesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const preview = previewState(params, ["preferences"]);
  const token = readToken(params);

  if (preview || token) {
    // With the backend, the server exchanges the token for the saved topics; unverifiable tokens get L08.
    if (!preview) return <LinkExpired />;
    return (
      <>
        <PageHero
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Newsletter preferences" }]}
          eyebrow="Email subscriptions"
          title="Your newsletter preferences"
          lead="Choose the topics you wish to receive, or unsubscribe from all newsletters."
        >
          <DraftNote className="mt-6">Preview state. The saved topics shown here are examples, not a real subscription.</DraftNote>
        </PageHero>
        <div className="shell py-12 md:py-16">
          <div className="max-w-[720px]">
            <PreferencesForm token={PREVIEW_TOKEN} initialTopics={["business", "disputes"]} />
          </div>
        </div>
      </>
    );
  }

  // No link: explain how to reach preferences safely.
  return (
    <StatusPanel
      title="Manage your preferences"
      actions={
        <>
          <Link href="/subscribe" className="btn btn-primary">
            Subscribe <Arrow />
          </Link>
          <Link href="/newsletters" className="link-action">
            Newsletter archive <Arrow />
          </Link>
        </>
      }
    >
      <p>
        To change your topics or unsubscribe, use the <strong className="text-charcoal">Manage preferences</strong> link
        at the foot of any RNK newsletter email. For your security, preferences can only be opened from that link.
      </p>
      <p>If you are not yet subscribed, you can choose your topics on the subscription page.</p>
    </StatusPanel>
  );
}
