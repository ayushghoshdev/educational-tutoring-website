import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = await auth.getSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <main className="flex-1">{children}</main>;
}
