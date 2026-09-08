"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/schemas/loginSchema";
import { LoaderCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [mounted, setMounted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    try {
      const res = await loginUser(data);
      if (!res.success) {
        setServerError(
          res.error || "Failed to login. Please check your credentials.",
        );
        return;
      }
      reset();
      router.push("/profile");
      router.refresh();
    } catch (err: any) {
      setServerError(
        err?.message || "An unexpected error occurred during login.",
      );
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4 rounded-2xl">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-medium tracking-tight">Login</h1>
      </div>

      {serverError && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg text-sm text-foreground placeholder-muted-foreground bg-secondary transition-all duration-200"
          />
          {errors.email && (
            <p className="text-xs font-medium text-red-500 mt-1">
              {(errors.email as any).message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg text-sm text-foreground placeholder-muted-foreground bg-secondary transition-all duration-200"
          />
          {errors.password && (
            <p className="text-xs font-medium text-red-500 mt-1">
              {(errors.password as any).message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!mounted || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <LoaderCircle className="animate-spin w-5 h-5" />
              <span>Logging in...</span>
            </span>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline hover:text-foreground/80 transition-colors"
        >
          Register here
        </Link>
      </div>
    </div>
  );
}
