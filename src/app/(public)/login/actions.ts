"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/api/session";

const testUser = {
  id: "12345243",
  email: "test@test.com",
  password: "test",
};

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

  const { email, password } = result.data;

  if (email !== testUser.email || password !== testUser.password) {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }

  await createSession(testUser.id);

  redirect("/payments");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
