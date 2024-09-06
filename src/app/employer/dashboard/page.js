import JobsTable from "@/components/JobsTable";
import { TableCell } from "@/components/ui/table";
import { auth } from "@/lib/auth";
import { isEmployer, relativeDate } from "@/lib/utils";
import { BriefcaseIcon, PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { getJobsPosted } from "./actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getCompanyDetails } from "@/app/user/profile/companyActions";
import Link from "next/link";
import ViewApplications from "./ViewApplications";
import RenderActionButtons from "./RenderActionButtons";

async function Page() {
  const session = await auth();
  const postedJobs = await getJobsPosted();
  const companyDetails = await getCompanyDetails();

  if (!isEmployer(session?.user)) {
    redirect("/");
  }

  const { name, email, logo } = companyDetails ?? {};

  return (
    <main className="max-w-5xl px-3 m-auto my-10 flex flex-col md:flex-row items-center gap-5 md:items-start">
      <JobsTable
        renderActions={(job) => {
          return <RenderActionButtons job={job} />;
        }}
        data={postedJobs}
        columns={["Job Title", "Date Posted", "Applicants", "Status"]}
        renderRow={(job) => <RenderRows job={job} />}
      >
        <header className="flex items-start justify-between mb-8 flex-col md:flex-row md:items-center">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={logo} alt={name} />
              <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{name}</h1>
              <p className="text-muted-foreground">{email}</p>
              <p className="text-muted-foreground"></p>
            </div>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link href={"/jobs/new"}>
              <PlusIcon className="mr-2 h-4 w-4" /> Post New Job
            </Link>
          </Button>
        </header>
      </JobsTable>
    </main>
  );
}

export default Page;

const RenderRows = ({ job }) => {
  return (
    <>
      <TableCell className="font-medium">
        <div className="flex items-center space-x-2">
          <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          <span>{job.title}</span>
        </div>
      </TableCell>
      <TableCell>{relativeDate(job?.createdAt)}</TableCell>
      <TableCell>
        {job.applications.length}
        <ViewApplications applications={job?.applications} />
      </TableCell>
      <TableCell>{job.activeStatus ? "Active" : "Inactive"}</TableCell>
    </>
  );
};
