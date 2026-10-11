import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  AuthFlowType,
  GetUserCommand,
  GlobalSignOutCommand,
  AdminConfirmSignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  AttributeType,
} from "@aws-sdk/client-cognito-identity-provider";
import crypto from "node:crypto";
import { UserProfile, AuthSessionUser } from "@/types/auth";

export function getCognitoConfig() {
  const userPoolId = process.env.COGNITO_USER_POOL_ID || "";
  const clientId = process.env.COGNITO_CLIENT_ID || "";
  const clientSecret = process.env.COGNITO_CLIENT_SECRET || "";
  const region =
    process.env.COGNITO_REGION ||
    (userPoolId.includes("_") ? userPoolId.split("_")[0] : "us-east-1");

  return {
    userPoolId,
    clientId,
    clientSecret,
    region,
  };
}

let cognitoClientInstance: CognitoIdentityProviderClient | null = null;

export function getCognitoClient(): CognitoIdentityProviderClient {
  if (cognitoClientInstance) return cognitoClientInstance;

  const { region } = getCognitoConfig();
  const credentials =
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
      : undefined;

  cognitoClientInstance = new CognitoIdentityProviderClient({
    region,
    ...(credentials ? { credentials } : {}),
  });

  return cognitoClientInstance;
}

export function calculateSecretHash(
  username: string,
  clientId: string,
  clientSecret: string,
): string {
  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

export function getSecretHash(username: string): string | undefined {
  const { clientId, clientSecret } = getCognitoConfig();
  if (!clientSecret) return undefined;
  return calculateSecretHash(username, clientId, clientSecret);
}

export function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], "base64url").toString("utf8");
    return JSON.parse(payload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

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

export function mapAttributesToUserProfile(
  sub: string,
  attrs: Record<string, string>,
): UserProfile {
  const role = (attrs["custom:role"] || "student") as "student" | "teacher";
  const fullName = attrs["name"] || "";
  const email = attrs["email"] || "";
  const picture = attrs["picture"] || null;
  const birthdate = attrs["birthdate"] || null;

  let dob_day: number | null = null;
  let dob_month: number | null = null;
  let dob_year: number | null = null;
  let dob_formatted: string | null = null;

  if (birthdate && birthdate.includes("-")) {
    const parts = birthdate.split("-");
    if (parts.length === 3) {
      dob_year = Number(parts[0]) || null;
      dob_month = Number(parts[1]) || null;
      dob_day = Number(parts[2]) || null;

      if (dob_day && dob_month && dob_year) {
        dob_formatted = `${dob_day} ${monthNames[dob_month - 1]} ${dob_year}`;
      }
    }
  }

  const profile: UserProfile = {
    user_id: sub,
    email,
    full_name: fullName,
    role,
    picture,
    birthdate,
    dob_day,
    dob_month,
    dob_year,
    dob_formatted,
  };

  if (role === "student") {
    profile.education_category = attrs["custom:s_category"] || null;
    profile.education_subcategory = attrs["custom:s_stream"] || null;
    profile.education_year = attrs["custom:s_year_of_study"] || null;
  } else {
    profile.education_category = attrs["custom:t_highest_degree"] || null;
    profile.degree_institute = attrs["custom:t_graduated_from"] || null;
    profile.affiliated_institute = attrs["custom:t_current_institute"] || null;
  }

  return profile;
}

export function attributesListToMap(
  attributes: AttributeType[] = [],
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const attr of attributes) {
    if (attr.Name && attr.Value !== undefined) {
      map[attr.Name] = attr.Value;
    }
  }
  return map;
}

export function generateDefaultAvatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name,
  )}&background=0A0A0A&color=ffffff&size=200&bold=true`;
}
