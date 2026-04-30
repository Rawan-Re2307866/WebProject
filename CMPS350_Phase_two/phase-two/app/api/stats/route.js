import { NextResponse } from "next/server";
import { getStats } from "@/repos/stats";

export async function GET() {
  const stats = await getStats();
  return NextResponse.json(stats);
}