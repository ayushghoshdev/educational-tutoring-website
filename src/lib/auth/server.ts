import { createNeonAuth } from "@neondatabase/auth/next/server";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL || "",
  cookies: {
    secret:
      process.env.NEON_AUTH_COOKIE_SECRET ||
      "development_neon_auth_cookie_secret_min_32_chars_long_1234567890",
  },
});
