import LoginForm from "./LoginForm";
import { auth } from "@/lib/auth/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ expired?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const { expired } = await auth.getSession();
  const isExpired = params?.expired === "true" || !!expired;

  return (
    <main className="h-screen flex items-center justify-center">
      <LoginForm sessionExpired={isExpired} />
    </main>
  );
}
