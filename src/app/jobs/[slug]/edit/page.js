import React from "react";
import NewJobForm from "../../new/NewJobForm";
import { auth } from "@/lib/auth";
import { isEmployer } from "@/lib/utils";
import { redirect } from "next/navigation";
import { getCompanyDetails } from "@/app/user/profile/companyActions";
import { getJob } from "../actions";

export const metadata = {
  title: "Edit job",
};

async function Page({ params: { slug } }) {
  const session = await auth();
  const company = await getCompanyDetails();
  const getExistingJobDetails = slug ? await getJob(slug) : null;

  if (!session || !isEmployer(session.user)) {
    redirect("/");
  }

  return (
    <NewJobForm company={company} existingJobDetails={getExistingJobDetails} />
  );
}

export default Page;
