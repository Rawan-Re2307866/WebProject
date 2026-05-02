import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { toggle } from "@/repos/likes";

export async function POST(request, { params }) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json(
            { error: "Not logged in" },
            { status: 401 }
        );
    }
    const {id} = await params;
    const postId = id;
    const userId = session.userId;
    const result = await toggle(userId, postId);

    if (result.error) {
        return NextResponse.json(result.error, {
            status: result.error.status || 500
        });
    }
    return NextResponse.json({
        liked: result.liked
    });
}
