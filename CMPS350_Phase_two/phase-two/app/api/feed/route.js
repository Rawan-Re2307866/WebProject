import { NextResponse } from "next/server";
import { readFeed } from "@/repos/posts";
import { getSession } from "@/lib/session";

export async function GET(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Not logged in" },
      { status: 401 }
    );
  }
  const result = await readFeed(session.userId);
  if (result.error) {
    return NextResponse.json(result.error, {
      status: result.error.status || 500
    });
  }
  return NextResponse.json(result.data);
}
export const dynamic = "force-dynamic";