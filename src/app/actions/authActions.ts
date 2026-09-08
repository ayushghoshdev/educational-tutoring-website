"use server";

import { auth } from "@/lib/auth/server";
import {
  upsertUserProfile,
  getUserProfileByUserId,
  getUserProfileByEmail,
  UserProfile,
} from "@/lib/db";
import { loginSchema, LoginInput } from "@/schemas/loginSchema";
import {
  studentRegisterSchemaWithDOB,
  StudentRegisterInput,
} from "@/schemas/studentRegisterSchema";
import {
  teacherRegisterSchemaWithDOB,
  TeacherRegisterInput,
} from "@/schemas/teacherRegisterSchema";

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

export async function loginUser(input: LoginInput) {
  try {
    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid input data",
      };
    }

    const { email, password } = parsed.data;
    const response = await auth.signIn.email({
      email,
      password,
    });

    if (response.error) {
      return {
        success: false,
        error: response.error.message || "Failed to login. Please check your credentials.",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error?.message || "An unexpected error occurred during login.",
    };
  }
}

export async function registerStudent(input: StudentRegisterInput) {
  try {
    const parsed = studentRegisterSchemaWithDOB.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid registration data",
      };
    }

    const data = parsed.data;
    const authResult = await auth.signUp.email({
      email: data.email,
      password: data.password,
      name: data.fullName,
    });

    if (authResult.error) {
      return {
        success: false,
        error: authResult.error.message || "Failed to create student account.",
      };
    }

    const userId = (authResult.data as any)?.user?.id || (authResult.data as any)?.id || data.email;

    const dobFormatted =
      data.dob?.day && data.dob?.month && data.dob?.year
        ? `${data.dob.day} ${monthNames[data.dob.month - 1]} ${data.dob.year}`
        : null;

    const profileData: UserProfile = {
      user_id: String(userId),
      email: data.email,
      full_name: data.fullName,
      role: "student",
      dob_day: data.dob?.day ?? null,
      dob_month: data.dob?.month ?? null,
      dob_year: data.dob?.year ?? null,
      dob_formatted: dobFormatted,
      education_category: data.education?.category ?? null,
      education_subcategory: data.education?.subcategory ?? null,
      education_year: data.education?.year ?? null,
    };

    await upsertUserProfile(profileData);

    return {
      success: true,
      data: authResult.data,
    };
  } catch (error: any) {
    console.error("Student registration error:", error);
    return {
      success: false,
      error: error?.message || "An unexpected error occurred during registration.",
    };
  }
}

export async function registerTeacher(input: TeacherRegisterInput) {
  try {
    const parsed = teacherRegisterSchemaWithDOB.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid registration data",
      };
    }

    const data = parsed.data;
    const authResult = await auth.signUp.email({
      email: data.email,
      password: data.password,
      name: data.fullName,
    });

    if (authResult.error) {
      return {
        success: false,
        error: authResult.error.message || "Failed to create teacher account.",
      };
    }

    const userId = (authResult.data as any)?.user?.id || (authResult.data as any)?.id || data.email;

    const dobFormatted =
      data.dob?.day && data.dob?.month && data.dob?.year
        ? `${data.dob.day} ${monthNames[data.dob.month - 1]} ${data.dob.year}`
        : null;

    const profileData: UserProfile = {
      user_id: String(userId),
      email: data.email,
      full_name: data.fullName,
      role: "teacher",
      dob_day: data.dob?.day ?? null,
      dob_month: data.dob?.month ?? null,
      dob_year: data.dob?.year ?? null,
      dob_formatted: dobFormatted,
      education_category: data.education?.category ?? null,
      degree_institute: data.degreeInstitute,
      affiliated_institute: data.affiliatedInstitute,
    };

    await upsertUserProfile(profileData);

    return {
      success: true,
      data: authResult.data,
    };
  } catch (error: any) {
    console.error("Teacher registration error:", error);
    return {
      success: false,
      error: error?.message || "An unexpected error occurred during registration.",
    };
  }
}

export async function signOutUser() {
  try {
    await auth.signOut();
    return { success: true };
  } catch (error: any) {
    console.error("Sign out error:", error);
    return { success: false, error: error?.message || "Failed to sign out" };
  }
}

export async function getCurrentUserProfile() {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return { session: null, profile: null };
    }

    let profile = await getUserProfileByUserId(session.user.id);
    if (!profile && session.user.email) {
      profile = await getUserProfileByEmail(session.user.email);
    }

    return {
      session: session.user,
      profile,
    };
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    return { session: null, profile: null };
  }
}
