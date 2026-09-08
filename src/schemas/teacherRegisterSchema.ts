import { z } from "zod";

const baseNameSchema = z
  .string()
  .trim()
  .min(4, "Full name must be at least 4 characters long")
  .max(50, "Full name must be under 50 characters")
  .regex(
    /^[A-Za-zÀ-ÖØ-öø-ÿ-]+(?: +[A-Za-zÀ-ÖØ-öø-ÿ-]+)+$/,
    "Please enter your first and last name separated by a space",
  );

const basePasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const baseDobSchema = z
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
      return;
    }

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
      return;
    }

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
  });

export const teacherRegisterSchema = z
  .object({
    fullName: baseNameSchema,
    email: z.email("Please enter a valid email address"),
    password: basePasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    dob: baseDobSchema,
    education: z
      .object({
        category: z.string().optional(),
      })
      .superRefine((data, ctx) => {
        if (!data.category) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select your degree",
          });
        }
      }),
    degreeInstitute: z
      .string()
      .trim()
      .min(2, "Please enter your institution name")
      .max(100, "Institution name is too long"),
    affiliatedInstitute: z
      .string()
      .trim()
      .min(2, "Please enter your current affiliated institute")
      .max(100, "Affiliated institute name is too long"),
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

export const teacherRegisterSchemaWithDOB = teacherRegisterSchema;

export type TeacherRegisterInput = z.infer<typeof teacherRegisterSchemaWithDOB>;
