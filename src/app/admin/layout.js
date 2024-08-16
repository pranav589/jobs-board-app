import { ClerkProvider } from "@clerk/nextjs";
import AdminHeader from "./AdminHeader";

export const Metadata = {
  title: "Admin",
};

function Layout({ children }) {
  return (
    <ClerkProvider>
      <AdminHeader />
      {children}
    </ClerkProvider>
  );
}

export default Layout;
