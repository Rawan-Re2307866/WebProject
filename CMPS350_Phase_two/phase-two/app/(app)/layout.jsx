import Header from "@/components/Header";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function AppLayout({ children }) {
    return (
        <>
        <Header />
            {children}
        <Footer />
        </>
    );
}