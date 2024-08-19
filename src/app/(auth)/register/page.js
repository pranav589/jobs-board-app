import { auth } from "@/lib/auth";
import RegisterForm from "./RegisterForm";
import { redirect } from "next/navigation";

async function Page() {
  const session = await auth();

  if (session) {
    redirect("/");
  }
  return (
    <div className="w-full">
      <RegisterForm />
    </div>
  );
}

export default Page;
