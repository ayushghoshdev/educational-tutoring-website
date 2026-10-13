import { cookies } from "next/headers";
import {
  getCognitoClient,
  getCognitoConfig,
  getSecretHash,
  decodeJwtPayload,
  mapAttributesToUserProfile,
  attributesListToMap,
  generateDefaultAvatarUrl,
} from "./cognito";
import {
  GetUserCommand,
  InitiateAuthCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import { AuthSession, AuthSessionUser, UserProfile } from "@/types/auth";

export const COOKIE_ACCESS_TOKEN = "cognito_access_token";
export const COOKIE_ID_TOKEN = "cognito_id_token";
export const COOKIE_REFRESH_TOKEN = "cognito_refresh_token";

const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export async function setAuthCookies(tokens: {
  accessToken: string;
  idToken: string;
  refreshToken?: string;
}) {
  try {
    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === "production";

    cookieStore.set(COOKIE_ACCESS_TOKEN, tokens.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    cookieStore.set(COOKIE_ID_TOKEN, tokens.idToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    if (tokens.refreshToken) {
      cookieStore.set(COOKIE_REFRESH_TOKEN, tokens.refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
      });
    }
  } catch {
    // In Server Components or Layouts during render, Next.js does not allow modifying cookies.
    // Cookies will be set via Server Actions or Route Handlers.
  }
}

export async function clearAuthCookies() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_ACCESS_TOKEN);
    cookieStore.delete(COOKIE_ID_TOKEN);
    cookieStore.delete(COOKIE_REFRESH_TOKEN);
  } catch {
    // In Server Components or Layouts during render, Next.js does not allow modifying cookies.
  }
}

export async function refreshTokensWithRefreshToken(
  refreshToken: string,
  username?: string,
): Promise<{ accessToken: string; idToken: string } | null> {
  try {
    const { clientId } = getCognitoConfig();
    const client = getCognitoClient();

    const authParameters: Record<string, string> = {
      REFRESH_TOKEN: refreshToken,
    };

    if (username) {
      const secretHash = getSecretHash(username);
      if (secretHash) {
        authParameters.SECRET_HASH = secretHash;
      }
    }

    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      ClientId: clientId,
      AuthParameters: authParameters,
    });

    const response = await client.send(command);
    const authResult = response.AuthenticationResult;

    if (authResult?.AccessToken && authResult?.IdToken) {
      await setAuthCookies({
        accessToken: authResult.AccessToken,
        idToken: authResult.IdToken,
      });

      return {
        accessToken: authResult.AccessToken,
        idToken: authResult.IdToken,
      };
    }

    return null;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
}

export async function getSession(): Promise<AuthSession> {
  try {
    const cookieStore = await cookies();
    let idToken = cookieStore.get(COOKIE_ID_TOKEN)?.value;
    const refreshToken = cookieStore.get(COOKIE_REFRESH_TOKEN)?.value;

    if (!idToken && !refreshToken) {
      return { user: null };
    }

    let payload = idToken ? decodeJwtPayload(idToken) : null;

    // Check if token is expired
    if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
      if (refreshToken) {
        const username = payload?.["cognito:username"] || payload?.email;
        const refreshed = await refreshTokensWithRefreshToken(
          refreshToken,
          username,
        );
        if (refreshed) {
          idToken = refreshed.idToken;
          payload = decodeJwtPayload(idToken);
        } else {
          await clearAuthCookies();
          return { user: null };
        }
      } else {
        await clearAuthCookies();
        return { user: null };
      }
    }

    if (!payload) {
      return { user: null };
    }

    const name = payload.name || "User";
    const image = payload.picture || generateDefaultAvatarUrl(name);
    const role = (payload["custom:role"] || "student") as "student" | "teacher";

    const user: AuthSessionUser = {
      id: payload.sub || payload["cognito:username"] || payload.email,
      email: payload.email || "",
      name,
      image,
      role,
    };

    return { user };
  } catch (error) {
    console.error("Error retrieving Cognito session:", error);
    return { user: null };
  }
}

export async function getFullUserProfile(): Promise<{
  session: AuthSessionUser | null;
  profile: UserProfile | null;
}> {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;
    let idToken = cookieStore.get(COOKIE_ID_TOKEN)?.value;
    const refreshToken = cookieStore.get(COOKIE_REFRESH_TOKEN)?.value;

    if (!idToken && !accessToken && !refreshToken) {
      return { session: null, profile: null };
    }

    let payload = idToken ? decodeJwtPayload(idToken) : null;

    // Refresh if expired
    if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
      if (refreshToken) {
        const username = payload?.["cognito:username"] || payload?.email;
        const refreshed = await refreshTokensWithRefreshToken(
          refreshToken,
          username,
        );
        if (refreshed) {
          accessToken = refreshed.accessToken;
          idToken = refreshed.idToken;
          payload = decodeJwtPayload(idToken);
        } else {
          await clearAuthCookies();
          return { session: null, profile: null };
        }
      } else {
        await clearAuthCookies();
        return { session: null, profile: null };
      }
    }

    if (!payload) {
      return { session: null, profile: null };
    }

    const userId = payload.sub || payload["cognito:username"] || payload.email;

    // If access token is valid, we can fetch live user attributes from Cognito
    if (accessToken) {
      try {
        const client = getCognitoClient();
        const command = new GetUserCommand({ AccessToken: accessToken });
        const userRes = await client.send(command);
        const attrMap = attributesListToMap(userRes.UserAttributes);

        const profile = mapAttributesToUserProfile(userId, attrMap);
        const name = profile.full_name || payload.name || "User";
        const image =
          profile.picture ||
          payload.picture ||
          generateDefaultAvatarUrl(name);

        const sessionUser: AuthSessionUser = {
          id: userId,
          email: profile.email || payload.email,
          name,
          image,
          role: profile.role,
        };

        return {
          session: sessionUser,
          profile,
        };
      } catch (err: any) {
        // If GetUser fails due to token expiry, fallback to payload or refresh
        console.warn("GetUserCommand warning, using payload claims:", err?.message);
      }
    }

    // Fallback: build profile directly from ID token claims
    const attrMap: Record<string, string> = {};
    for (const [key, value] of Object.entries(payload)) {
      if (typeof value === "string") {
        attrMap[key] = value;
      }
    }

    const profile = mapAttributesToUserProfile(userId, attrMap);
    const name = profile.full_name || payload.name || "User";
    const image =
      profile.picture ||
      payload.picture ||
      generateDefaultAvatarUrl(name);

    const sessionUser: AuthSessionUser = {
      id: userId,
      email: profile.email || payload.email,
      name,
      image,
      role: profile.role,
    };

    return {
      session: sessionUser,
      profile,
    };
  } catch (error) {
    console.error("Error retrieving user profile from Cognito:", error);
    return { session: null, profile: null };
  }
}

// Compatibility layer for code expecting `auth.getSession()`
export const auth = {
  getSession: async () => {
    const session = await getSession();
    return { data: session.user ? session : null };
  },
  signOut: async () => {
    await clearAuthCookies();
    return { success: true };
  },
};
