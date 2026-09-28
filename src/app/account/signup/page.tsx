import { AuthShell, safeNext } from "../AuthShell";
import { StartForm } from "../StartForm";

export default async function SignupPage({ searchParams }: PageProps<"/account/signup">) {
  const { next } = await searchParams;
  return (
    <AuthShell title="Create your account" subtitle="No passwords here. We'll email you a code each time you sign in.">
      <StartForm mode="signup" next={safeNext(next)} />
    </AuthShell>
  );
}
