import JobDetailsPage from "@/components/JobDetailsPage";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import React, { cache } from "react";

export const dynamic = "force-dynamic";

const getJob = cache(async (slug) => {
  const job = await prisma.job.findUnique({
    where: {
      slug,
    },
  });
  if (!job) {
    return notFound();
  }
  return job;
});

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
  const job = await getJob(slug);

  const { applicationEmail, applicationUrl } = job;

  const applicationLink = applicationEmail
    ? `mailto:${applicationEmail}`
    : applicationUrl;

  return (
    <main className="max-w-5xl px-3 m-auto my-10 flex flex-col md:flex-row items-center gap-5 md:items-start">
      <JobDetailsPage job={job} />
      <aside>
        <Button asChild>
          <a href={applicationLink} className="w-40 md:w-fit">
            Apply
          </a>
        </Button>
      </aside>
    </main>
  );
}

export default Page;
