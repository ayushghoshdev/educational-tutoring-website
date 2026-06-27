import { Button } from "@/components/ui/button";
import Link from "next/link";

const HomePage = () => {
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
