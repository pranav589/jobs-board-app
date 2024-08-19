import { auth } from "@/lib/auth";
import LoginForm from "./LoginForm";
import { redirect } from "next/navigation";

async function Page() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <div className="w-full">
      <LoginForm />
    </div>
  );
}

export default Page;
