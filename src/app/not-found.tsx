import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function NotFound() {
  let isLoggedIn = false;

  try {
    const { data: session } = await auth.getSession();
    isLoggedIn = Boolean(session?.user);
  } catch (error) {
    console.error("Error checking session in NotFound page:", error);
  }

  const href = isLoggedIn ? "/dashboard" : "/";
  const label = isLoggedIn ? "Go to dashboard" : "Go to homepage";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-lg sm:text-xl font-normal text-muted-foreground tracking-tight">
        Sorry, we <span className="text-foreground">can't find the page</span>{" "}
        you're looking for.
      </h1>
      <div className="mt-2">
        <Button asChild>
          <Link href={href}>
            <span>{label}</span>
          </Link>
        </Button>
      </div>
    </main>
  );
}
