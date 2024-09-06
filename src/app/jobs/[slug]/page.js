import JobDetailsPage from "@/components/JobDetailsPage";
import prisma from "@/lib/prisma";
import React from "react";
import { existingApplication, getJob } from "./actions";
import JobApplicationPopup from "./JobApplicationPopup";
import { getProfileDetails } from "@/app/user/profile/profileActions";
import { auth } from "@/lib/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const jobs = await prisma.job.findMany({
    where: {
      approved: true,
    },
    select: {
      slug: true,
    },
  });
  return jobs.map(({ slug }) => slug);
}

export async function generateMetadata({ params: { slug } }) {
  const job = await getJob(slug);

  return {
    title: job.title,
  };
}

async function Page({ params: { slug } }) {
  const session = await auth();
  const job = await getJob(slug);
  let profileData = null;
  let isAlreadyApplied = null;

  if (session) {
    profileData = await getProfileDetails();
    isAlreadyApplied = await existingApplication(job?.id);
  }

  return (
    <main className="max-w-5xl px-3 m-auto my-10 flex flex-col md:flex-row items-center gap-5 md:items-start">
      <JobDetailsPage job={job} />
      <aside>
        {session ? (
          <JobApplicationPopup
            job={job}
            profileData={profileData}
            isAlreadyApplied={isAlreadyApplied}
            disabled={!job?.activeStatus}
          />
        ) : (
          <Link
            className="text-muted-foreground w-max flex underline"
            href={"/login"}
          >
            Login to apply
          </Link>
        )}
      </aside>
    </main>
  );
}

export default Page;
