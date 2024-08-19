import AdminHeader from "./AdminHeader";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

export const Metadata = {
  title: "Admin",
};

async function Layout({ children }) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <AdminHeader />
      {children}
    </SessionProvider>
  );
}

export default Layout;
