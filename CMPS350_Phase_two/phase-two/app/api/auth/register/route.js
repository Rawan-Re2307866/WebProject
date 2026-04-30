import { NextResponse } from "next/server";
import { create, readByUsername } from "@/repos/users";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

export async function POST(request) {
  const body = await request.json();
  const { email, password, username, name } = body;
  if (!email || !password || !username || !name) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }
  const existingUser = await readByUsername(username);
  if (existingUser) {
    return NextResponse.json({ error: "Username already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await create({
    email,
    password: hashedPassword,
    username,
    name
  });
  
  cookies().set("userId", user.id.toString(), {
    httpOnly: true,
    maxAge: 24 * 60 * 60
  });

  return NextResponse.json(user, { status: 201 });
}