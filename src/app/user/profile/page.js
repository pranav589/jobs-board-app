import React from "react";
import CompanyForm from "./CompanyForm";
import { getCompanyDetails } from "./companyActions";
import { auth } from "@/lib/auth";
import { isCandidate, isEmployer } from "@/lib/utils";
import CandidateForm from "./CandidateForm";
import { getProfileDetails } from "./profileActions";

async function Page() {
  const session = await auth();

  if (isEmployer(session?.user)) {
    const company = await getCompanyDetails();
    return <CompanyForm company={company} />;
  }
  if (isCandidate(session?.user)) {
    const profileDetails = await getProfileDetails();
    return <CandidateForm profileDetails={profileDetails} />;
  }
}

export default Page;
