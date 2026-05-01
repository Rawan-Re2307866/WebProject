import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { read, update, remove } from "@/repos/users";
import bcrypt from "bcrypt";

export async function GET(request, { params }) {
  const { id } = params;

  const result = await read(id);

  if (result.error) {
    return NextResponse.json(result.error, {
      status: result.error.status || 500
    });
  }

  const user = result.data;

  const { password: _, ...userWithoutPassword } = user;

  return NextResponse.json(userWithoutPassword);
}

export async function PATCH(request, { params }) {
  const { id } = params;
  const session = getSession();
  
  if (!session) {
    return NextResponse.json(
      { error: "Not logged in" },
      { status: 401 }
    );
  }
  if (session.userId !== id) {
    return NextResponse.json(
      { error: "Not authorized" },
      { status: 403 }
    );
  }
  const body = await request.json();
  if (body.password) {
    body.password = await bcrypt.hash(body.password, 10);
  }
  const result = await update(id, body);
  if (result.error) {
    return NextResponse.json(result.error, {
      status: result.error.status || 500
    });
  }
  const user = result.data;
  const { password: _, ...userWithoutPassword } = user;
  return NextResponse.json(userWithoutPassword);
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const session = getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Not logged in" },
      { status: 401 }
    );
  }
  if (session.userId !== id) {
    return NextResponse.json(
      { error: "Not authorized" },
      { status: 403 }
    );
  }
  const result = await remove(id);
  if (result.error) {
    return NextResponse.json(result.error, {
      status: result.error.status || 500
    });
  }
  const response = NextResponse.json({ message: "User deleted" });
  response.cookies.set("userId", "", { maxAge: 0 });
  return response;
}