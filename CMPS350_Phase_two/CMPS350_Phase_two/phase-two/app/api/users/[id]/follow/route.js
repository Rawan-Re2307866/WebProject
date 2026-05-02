import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { toggle } from "@/repos/follows";

export async function POST(request, { params }) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json(
            { error: "Not logged in" },
            { status: 401 }
        );
    }
    const { id } = await params; 

    const followerId = session.userId;
    const followingId = id;
    if (followerId === followingId) {
        return NextResponse.json(
            { error: "You cannot follow yourself" },
            { status: 400 }
        );
    }
    const result = await toggle(followerId, followingId);
    if (result.error) {
        return NextResponse.json(result.error, {
            status: result.error.status || 500
        });
    }
    return NextResponse.json({
        following: result.following
    });
}