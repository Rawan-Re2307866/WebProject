import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { read, update, remove } from "@/repos/users";
import bcrypt from "bcrypt";


export async function GET({ params }) {
    const { id } = params;
    const user = await read(id);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
}


export async function PATCH(request, { params }) {
    const { id } = params;
    const body = await request.json();
    const session = getSession();
    if (!session) {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }
    if (session.userId !== id) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    if (body.password) {
        body.password = await bcrypt.hash(body.password, 10);
    }
    const updatedUser = await update(id, body);
    if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const { password: _, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
}


export async function DELETE({ params }) {
    const { id } = params;
    const session = getSession();
    if (!session) {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }
    if (session.userId !== id) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    const success = await remove(id);
    if (!success) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const response = NextResponse.json({ message: "User deleted" });
    response.cookies.set("userId", "", { maxAge: 0 });
    return response;
}