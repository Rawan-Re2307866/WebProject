import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { read, update, remove } from "@/repos/posts";


export async function GET({ params }) {
    const post = await read(params.id);
    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
}

export async function PATCH(request, { params }) {
    const session = getSession();

    if (!session) {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }
    const post = await read(params.id);
    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (post.userId !== Number(session.userId)) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    const body = await request.json();
    const updated = await update(params.id, body);
    return NextResponse.json(updated);
}


export async function DELETE({ params }) {
    const session = getSession();
    if (!session) {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }
    const post = await read(params.id);
    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (post.userId !== Number(session.userId)) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    await remove(params.id);
    return NextResponse.json({ message: "Post deleted" });
}