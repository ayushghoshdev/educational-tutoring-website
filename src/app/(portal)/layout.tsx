import FloatingTopRightBar from "@/components/FloatingTopRightBar";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, expired } = await auth.getSession();

  if (!session?.user) {
    if (expired) {
      redirect("/login?expired=true");
    }
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1">
        <FloatingTopRightBar />
        {children}
      </main>
    </div>
  );
}

