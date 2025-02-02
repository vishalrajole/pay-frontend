import { API_URL } from "@/helpers/api";
import { cookies } from "next/headers";

const getHeaders = async () => {
  const cookieStore = await cookies();

  return {
    Cookie: cookieStore.get("Authentication")?.value || "",
  };
};

export const post = async (path: string, formData: FormData) => {
  const response = await fetch(`${API_URL}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await getHeaders()),
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  const parsedResponse = await response.json();

  if (!response.ok) {
    return {
      data: null,
      error: parsedResponse.message[0] || "Something went wrong",
    };
  }

  return { data: parsedResponse, error: "" };
};

export const get = async (path: string) => {
  const response = await fetch(`${API_URL}/${path}`, {
    method: "GET",
    headers: await getHeaders(),
  });

  const parsedResponse = await response.json();

  console.log("parsedResponseparsedResponse", parsedResponse);

  if (!response.ok) {
    throw new Error(parsedResponse.message);
  }
  return parsedResponse;
};
