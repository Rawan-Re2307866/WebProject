import Search from "@/components/Search";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/session";

export default async function AppLayout({ children }) {
  const session = getSession();
  const currentUserId = session?.userId;

  return (
    <>
      <header className="top-bar">
        <img src="/images/logo.png" alt="AR squared logo" className="logo" />
        <Search />
      </header>

      <main>{children}</main>

      <Footer currentUserId={currentUserId} />
    </>
  );
}