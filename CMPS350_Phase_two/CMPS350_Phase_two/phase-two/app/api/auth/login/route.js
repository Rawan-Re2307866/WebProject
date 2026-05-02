import { NextResponse } from "next/server";
import { readByUsername } from "@/repos/users";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(request) {
    const body = await request.json();
    const username = body.username?.trim();
    const password = body.password.trim();

    if (!username || !password) {
        return NextResponse.json(
            { error: "Username and password are required" },
            { status: 400 }
        );
    }
    
    const result = await readByUsername(username);
    if (result.error) {
        return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 }
        );
    }

    const user = result.data;
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 }
        );
    }
    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, {
    httpOnly: true,
    maxAge: 24 * 60 * 60
});
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
}