import JobDetailsPage from "@/components/JobDetailsPage";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import React from "react";
import AdminSidebar from "./AdminSidebar";

async function Page({ params: { slug } }) {
  const job = await prisma.job.findUnique({
    where: {
      slug,
    },
  });

  if (!job) notFound();
  return (
    <main className="flex m-auto my-10 max-w-5xl flex-col items-center gap-5 px-3 md:flex-row md:items-start">
      <JobDetailsPage job={job} />
      <AdminSidebar job={job} />
    </main>
  );
}

export default Page;
