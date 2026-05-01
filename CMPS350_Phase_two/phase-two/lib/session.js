import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId");

  if (!userId) return null;

  return { userId: userId.value };
}

