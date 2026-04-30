import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { likePost, unlikePost, isLiked } from "@/repos/likes";

export async function POST({ params }) {
    const session = getSession();
    if (!session) {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }
    const postId = params.id;
    const userId = session.userId;
    const alreadyLiked = await isLiked(postId, userId);
    if (alreadyLiked) {
        await unlikePost(postId, userId);
        return NextResponse.json({ liked: false });
    }
    await likePost(postId, userId);
    return NextResponse.json({ liked: true });
}