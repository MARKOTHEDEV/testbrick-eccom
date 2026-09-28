import { Art } from "@/components/Art";
import { GLAZES } from "@/lib/products";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-20 grid gap-12 md:grid-cols-2 items-center">
      <div className="max-w-md">
        <h1 className="font-serif text-4xl sm:text-5xl">{title}</h1>
        <p className="text-muted mt-3">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
      <Art shape="teapot" glaze={GLAZES.ember.color} backdrop="#e6d6c2" className="hidden md:block w-full rounded-3xl" />
    </div>
  );
}

export function safeNext(next: unknown) {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}
