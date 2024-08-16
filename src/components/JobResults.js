import React from "react";
import JobListItem from "./JobListItem";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

async function JobResults({ filterValues, page = 1 }) {
  const { q, type, location, remote } = filterValues;

  const jobsPerPage = 3;
  const skip = (page - 1) * jobsPerPage;

  const searchString = q
    ?.split(" ")
    .filter((word) => word?.length > 0)
    .join(" & ");

  const searchFilter = searchString
    ? {
        OR: [
          {
            title: { search: searchString },
          },
          {
            companyName: { search: searchString },
          },
          {
            type: { search: searchString },
          },
          {
            location: { search: searchString },
          },
          {
            locationType: { search: searchString },
          },
        ],
      }
    : {};

  const where = {
    AND: [
      searchFilter,
      type ? { type } : {},
      location ? { location } : {},
      remote ? { locationType: "Remote" } : {},
      { approved: true },
    ],
  };

  const jobsPromise = prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: jobsPerPage,
    skip: skip,
  });

  const countPromise = prisma.job.count({ where });
  const [jobs, totalCount] = await Promise.all([jobsPromise, countPromise]);

  return (
    <div className="space-y-4 grow">
      {jobs.map((job) => (
        <Link key={job.id} href={`/jobs/${job.slug}`} className="block">
          <JobListItem job={job} />
        </Link>
      ))}
      {jobs.length === 0 && <p className="text-center"> No Jobs Found.</p>}
      {jobs.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(totalCount / jobsPerPage)}
          filterValues={filterValues}
        />
      )}
    </div>
  );
}

export default JobResults;

function Pagination({
  currentPage,
  totalPages,
  filterValues: { q, type, location, remote },
}) {
  function generatePageLink(page) {
    const searchParams = new URLSearchParams({
      ...(q && { q }),
      ...(type && { type }),
      ...(location && { location }),
      ...(remote && { remote: "true" }),
      page: page.toString(),
    });
    return `/?${searchParams.toString()}`;
  }
  return (
    <div className="flex justify-between">
      <Link
        href={generatePageLink(currentPage - 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage <= 1 && "invisible",
        )}
      >
        <ArrowLeft size={16} />
        Previous
      </Link>
      <span className="font-semibold">
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={generatePageLink(currentPage + 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage >= totalPages && "invisible",
        )}
      >
        Next
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
