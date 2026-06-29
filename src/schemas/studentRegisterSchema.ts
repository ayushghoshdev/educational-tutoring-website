import { z } from "zod";

export const studentRegisterSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(4, "Full name must be at least 4 characters long")
      .max(50, "Full name must be under 50 characters")
      .regex(
        /^[A-Za-zÀ-ÖØ-öø-ÿ-]+(?: +[A-Za-zÀ-ÖØ-öø-ÿ-]+)+$/,
        "Please enter your full name (first and last name separated by a space)",
      ),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be under 20 characters")
      .optional(),
    email: z.email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    dob: z
      .object({
        day: z.preprocess((val) => {
          if (val === undefined || val === null || val === "") return undefined;
          const num = Number(val);
          return isNaN(num) ? undefined : num;
        }, z.number().int().optional()),
        month: z.preprocess((val) => {
          if (val === undefined || val === null || val === "") return undefined;
          const num = Number(val);
          return isNaN(num) ? undefined : num;
        }, z.number().int().optional()),
        year: z.preprocess((val) => {
          if (val === undefined || val === null || val === "") return undefined;
          const num = Number(val);
          return isNaN(num) ? undefined : num;
        }, z.number().int().optional()),
      })
      .superRefine((data, ctx) => {
        const { day, month, year } = data;
        if (day === undefined || month === undefined || year === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please enter a valid date of birth",
          });
        } else {
          if (
            day < 1 ||
            day > 31 ||
            month < 1 ||
            month > 12 ||
            year < 1946 ||
            year > 2026
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Please enter a valid date of birth",
            });
          } else {
            const dt = new Date(year, month - 1, day);
            if (
              dt.getFullYear() !== year ||
              dt.getMonth() !== month - 1 ||
              dt.getDate() !== day
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please enter a valid date of birth",
              });
            }
          }
        }
      }),
    education: z
      .object({
        category: z.string().optional(),
        subcategory: z.string().optional(),
        year: z.string().optional(),
      })
      .superRefine((data, ctx) => {
        if (!data.category) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select your current education level",
          });
        } else if (data.category !== "other") {
          if (!data.subcategory || !data.year) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Please select your current education level",
            });
          }
        }
      }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

// Validate the composed date (day, month, year) is a real date
export const studentRegisterSchemaWithDOB = studentRegisterSchema;

export type StudentRegisterInput = z.infer<typeof studentRegisterSchemaWithDOB>;
