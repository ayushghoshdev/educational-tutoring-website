export interface UserProfile {
  id?: number | string;
  user_id: string;
  email: string;
  full_name: string;
  role: "student" | "teacher";
  picture?: string | null;
  dob_day?: number | null;
  dob_month?: number | null;
  dob_year?: number | null;
  dob_formatted?: string | null;
  birthdate?: string | null;
  // Student attributes
  education_category?: string | null;
  education_subcategory?: string | null;
  education_year?: string | null;
  // Teacher attributes
  degree_institute?: string | null;
  affiliated_institute?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AuthSessionUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role?: "student" | "teacher";
}

export interface AuthSession {
  user: AuthSessionUser | null;
}

