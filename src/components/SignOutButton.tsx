"use client";

import { useState } from "react";
import { LogOut, LoaderCircle } from "lucide-react";
import { signOutUser } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignOutButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOutUser();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Failed to sign out:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleSignOut}
      disabled={loading}
      className={`flex items-center gap-2 cursor-pointer ${className || ""}`}
    >
      {loading ? (
        <LoaderCircle className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      <span>{loading ? "Signing out..." : "Sign Out"}</span>
    </Button>
  );
}
