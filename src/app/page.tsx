import { Button } from "@/components/ui/button";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Link href="/register">
        <Button size="lg">Register</Button>
      </Link>
    </div>
  );
};
export default HomePage;
