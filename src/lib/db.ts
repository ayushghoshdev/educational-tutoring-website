import { neon } from "@neondatabase/serverless";

export interface UserProfile {
  id?: number;
  user_id: string;
  email: string;
  full_name: string;
  role: "student" | "teacher";
  dob_day?: number | null;
  dob_month?: number | null;
  dob_year?: number | null;
  dob_formatted?: string | null;
  education_category?: string | null;
  education_subcategory?: string | null;
  education_year?: string | null;
  degree_institute?: string | null;
  affiliated_institute?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

function ensureIpv4() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const dns = require("node:dns");
    if (dns && typeof dns.setDefaultResultOrder === "function") {
      dns.setDefaultResultOrder("ipv4first");
    }
  } catch {
    // Ignore in non-node runtimes
  }
}

export function getDb(forceDirect = false) {
  ensureIpv4();
  let databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not configured. Please add your Neon database connection string to .env.local"
    );
  }

  if (forceDirect && databaseUrl.includes("-pooler")) {
    databaseUrl = databaseUrl.replace("-pooler", "");
  }

  return neon(databaseUrl);
}

let schemaInitialized = false;

export async function initDbSchema() {
  if (schemaInitialized) return;
  try {
    ensureIpv4();
    // For DDL statements like CREATE TABLE, use direct connection without pooler
    const sql = getDb(true);
    await sql`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        full_name TEXT NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher')),
        dob_day INTEGER,
        dob_month INTEGER,
        dob_year INTEGER,
        dob_formatted TEXT,
        education_category TEXT,
        education_subcategory TEXT,
        education_year TEXT,
        degree_institute TEXT,
        affiliated_institute TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    schemaInitialized = true;
  } catch (error) {
    console.error("Failed to initialize database schema:", error);
    throw error;
  }
}

export async function upsertUserProfile(profile: UserProfile): Promise<UserProfile> {
  ensureIpv4();
  await initDbSchema();
  const sql = getDb();

  const rows = await sql`
    INSERT INTO user_profiles (
      user_id,
      email,
      full_name,
      role,
      dob_day,
      dob_month,
      dob_year,
      dob_formatted,
      education_category,
      education_subcategory,
      education_year,
      degree_institute,
      affiliated_institute,
      updated_at
    ) VALUES (
      ${profile.user_id},
      ${profile.email.toLowerCase().trim()},
      ${profile.full_name.trim()},
      ${profile.role},
      ${profile.dob_day ?? null},
      ${profile.dob_month ?? null},
      ${profile.dob_year ?? null},
      ${profile.dob_formatted ?? null},
      ${profile.education_category ?? null},
      ${profile.education_subcategory ?? null},
      ${profile.education_year ?? null},
      ${profile.degree_institute ?? null},
      ${profile.affiliated_institute ?? null},
      NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      dob_day = EXCLUDED.dob_day,
      dob_month = EXCLUDED.dob_month,
      dob_year = EXCLUDED.dob_year,
      dob_formatted = EXCLUDED.dob_formatted,
      education_category = EXCLUDED.education_category,
      education_subcategory = EXCLUDED.education_subcategory,
      education_year = EXCLUDED.education_year,
      degree_institute = EXCLUDED.degree_institute,
      affiliated_institute = EXCLUDED.affiliated_institute,
      updated_at = NOW()
    RETURNING *;
  `;

  return rows[0] as unknown as UserProfile;
}

export async function getUserProfileByUserId(userId: string): Promise<UserProfile | null> {
  try {
    ensureIpv4();
    await initDbSchema();
    const sql = getDb();

    const rows = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${userId} LIMIT 1;
    `;

    if (rows.length === 0) {
      return null;
    }

    return rows[0] as unknown as UserProfile;
  } catch (error) {
    console.error("Error fetching user profile by user_id:", error);
    return null;
  }
}

export async function getUserProfileByEmail(email: string): Promise<UserProfile | null> {
  try {
    ensureIpv4();
    await initDbSchema();
    const sql = getDb();

    const rows = await sql`
      SELECT * FROM user_profiles WHERE LOWER(email) = ${email.toLowerCase().trim()} LIMIT 1;
    `;

    if (rows.length === 0) {
      return null;
    }

    return rows[0] as unknown as UserProfile;
  } catch (error) {
    console.error("Error fetching user profile by email:", error);
    return null;
  }
}
