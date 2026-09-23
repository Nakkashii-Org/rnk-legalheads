/** Review-only notice; renders only on records that are unapproved (visible solely in draft review mode). */
export default function DraftNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`max-w-[640px] border-l-2 border-rnk bg-canvas px-4 py-3 text-[13px] leading-5 text-muted ${className}`}>
      {children}
    </p>
  );
}
