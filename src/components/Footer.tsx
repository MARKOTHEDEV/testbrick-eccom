import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 sm:grid-cols-3 text-sm">
        <div>
          <Logo />
          <p className="text-muted mt-3 max-w-xs">Small-batch ceramics, fired slowly and made to be used.</p>
        </div>
        <div className="text-muted space-y-1">
          <p className="text-ink font-semibold">Visit the studio</p>
          <p>Thursdays to Saturdays, 10–6</p>
          <p>Or right here, any time</p>
        </div>
        <p className="text-muted sm:text-right">
          This is a demo shop. Nothing is charged and nothing ships.
          <br />© Kiln &amp; Co.
        </p>
      </div>
    </footer>
  );
}
