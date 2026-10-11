"use server";

import {
  InitiateAuthCommand,
  SignUpCommand,
  AuthFlowType,
  GlobalSignOutCommand,
  AdminConfirmSignUpCommand,
  AdminUpdateUserAttributesCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  AttributeType,
  DeleteUserCommand,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  getCognitoClient,
  getCognitoConfig,
  getSecretHash,
  generateDefaultAvatarUrl,
  decodeJwtPayload,
} from "@/lib/auth/cognito";
import {
  setAuthCookies,
  clearAuthCookies,
  getFullUserProfile,
  refreshTokensWithRefreshToken,
  COOKIE_ACCESS_TOKEN,
  COOKIE_ID_TOKEN,
  COOKIE_REFRESH_TOKEN,
} from "@/lib/auth/server";
import { loginSchema, LoginInput } from "@/schemas/loginSchema";
import {
  studentRegisterSchemaWithDOB,
  StudentRegisterInput,
} from "@/schemas/studentRegisterSchema";
import {
  teacherRegisterSchemaWithDOB,
  TeacherRegisterInput,
} from "@/schemas/teacherRegisterSchema";
import { cookies } from "next/headers";

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
    const { clientId } = getCognitoConfig();
    const client = getCognitoClient();

    const authParameters: Record<string, string> = {
      USERNAME: email.trim(),
      PASSWORD: password,
    };

    const secretHash = getSecretHash(email.trim());
    if (secretHash) {
      authParameters.SECRET_HASH = secretHash;
    }

    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: clientId,
      AuthParameters: authParameters,
    });

    const response = await client.send(command);
    const authResult = response.AuthenticationResult;

    if (!authResult?.AccessToken || !authResult?.IdToken) {
      return {
        success: false,
        error: "Failed to authenticate. No tokens received from Cognito.",
      };
    }

    await setAuthCookies({
      accessToken: authResult.AccessToken,
      idToken: authResult.IdToken,
      refreshToken: authResult.RefreshToken,
    });

    return {
      success: true,
      data: {
        idToken: authResult.IdToken,
      },
    };
  } catch (error: any) {
    console.error("Login error:", error);

    const name = error?.name;
    const msg = error?.message || "";

    if (name === "NotAuthorizedException") {
      if (msg.includes("USER_PASSWORD_AUTH")) {
        return {
          success: false,
          error:
            "USER_PASSWORD_AUTH flow is not enabled in the Cognito App Client. Please enable ALLOW_USER_PASSWORD_AUTH in AWS Cognito console -> App client -> Authentication flows.",
        };
      }
      return {
        success: false,
        error: "Incorrect email or password.",
      };
    }

    if (name === "UserNotFoundException") {
      return {
        success: false,
        error: "No account found with this email address.",
      };
    }

    if (name === "UserNotConfirmedException") {
      return {
        success: false,
        notConfirmed: true,
        error:
          "User account is not confirmed yet. Please verify your email with the confirmation code.",
      };
    }

    return {
      success: false,
      error: msg || "An unexpected error occurred during login.",
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
    const { clientId, userPoolId } = getCognitoConfig();
    const client = getCognitoClient();

    const formattedDob = `${data.dob.year}-${String(data.dob.month).padStart(
      2,
      "0",
    )}-${String(data.dob.day).padStart(2, "0")}`;

    const pictureUrl = generateDefaultAvatarUrl(data.fullName.trim());

    const userAttributes: AttributeType[] = [
      { Name: "name", Value: data.fullName.trim() },
      { Name: "email", Value: data.email.trim() },
      { Name: "birthdate", Value: formattedDob },
      { Name: "picture", Value: pictureUrl },
      { Name: "custom:role", Value: "student" },
    ];

    if (data.education?.category) {
      userAttributes.push({
        Name: "custom:s_category",
        Value: data.education.category,
      });
    }

    if (data.education?.subcategory) {
      userAttributes.push({
        Name: "custom:s_stream",
        Value: data.education.subcategory,
      });
    }

    if (data.education?.year) {
      userAttributes.push({
        Name: "custom:s_year_of_study",
        Value: data.education.year,
      });
    }

    const secretHash = getSecretHash(data.email.trim());

    const command = new SignUpCommand({
      ClientId: clientId,
      Username: data.email.trim(),
      Password: data.password,
      UserAttributes: userAttributes,
      ...(secretHash ? { SecretHash: secretHash } : {}),
    });

    const signUpResult = await client.send(command);

    // If AWS Admin credentials exist and user is unconfirmed, attempt auto-confirm
    if (
      !signUpResult.UserConfirmed &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      userPoolId
    ) {
      try {
        const confirmCmd = new AdminConfirmSignUpCommand({
          UserPoolId: userPoolId,
          Username: data.email.trim(),
        });
        await client.send(confirmCmd);

        // Mark email_verified as true in Cognito
        try {
          const verifyEmailCmd = new AdminUpdateUserAttributesCommand({
            UserPoolId: userPoolId,
            Username: data.email.trim(),
            UserAttributes: [
              {
                Name: "email_verified",
                Value: "true",
              },
            ],
          });
          await client.send(verifyEmailCmd);
        } catch (verifyErr) {
          console.warn("Failed to set email_verified:", verifyErr);
        }

        signUpResult.UserConfirmed = true;
      } catch (confirmErr) {
        console.warn("Auto-confirm attempt failed:", confirmErr);
      }
    }

    // If user is confirmed, automatically log them in so they transition directly to /dashboard
    if (signUpResult.UserConfirmed) {
      const loginRes = await loginUser({
        email: data.email,
        password: data.password,
      });

      if (loginRes.success) {
        return {
          success: true,
          data: signUpResult,
        };
      }
    }

    // If confirmation is required by Cognito pool (and not auto-confirmed):
    if (!signUpResult.UserConfirmed) {
      return {
        success: false,
        notConfirmed: true,
        error:
          "Account created! AWS Cognito requires email confirmation. Please confirm your email using the verification code sent to your inbox, or disable email verification / enable auto-confirm in your User Pool settings.",
      };
    }

    return {
      success: true,
      data: signUpResult,
    };
  } catch (error: any) {
    console.error("Student registration error:", error);

    const name = error?.name;
    const msg = error?.message || "";

    if (name === "UsernameExistsException") {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }

    if (name === "InvalidPasswordException") {
      return {
        success: false,
        error:
          "Password does not meet AWS Cognito password policy requirements.",
      };
    }

    if (name === "InvalidParameterException") {
      return {
        success: false,
        error: msg || "Invalid parameter provided to Cognito.",
      };
    }

    return {
      success: false,
      error: msg || "An unexpected error occurred during registration.",
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
    const { clientId, userPoolId } = getCognitoConfig();
    const client = getCognitoClient();

    const formattedDob = `${data.dob.year}-${String(data.dob.month).padStart(
      2,
      "0",
    )}-${String(data.dob.day).padStart(2, "0")}`;

    const pictureUrl = generateDefaultAvatarUrl(data.fullName.trim());

    const userAttributes: AttributeType[] = [
      { Name: "name", Value: data.fullName.trim() },
      { Name: "email", Value: data.email.trim() },
      { Name: "birthdate", Value: formattedDob },
      { Name: "picture", Value: pictureUrl },
      { Name: "custom:role", Value: "teacher" },
      {
        Name: "custom:t_highest_degree",
        Value: data.education?.category || "Degree",
      },
      {
        Name: "custom:t_graduated_from",
        Value: data.degreeInstitute.trim(),
      },
      {
        Name: "custom:t_current_institute",
        Value: data.affiliatedInstitute.trim(),
      },
    ];

    const secretHash = getSecretHash(data.email.trim());

    const command = new SignUpCommand({
      ClientId: clientId,
      Username: data.email.trim(),
      Password: data.password,
      UserAttributes: userAttributes,
      ...(secretHash ? { SecretHash: secretHash } : {}),
    });

    const signUpResult = await client.send(command);

    // If AWS Admin credentials exist and user is unconfirmed, attempt auto-confirm
    if (
      !signUpResult.UserConfirmed &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      userPoolId
    ) {
      try {
        const confirmCmd = new AdminConfirmSignUpCommand({
          UserPoolId: userPoolId,
          Username: data.email.trim(),
        });
        await client.send(confirmCmd);

        // Mark email_verified as true in Cognito
        try {
          const verifyEmailCmd = new AdminUpdateUserAttributesCommand({
            UserPoolId: userPoolId,
            Username: data.email.trim(),
            UserAttributes: [
              {
                Name: "email_verified",
                Value: "true",
              },
            ],
          });
          await client.send(verifyEmailCmd);
        } catch (verifyErr) {
          console.warn("Failed to set email_verified:", verifyErr);
        }

        signUpResult.UserConfirmed = true;
      } catch (confirmErr) {
        console.warn("Auto-confirm attempt failed:", confirmErr);
      }
    }

    // If user is confirmed, automatically log them in so they transition directly to /dashboard
    if (signUpResult.UserConfirmed) {
      const loginRes = await loginUser({
        email: data.email,
        password: data.password,
      });

      if (loginRes.success) {
        return {
          success: true,
          data: signUpResult,
        };
      }
    }

    // If confirmation is required by Cognito pool (and not auto-confirmed):
    if (!signUpResult.UserConfirmed) {
      return {
        success: false,
        notConfirmed: true,
        error:
          "Account created! AWS Cognito requires email confirmation. Please confirm your email using the verification code sent to your inbox, or disable email verification / enable auto-confirm in your User Pool settings.",
      };
    }

    return {
      success: true,
      data: signUpResult,
    };
  } catch (error: any) {
    console.error("Teacher registration error:", error);

    const name = error?.name;
    const msg = error?.message || "";

    if (name === "UsernameExistsException") {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }

    if (name === "InvalidPasswordException") {
      return {
        success: false,
        error:
          "Password does not meet AWS Cognito password policy requirements.",
      };
    }

    if (name === "InvalidParameterException") {
      return {
        success: false,
        error: msg || "Invalid parameter provided to Cognito.",
      };
    }

    return {
      success: false,
      error: msg || "An unexpected error occurred during registration.",
    };
  }
}

export async function confirmSignUpUser({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  try {
    const { clientId } = getCognitoConfig();
    const client = getCognitoClient();
    const secretHash = getSecretHash(email.trim());

    const command = new ConfirmSignUpCommand({
      ClientId: clientId,
      Username: email.trim(),
      ConfirmationCode: code.trim(),
      ...(secretHash ? { SecretHash: secretHash } : {}),
    });

    await client.send(command);
    return { success: true };
  } catch (error: any) {
    console.error("Confirm sign-up error:", error);
    return {
      success: false,
      error: error?.message || "Failed to confirm sign up.",
    };
  }
}

export async function resendConfirmationCode(email: string) {
  try {
    const { clientId } = getCognitoConfig();
    const client = getCognitoClient();
    const secretHash = getSecretHash(email.trim());

    const command = new ResendConfirmationCodeCommand({
      ClientId: clientId,
      Username: email.trim(),
      ...(secretHash ? { SecretHash: secretHash } : {}),
    });

    await client.send(command);
    return { success: true };
  } catch (error: any) {
    console.error("Resend confirmation code error:", error);
    return {
      success: false,
      error: error?.message || "Failed to resend confirmation code.",
    };
  }
}

export async function signOutUser() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;

    if (accessToken) {
      try {
        const client = getCognitoClient();
        const command = new GlobalSignOutCommand({
          AccessToken: accessToken,
        });
        await client.send(command);
      } catch (err: any) {
        console.warn("Global sign-out warning:", err?.message);
      }
    }

    await clearAuthCookies();
    return { success: true };
  } catch (error: any) {
    console.error("Sign out error:", error);
    await clearAuthCookies();
    return { success: true };
  }
}

