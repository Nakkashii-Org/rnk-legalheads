/** Decorative north-east arrow used on actions and cards. */
export default function Arrow({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`inline-block leading-none ${className}`}>
      ↗
    </span>
  );
}
