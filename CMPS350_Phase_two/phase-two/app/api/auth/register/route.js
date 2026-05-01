import { NextResponse } from "next/server";
import { create, readByUsername } from "@/repos/users";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request) {
  const body = await request.json();
  const { username, email, password, bio, profilePicture } = body;
  if (!username || !email || !password) {
    return NextResponse.json(
      { error: "Username, email and password are required" },
      { status: 400 }
    );
  }
  const existingUser = await readByUsername(username);
  if (existingUser.data) {
    return NextResponse.json(
      { error: "Username already exists" },
      { status: 400 }
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await create({
    username,
    email,
    password: hashedPassword,
    bio: bio || null,
    profilePicture: profilePicture || undefined
  });
  if (result.error) {
    return NextResponse.json(result.error, {
      status: result.error.status || 500
    });
  }
  const cookieStore = await cookies();
  cookieStore.set("userId", result.data.id, {
    httpOnly: true,
    maxAge: 24 * 60 * 60
  });

  const user = result.data;
  const { password: _, ...userWithoutPassword } = user;
  return NextResponse.json(userWithoutPassword, { status: 201 });
}