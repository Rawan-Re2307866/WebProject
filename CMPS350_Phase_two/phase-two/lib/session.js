import { cookies } from "next/headers";

export function getSession() {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId");

  if (!userId) return null;

  return { userId: userId.value };
}

