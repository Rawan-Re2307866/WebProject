import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { read } from "@/repos/posts";
import SinglePost from "@/components/SinglePost";

export default async function PostPage({ params }) {
    const session = await getSession();
    if (!session) redirect("/login");

    const { id } = await params;
    const result = await read(id);
    if (result.error) redirect("/");

    return (
        <SinglePost
            post={result.data}
            currentUserId={session.userId}
        />
    );
}