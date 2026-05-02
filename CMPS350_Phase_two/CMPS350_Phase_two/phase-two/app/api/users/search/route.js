import { NextResponse } from "next/server";
import { search } from "@/repos/users";

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    if (!query) {
        return NextResponse.json([]);
    }
    const result = await search(query);
    if (result.error) {
        return NextResponse.json(result.error, {
            status: result.error.status || 500
        });
    }
    return NextResponse.json(result.data);
}