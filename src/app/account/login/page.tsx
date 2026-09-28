import { AuthShell, safeNext } from "../AuthShell";
import { StartForm } from "../StartForm";

export default async function LoginPage({ searchParams }: PageProps<"/account/login">) {
  const { next } = await searchParams;
  return (
    <AuthShell title="Welcome back" subtitle="Enter your email and we'll send you a 6-digit code.">
      <StartForm mode="login" next={safeNext(next)} />
    </AuthShell>
  );
}
