export default function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="border border-dashed border-[#8a8782] bg-canvas px-6 py-10 text-center">
      <p className="font-serif text-[20px] leading-[28px]">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-[520px] text-[14px] leading-[22px] text-muted">{children}</div>}
    </div>
  );
}
