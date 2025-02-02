import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

if (!process.env.SESSION_SECRET) {
  new Error("SESSION_SECRET is not defined");
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY);
  const session = await encrypt({ userId, expiresAt });

  const cookieStore = await cookies();
  try {
    cookieStore.set("session", session, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
    });
  } catch (error) {
    console.log("error setting session", error);
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not defined");
  }
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  if (session) {
    try {
      const { payload } = await jwtVerify(session, encodedKey, {
        algorithms: ["HS256"],
      });
      return payload;
    } catch (error) {
      console.log("Failed to verify session", error);
    }
  }
}
