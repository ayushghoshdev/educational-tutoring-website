import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="w-full bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <nav className="flex items-center justify-between max-w-6xl mx-auto px-6 py-4">
        <div>
          <Link
            href="/"
            className="font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            Logo
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button size="lg" variant="secondary">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg">Register</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
