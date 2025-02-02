"use server";

import { z } from "zod";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { API_URL } from "@/helpers/api";
import { cookies } from "next/headers";

const loginSchema = z.object({
  email: z
    .string({ required_error: "Required" })
    .email({ message: "Invalid email address" })
    .trim(),
  password: z
    .string({ required_error: "Required" })
    .min(3, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function loginAction(_: unknown, formData: FormData) {
  if (!(formData instanceof FormData)) {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const response = await fetch(`${API_URL}/${"auth/login"}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  const parsedResponse = await response.json();
  if (!response.ok) {
    throw new Error(parsedResponse.message);
  }

  await setAuthCookie(response);
  redirect("/payments");
}

const setAuthCookie = async (response: Response) => {
  const setCookieHeader = response.headers.get("Set-Cookie");
  if (setCookieHeader) {
    const token = setCookieHeader.split(";")[0].split("=")[1];
    const cookieStore = await cookies();

    cookieStore.set({
      name: "Authentication",
      value: token,
      secure: true,
      httpOnly: true,
      expires: new Date(jwtDecode(token).exp! * 1000),
    });
  }
};

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("Authentication");
  redirect("/login");
}
