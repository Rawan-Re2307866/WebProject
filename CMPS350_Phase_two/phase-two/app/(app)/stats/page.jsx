import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Stats from "@/components/Stats";

export default async function StatsPage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    return (
        <main className="stats-page">
            <h1 className="stats-title">Platform Stats</h1>
            <Stats />
        </main>
    );
}