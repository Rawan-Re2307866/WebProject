import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { readAll, create } from "@/repos/posts";


export async function GET() {
    const posts = await readAll();
    return NextResponse.json(posts);
}


export async function POST(request) {
    const session = getSession();
    if (!session) {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }
    const body = await request.json();

    if (!body.content || !body.type) {
        return NextResponse.json(
            { error: "Content and type are required" },
            { status: 400 }
        );
    }
    const post = await create({
        type: body.type,
        content: body.content,
        caption: body.caption || null,
        userId: session.userId
    });
    return NextResponse.json(post, { status: 201 });
}