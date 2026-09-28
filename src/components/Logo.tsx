export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-serif text-2xl tracking-tight ${className}`}>
      Kiln <span className="text-clay italic">&amp;</span> Co.
    </span>
  );
}
