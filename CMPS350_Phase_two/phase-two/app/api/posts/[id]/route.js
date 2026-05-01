import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { read, update, remove } from "@/repos/posts";


export async function GET(request, { params }) {
  const { id } = params;
  const post = await read(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PATCH(request, { params }) {
  const { id } = params;
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  const post = await read(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  if (post.userId !== session.userId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  const body = await request.json();
  const updated = await update(id, body);
  return NextResponse.json(updated);
}


export async function DELETE(request, { params }) {
  const { id } = params;
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  const post = await read(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  if (post.userId !== session.userId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  await remove(id);
  return NextResponse.json({ message: "Post deleted" });
}