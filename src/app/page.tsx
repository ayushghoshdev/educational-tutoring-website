import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const HomePage = async () => {
  const { data: session, expired } = await auth.getSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  if (expired) {
    redirect("/login?expired=true");
  }

  return (
    <div className="flex flex-col gap-2 h-screen items-center justify-center">
      <Link href="/login">
        <Button size="lg">Login</Button>
      </Link>
      <Link href="/register">
        <Button size="lg">Register</Button>
      </Link>
    </div>
  );
};
export default HomePage;
