import { NextResponse } from "next/server";
import { getStats } from "@/repos/stats";

export async function GET(request) {
  const result = await getStats();
  if (result.error) {
    return NextResponse.json(result.error, {
      status: result.error.status || 500
    });
  }
  return NextResponse.json(result.data);
}