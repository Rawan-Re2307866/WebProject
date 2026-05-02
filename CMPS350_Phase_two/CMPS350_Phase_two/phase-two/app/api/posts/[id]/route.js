import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { read, update, remove } from "@/repos/posts";

export async function GET(request, { params }) {
  const { id } = await params;
  const result = await read(id);
  if (result.error) {
    return NextResponse.json(result.error, {
      status: result.error.status || 500
    });
  }
  return NextResponse.json(result.data);
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Not logged in" },
      { status: 401 }
    );
  }

  const result = await read(id);

  if (result.error) {
    return NextResponse.json(result.error, {
      status: result.error.status || 500
    });
  }

  const post = result.data;

  if (post.userId !== session.userId) {
    return NextResponse.json(
      { error: "Not authorized" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const updateResult = await update(id, body);

  if (updateResult.error) {
    return NextResponse.json(updateResult.error, {
      status: updateResult.error.status || 500
    });
  }
  return NextResponse.json(updateResult.data);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Not logged in" },
      { status: 401 }
    );
  }

  const result = await read(id);

  if (result.error) {
    return NextResponse.json(result.error, {
      status: result.error.status || 500
    });
  }

  const post = result.data;

  if (post.userId !== session.userId) {
    return NextResponse.json(
      { error: "Not authorized" },
      { status: 403 }
    );
  }

  const deleteResult = await remove(id);

  if (deleteResult.error) {
    return NextResponse.json(deleteResult.error, {
      status: deleteResult.error.status || 500
    });
  }

  return NextResponse.json({ message: "Post deleted" });
}