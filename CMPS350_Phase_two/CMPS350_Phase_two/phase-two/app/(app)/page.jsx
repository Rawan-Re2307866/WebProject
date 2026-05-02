import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Feed from "@/components/Feed";

export default async function FeedPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    return (
        <main className="feed">
            <section className="post-container">
                <Feed currentUserId={session.userId}/>
            </section>
        </main>
    );
}