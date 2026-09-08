"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  studentRegisterSchemaWithDOB,
  StudentRegisterInput,
} from "@/schemas/studentRegisterSchema";
import { LoaderCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerStudent } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegistrationForm() {
  const [mounted, setMounted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<any>({
    resolver: zodResolver(studentRegisterSchemaWithDOB) as any,
    mode: "onChange",
  });

  const watchedDay = watch("dob.day");
  const watchedMonth = watch("dob.month");
  const watchedYear = watch("dob.year");

  const getDaysInMonth = (year?: number | string, month?: number | string) => {
    const y = Number(year) || new Date().getFullYear();
    const m = Number(month) || 1;
    return new Date(y, m, 0).getDate();
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const maxDay = getDaysInMonth(watchedYear as any, watchedMonth as any);
  const watchedCategory = watch("education.category");

  const subcategoryOptions: Record<string, string[]> = {
    school: ["Science", "Commerce", "Arts"],
    undergraduate: ["B. Tech", "B. Com", "B. Sc", "B. A", "BBA", "MCA", "BCA"],
    postgraduate: ["M. Tech", "M. Com", "M. Sc", "M. A", "MBA", "MCA"],
  };

  const yearOptions: Record<string, string[]> = {
    school: ["Class 9", "Class 10", "Class 11", "Class 12"],
    undergraduate: ["Year 1", "Year 2", "Year 3", "Year 4"],
    postgraduate: ["Year 1", "Year 2", "Year 3", "Year 4"],
  };

  const currentSubcategoryOptions =
    watchedCategory && subcategoryOptions[watchedCategory]
      ? subcategoryOptions[watchedCategory]
      : [];

  const currentYearOptions =
    watchedCategory && yearOptions[watchedCategory]
      ? yearOptions[watchedCategory]
      : [];

  useEffect(() => {
    if (watchedDay && Number(watchedDay) > maxDay) {
      setValue("dob.day", undefined as any);
    }
  }, [watchedDay, maxDay, setValue]);

  useEffect(() => {
    setValue("education.subcategory", undefined as any);
    setValue("education.year", undefined as any);
  }, [watchedCategory, setValue]);

  const onSubmit = async (data: StudentRegisterInput) => {
    setServerError(null);
    try {
      const res = await registerStudent(data);
      if (!res.success) {
        setServerError(
          res.error || "Registration failed. Please check your information.",
        );
        return;
      }
      reset();
      router.push("/profile");
      router.refresh();
    } catch (err: any) {
      setServerError(
        err?.message || "An unexpected error occurred during registration.",
      );
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4 rounded-2xl">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-medium tracking-tight">
          Create Account As Student
        </h1>
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
            type="text"
            {...register("fullName")}
            placeholder="Full Name"
            className="w-full px-4 py-2 rounded-lg text-sm text-foreground placeholder-muted-foreground bg-secondary transition-all duration-200"
          />
          {errors.fullName && (
            <p className="text-xs font-medium text-red-500 mt-1">
              {(errors.fullName as any).message}
            </p>
          )}
        </div>

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

        <div className="bg-muted rounded-xl px-2 py-1 pb-2">
          <p className="text-sm text-muted-foreground m-1">Date of Birth</p>
          <div className="flex gap-2 outline-none border-none">
            <div className="w-1/3">
              <Controller
                control={control}
                name="dob.day"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val: string) =>
                      field.onChange(val === "" ? undefined : Number(val))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Day</SelectLabel>
                        {Array.from({ length: maxDay }, (_, i) => i + 1).map(
                          (d) => (
                            <SelectItem key={d} value={String(d)}>
                              {d}
                            </SelectItem>
                          ),
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="w-1/3">
              <Controller
                control={control}
                name="dob.month"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val: string) =>
                      field.onChange(val === "" ? undefined : Number(val))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Month</SelectLabel>
                        {monthNames.map((name, index) => (
                          <SelectItem key={name} value={String(index + 1)}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="w-1/3">
              <Controller
                control={control}
                name="dob.year"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val: string) =>
                      field.onChange(val === "" ? undefined : Number(val))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Year</SelectLabel>
                        {Array.from(
                          { length: 2026 - 1946 + 1 },
                          (_, i) => 2026 - i,
                        ).map((y) => (
                          <SelectItem key={y} value={String(y)}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          {errors.dob && (
            <p className="text-xs font-medium text-red-500 mt-1 mx-1">
              {(errors.dob as any).message}
            </p>
          )}
        </div>

        <div className="bg-muted rounded-xl px-2 pt-1 pb-2">
          <p className="text-sm text-muted-foreground m-1">
            Current Education Level
          </p>
          <div className="flex flex-col gap-2 space-y-1 outline-none border-none">
            <div>
              <Controller
                control={control}
                name="education.category"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val: string) =>
                      field.onChange(val === "" ? undefined : val)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Student's Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Student's category</SelectLabel>
                        <SelectItem value="school">School</SelectItem>
                        <SelectItem value="undergraduate">
                          Undergraduate
                        </SelectItem>
                        <SelectItem value="postgraduate">
                          Postgraduate
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Controller
                control={control}
                name="education.subcategory"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val: string) =>
                      field.onChange(val === "" ? undefined : val)
                    }
                    disabled={!watchedCategory || watchedCategory === "other"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Student's Stream" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Student's Stream</SelectLabel>
                        {currentSubcategoryOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Controller
                control={control}
                name="education.year"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val: string) =>
                      field.onChange(val === "" ? undefined : val)
                    }
                    disabled={!watchedCategory || watchedCategory === "other"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Student's Year of Study" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Year of study</SelectLabel>
                        {currentYearOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          {errors.education && (
            <p className="text-xs font-medium text-red-500 mt-1 mx-1">
              {(errors.education as any).message}
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
              <span>Registering account...</span>
            </span>
          ) : (
            "Register"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline hover:text-foreground/80 transition-colors"
        >
          Log in here
        </Link>
      </div>
    </div>
  );
}
