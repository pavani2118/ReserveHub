
"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/lib/validators/auth";
import { AuthError } from "next-auth";

type LoginState = {
  error: string | null;
};

export async function loginAction(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const validated = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return {
      error: "Please enter a valid email and password.",
    };
  }

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error:
          error.type === "CredentialsSignin"
            ? "Invalid email or password."
            : "Unable to sign in. Please try again.",
      };
    }

    throw error;
  }

  return { error: null };
}
