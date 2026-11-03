import { Navbar } from "@/components/Navbar";
import { MorphingHeroText } from "@/components/MorphingHeroText";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <section className="flex-1 flex items-center justify-center max-w-6xl w-full mx-auto px-6 py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          <div className="lg:col-span-7">
            <MorphingHeroText />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-2 w-full max-w-xs lg:ml-auto">
            <Link href="/register/student">
              <button className="cursor-pointer font-medium text-lg flex gap-1 items-center justify-center group">
                <span className="text-muted-foreground hover:text-foreground transition-all">
                  Get started as a{" "}
                  <span className="text-foreground">student</span>
                </span>
                <ArrowRight className="size-4.5 transition-transform duration-200 group-hover:translate-x-1 text-muted-foreground group-hover:text-foreground" />
              </button>
            </Link>

            <Link href="/register/teacher">
              <button className="cursor-pointer font-medium text-lg flex gap-1 items-center justify-center group">
                <span className="text-muted-foreground hover:text-foreground transition-all">
                  Get started as a{" "}
                  <span className="text-foreground">teacher</span>
                </span>
                <ArrowRight className="size-4.5 transition-transform duration-200 group-hover:translate-x-1 text-muted-foreground group-hover:text-foreground" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
