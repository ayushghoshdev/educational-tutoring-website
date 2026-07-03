"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/schemas/loginSchema";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const [mounted, setMounted] = useState(false);

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
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Validated Form Data Submitted Successfully:", data);
    reset();
  };

  return (
    <div className="w-full max-w-sm space-y-4 rounded-2xl">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-medium tracking-tight">Login</h1>
      </div>

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

        <div className="space-y-1">
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm password"
            className="w-full px-4 py-2 rounded-lg text-sm text-foreground placeholder-muted-foreground bg-secondary transition-all duration-200"
          />
          {errors.confirmPassword && (
            <p className="text-xs font-medium text-red-500 mt-1">
              {(errors.confirmPassword as any).message}
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
              <LoaderCircle className="animate-spin w-5" />
            </span>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </div>
  );
}
