import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { toggle } from "@/repos/likes";

export async function POST(request, { params }) {
    const session = getSession();
    if (!session) {
        return NextResponse.json(
            { error: "Not logged in" },
            { status: 401 }
        );
    }
    const postId = params.id;       
    const userId = session.userId; 
    const result = await toggle(userId, postId);

    return NextResponse.json(result);
}