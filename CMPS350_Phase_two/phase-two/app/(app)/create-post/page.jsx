
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Post from "@/components/Post";
import { read } from "@/repos/users";

export default async function CreatePostPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const result = await read(session.userId);
    const user = result.data;

    return <Post user={user} />;

}