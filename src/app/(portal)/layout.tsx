import FloatingTopRightBar from "@/components/FloatingTopRightBar";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/lib/auth/server";
import { getCurrentUserProfile } from "@/app/actions/authActions";
import { redirect } from "next/navigation";
import { PortalUserProvider } from "@/components/PortalUserProvider";

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

  const { profile, session: userSession } = await getCurrentUserProfile();
  const role =
    profile?.role || userSession?.role || session.user.role || "student";

  return (
    <PortalUserProvider
      initialRole={role}
      initialProfile={profile}
      initialUser={userSession || session.user}
    >
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1">
          <FloatingTopRightBar />
          {children}
        </main>
      </div>
    </PortalUserProvider>
  );
}
