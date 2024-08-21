import React from "react";
import NewJobForm from "./NewJobForm";
import { auth } from "@/lib/auth";
import { isEmployer } from "@/lib/utils";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Post a new job",
};

async function Page() {
  const session = await auth();

  if (!session || !isEmployer(session.user)) {
    redirect("/");
  }

  return <NewJobForm />;
}

export default Page;
