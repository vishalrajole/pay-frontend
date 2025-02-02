"use client";
import React, { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signUpAction } from "./actions";

export default function SignUpForm() {
  const [state, signUp, isPending] = useActionState(signUpAction, null);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Sign up
        </h2>
        <form action={signUp} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              name="email"
              type="text"
              id="email"
              placeholder="Enter email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {state?.errors?.email && (
              <p className="text-red-500 text-sm">{state.errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              name="password"
              type="password"
              id="password"
              placeholder="Enter password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {state?.errors?.password && (
              <p className="text-red-500 text-sm">{state.errors.password}</p>
            )}
          </div>

          <Button type="submit" className="w-full mt-4" disabled={isPending}>
            {isPending ? "Loading..." : "Sign up"}
          </Button>
          <Link
            href="/login"
            className="w-full flex justify-center mt-4 underline"
          >
            Login
          </Link>
        </form>
      </div>
    </div>
  );
}
