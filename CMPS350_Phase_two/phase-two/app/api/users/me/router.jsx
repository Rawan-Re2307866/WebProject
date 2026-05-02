import { getSession } from "@/lib/session";
import { remove } from "@/repos/users";
import { cookies } from "next/headers";

export async function DELETE() {
    const session = await getSession();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await remove(session.userId);

    const cookieStore = await cookies();
    cookieStore.delete("userId");

    return Response.json({ success: true });
}