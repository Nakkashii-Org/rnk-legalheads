import LegalPageView, { legalMetadata } from "@/components/ui/LegalPageView";
import { getLegalPage } from "@/lib/content/legal";

const page = getLegalPage("/disclaimer");

export const metadata = legalMetadata(page);

export default function Page() {
  return <LegalPageView page={page} />;
}
