import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Register from "@/components/Register";

export default function RegisterPage() {
    
    return <Register />;
}