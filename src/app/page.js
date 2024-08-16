import JobFilterSidebar from "@/components/JobFilterSidebar";
import JobResults from "@/components/JobResults";
import H1 from "@/components/ui/h1";

function getTitle({ q, type, location, remote }) {
  const titlePrefix = q
    ? `${q} jobs`
    : type
      ? `${type} developer jobs`
      : remote
        ? `Remote developer jobs`
        : "All developer jobs";

  const titleSuffix = location ? `in ${location}` : "";

  return `${titlePrefix} ${titleSuffix}`;
}

export async function generateMetadata({
  searchParams: { q, type, location, remote },
}) {
  return {
    title: `${getTitle({
      q,
      type,
      location,
      remote: remote === "true" ? true : false,
    })} | Dev Jobs`,
  };
}

export default async function Home({
  searchParams: { q, type, location, remote, page },
}) {
  const filterValues = {
    q,
    type,
    location,
    remote: remote === "true" ? true : false,
  };

  return (
    <main className="max-w-5xl m-auto px-3 my-10 space-y-10">
      <div className="space-y-5 text-center">
        <H1>{getTitle(filterValues)}</H1>
        <p className="text-muted-foreground">Find your dream job.</p>
      </div>
      <section className="flex flex-col md:flex-row gap-4">
        <JobFilterSidebar defaultValues={filterValues} />
        <JobResults
          filterValues={filterValues}
          page={page ? parseInt(page) : undefined}
        />
      </section>
    </main>
  );
}
