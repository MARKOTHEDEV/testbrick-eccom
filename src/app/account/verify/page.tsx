import { AuthShell, safeNext } from "../AuthShell";
import { VerifyForm } from "./VerifyForm";

export default async function VerifyPage({ searchParams }: PageProps<"/account/verify">) {
  const { next } = await searchParams;
  return (
    <AuthShell title="Check your email" subtitle="We sent you a 6-digit code. It works for 10 minutes.">
      <VerifyForm next={safeNext(next)} />
    </AuthShell>
  );
}
