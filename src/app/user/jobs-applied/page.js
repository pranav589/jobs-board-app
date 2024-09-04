import { appliedJobs } from "./actions";
import Link from "next/link";
import JobListItem from "@/components/JobListItem";

async function Page() {
  const jobs = await appliedJobs();
  return (
    <main className="max-w-5xl m-auto px-3 my-10 space-y-10">
      <div className="space-y-5 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight lg:text-3xl">
          Job Applications
        </h2>
        <p className="text-muted-foreground">
          Please find the status of your job applications below.
        </p>
      </div>
      <section className="space-y-4 grow">
        {jobs?.map((job) => (
          <Link key={job.id} href={`/jobs/${job.job?.slug}`} className="block">
            <JobListItem job={job?.job} isAppliedJobItem={job} />
          </Link>
        ))}
      </section>
    </main>
  );
}

export default Page;
