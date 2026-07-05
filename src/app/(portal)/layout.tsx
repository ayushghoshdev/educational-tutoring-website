import FloatingTopRightBar from "@/components/FloatingTopRightBar";
import Sidebar from "@/components/Sidebar";

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
