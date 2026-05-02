import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";  
import { read } from "@/repos/users";      
import Profile from "@/components/Profile";

export default async function ProfilePage({ params }) {
    const session = await getSession();
    if (!session) redirect("/login");

    const { id } = await params; 
    const result = await read(id);
    if (result.error) redirect('/');


    return <Profile user={result.data} currentUserId={session.userId} />;
}