import Link from "next/link";
import Arrow from "@/components/ui/Arrow";
import StatusPanel from "@/components/ui/StatusPanel";

/** L08: shown for any link that cannot be verified. Never reveals the underlying subscriber record. */
export default function LinkExpired({ note }: { note?: React.ReactNode }) {
  return (
    <StatusPanel
      note={note}
      title="This link has expired"
      actions={
        <Link href="/subscribe" className="btn btn-primary">
          Request a new link <Arrow />
        </Link>
      }
    >
      <p>This link has expired or is no longer valid. Request a new confirmation link to continue.</p>
    </StatusPanel>
  );
}
