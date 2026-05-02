import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/session";

export default async function AppLayout({ children }) {
  const session = await getSession();
  const currentUserId = session?.userId;
  console.log("currentUserId:", currentUserId);

  return (
    <>
      <Header />
      {children}
      <Footer currentUserId={currentUserId} />
    </>
  );
}