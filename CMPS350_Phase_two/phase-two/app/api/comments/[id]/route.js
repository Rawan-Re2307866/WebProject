import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { create, remove } from "@/repos/comments";

export async function POST(request, { params }) {
    const session = getSession();
    if (!session) {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }
    const body = await request.json();
    const comment = await create({
        content: body.content,
        postId: params.id,
        userId: session.userId
    });
    return NextResponse.json(comment, { status: 201 });
}


export async function DELETE(request, { params }) {
    const session = getSession();
    if (!session) {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }
    if (!comment) {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    if (comment.userId !== session.userId) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    await remove(params.id);
    return NextResponse.json({ message: "Comment deleted" });
}