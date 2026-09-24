import LegalPageView, { legalMetadata } from "@/components/ui/LegalPageView";
import { getLegalPage } from "@/lib/content/legal";

const page = getLegalPage("/terms-and-conditions");

export const metadata = legalMetadata(page);

export default function Page() {
  return <LegalPageView page={page} />;
}
