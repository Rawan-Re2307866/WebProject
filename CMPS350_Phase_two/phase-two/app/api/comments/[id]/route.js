import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { create, remove, read } from "@/repos/comments";

export async function POST(request, { params }) {
    const session = getSession();

    if (!session) {
        return NextResponse.json(
            { error: "Not logged in" },
            { status: 401 }
        );
    }

    const body = await request.json();

    if (!body.content || !body.content.trim()) {
        return NextResponse.json(
            { error: "Comment content is required" },
            { status: 400 }
        );
    }

    const result = await create({
        content: body.content.trim(),
        postId: params.id,
        userId: session.userId
    });

    if (result.error) {
        return NextResponse.json(result.error, {
            status: result.error.status || 500
        });
    }

    return NextResponse.json(result.data, { status: 201 });
}


export async function DELETE(request, { params }) {
    const session = getSession();
    if (!session) {
        return NextResponse.json(
            { error: "Not logged in" },
            { status: 401 }
        );
    }
    const result = await read(params.id);
    if (result.error) {
        return NextResponse.json(result.error, {
            status: result.error.status || 500
        });
    }
    const comment = result.data;
    if (comment.userId !== session.userId) {
        return NextResponse.json(
            { error: "Not authorized" },
            { status: 403 }
        );
    }
    const deleteResult = await remove(params.id);
    if (deleteResult.error) {
        return NextResponse.json(deleteResult.error, {
            status: deleteResult.error.status || 500
        });
    }
    return NextResponse.json({ message: "Comment deleted" });
}