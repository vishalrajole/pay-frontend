"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/api/session";
import { API_URL } from "@/helpers/api";

const signUpSchema = z.object({
  email: z
    .string({ required_error: "Required" })
    .email({ message: "Invalid email address" })
    .trim(),
  password: z
    .string({ required_error: "Required" })
    .min(3, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function signUpAction(_: unknown, formData: FormData) {
  if (!(formData instanceof FormData)) {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }
  const result = signUpSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const res = await fetch(`${API_URL}/users`, {
    method: "POST",

    body: formData,
  });

  const data = await res.json();

  console.log("adsfgvcxa", data);
  if (!res.ok) {
    return {
      errors: {
        email: data.message ? data.message : ["Invalid email"],
        password: ["Invalid password"],
      },
    };
  }

  // await createSession(testUser.id);

  redirect("/login");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
