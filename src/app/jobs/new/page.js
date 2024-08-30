import React from "react";
import NewJobForm from "./NewJobForm";
import { auth } from "@/lib/auth";
import { isEmployer } from "@/lib/utils";
import { redirect } from "next/navigation";
import { getCompanyDetails } from "@/app/user/profile/companyActions";

export const metadata = {
  title: "Post a new job",
};

async function Page() {
  const session = await auth();
  const company = await getCompanyDetails();

  if (!session || !isEmployer(session.user)) {
    redirect("/");
  }

  return <NewJobForm company={company} />;
}

export default Page;
