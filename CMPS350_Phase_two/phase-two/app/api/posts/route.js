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
    const post = await create({
        ...body,
        userId: Number(session.userId)
    });
    return NextResponse.json(post, { status: 201 });
}