import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { readAll, create } from "@/repos/posts";

export async function GET(request) {
    const result = await readAll();

    if (result.error) {
        return NextResponse.json(result.error, {
            status: result.error.status || 500
        });
    }

    return NextResponse.json(result.data);
}

export async function POST(request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json(
            { error: "Not logged in" },
            { status: 401 }
        );
    }
    const body = await request.json();
    if (!body.content || !body.type) {
        return NextResponse.json(
            { error: "Content and type are required" },
            { status: 400 }
        );
    }
    const result = await create({
        type: body.type,
        content: body.content,
        caption: body.caption || null,
        userId: session.userId
    });
    if (result.error) {
        return NextResponse.json(result.error, {
            status: result.error.status || 500
        });
    }
    return NextResponse.json(result.data, { status: 201 });
}