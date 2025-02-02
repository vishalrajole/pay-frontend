"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { post } from "@/lib/fetch";

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

  const { error } = await post("users", formData);
  if (error) {
    return {
      errors: {
        email: error,
        password: error,
      },
    };
  }
  redirect("/login");
}
