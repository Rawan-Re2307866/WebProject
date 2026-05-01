import { NextResponse } from "next/server";
import { getStats } from "@/repos/stats";

export async function GET(request) {
  const stats = await getStats();
  return NextResponse.json(stats);
}