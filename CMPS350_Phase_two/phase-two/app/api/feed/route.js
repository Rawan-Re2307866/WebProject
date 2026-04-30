import { NextResponse } from "next/server";
import { readFeed } from "@/repos/posts";

export async function GET() {
  const feed = await readFeed();
  return NextResponse.json(feed);
}