export async function getCurrentUserProfile() {
  return await getFullUserProfile();
}

export async function deleteUserAccount() {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;
    const refreshToken = cookieStore.get(COOKIE_REFRESH_TOKEN)?.value;
    const idToken = cookieStore.get(COOKIE_ID_TOKEN)?.value;

    if (!accessToken && !refreshToken && !idToken) {
      await clearAuthCookies();
      return {
        success: false,
        error: "No active user session found to delete.",
      };
    }

    // If access token is missing but refresh token is present, try refreshing
    if (!accessToken && refreshToken) {
      const payload = idToken ? decodeJwtPayload(idToken) : null;
      const username = payload?.["cognito:username"] || payload?.email;
      const refreshed = await refreshTokensWithRefreshToken(
        refreshToken,
        username,
      );
      if (refreshed?.accessToken) {
        accessToken = refreshed.accessToken;
      }
    }

    const client = getCognitoClient();
    let deleted = false;

    if (accessToken) {
      try {
        const command = new DeleteUserCommand({
          AccessToken: accessToken,
        });
        await client.send(command);
        deleted = true;
      } catch (err: any) {
        console.warn("DeleteUserCommand failed:", err?.message);
        if (err?.name === "UserNotFoundException") {
          deleted = true;
        } else if (refreshToken) {
          // Attempt token refresh and retry
          const payload = idToken ? decodeJwtPayload(idToken) : null;
          const username = payload?.["cognito:username"] || payload?.email;
          const refreshed = await refreshTokensWithRefreshToken(
            refreshToken,
            username,
          );
          if (refreshed?.accessToken) {
            try {
              const retryCmd = new DeleteUserCommand({
                AccessToken: refreshed.accessToken,
              });
              await client.send(retryCmd);
              deleted = true;
            } catch (retryErr: any) {
              console.warn(
                "Retry DeleteUserCommand failed:",
                retryErr?.message,
              );
              if (retryErr?.name === "UserNotFoundException") {
                deleted = true;
              }
            }
          }
        }
      }
    }

    // Fallback: AdminDeleteUserCommand if DeleteUserCommand was not successful
    if (!deleted) {
      const { userPoolId } = getCognitoConfig();
      if (
        process.env.AWS_ACCESS_KEY_ID &&
        process.env.AWS_SECRET_ACCESS_KEY &&
        userPoolId
      ) {
        let username: string | undefined;
        if (idToken) {
          const payload = decodeJwtPayload(idToken);
          username =
            payload?.["cognito:username"] || payload?.sub || payload?.email;
        }
        if (username) {
          try {
            const adminCommand = new AdminDeleteUserCommand({
              UserPoolId: userPoolId,
              Username: username,
            });
            await client.send(adminCommand);
            deleted = true;
          } catch (adminErr: any) {
            console.error("AdminDeleteUserCommand failed:", adminErr?.message);
            if (adminErr?.name === "UserNotFoundException") {
              deleted = true;
            }
          }
        }
      }
    }

    if (!deleted) {
      return {
        success: false,
        error: "Failed to delete account from AWS Cognito. Please try again.",
      };
    }

    await clearAuthCookies();
    return { success: true };
  } catch (error: any) {
    console.error("Delete user account error:", error);
    return {
      success: false,
      error: error?.message || "Failed to delete user account.",
    };
  }
}
