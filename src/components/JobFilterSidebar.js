import prisma from "@/lib/prisma";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Select from "./ui/select";
import { jobTypes } from "@/lib/job-types";
import { Button } from "./ui/button";
import { jobFilterSchema } from "@/lib/validations/validation";
import { redirect } from "next/navigation";
import FormSubmitButton from "./FormSubmitButton";

async function filterJobs(formData) {
  "use server";

  //converts form data to objects
  const values = Object.fromEntries(formData.entries());

  const { q, type, location, remote } = jobFilterSchema.parse(values);

  //if q exist the pass that object and same for other
  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type: type.trim() }),
    ...(location && { location: location.trim() }),
    ...(remote && { remote: "true" }),
  });
  redirect(`/?${searchParams.toString()}`);
}

async function JobFilterSidebar({ defaultValues }) {
  const locations = await prisma.job
    .findMany({
      where: { approved: true },
      select: { location: true },
      distinct: ["location"],
    })
    .then((locs) => {
      return locs.map((location) => location?.location).filter(Boolean);
    });
  return (
    <aside className="md:w-[260px] p-4 sticky top-0 bg-background h-fit border rounded-lg">
      <form action={filterJobs} key={JSON.stringify(defaultValues)}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input
              id="q"
              name="q"
              placeholder="Title, company, etc."
              defaultValue={defaultValues?.q}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Select
              id="type"
              name="type"
              defaultValue={defaultValues?.type || ""}
            >
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location"> Location</Label>
            <Select
              id="location"
              name="location"
              defaultValue={defaultValues?.location || ""}
            >
              <option value={""}>All locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="remote"
              name="remote"
              type="checkbox"
              className="scale-125 accent-black"
              defaultChecked={defaultValues?.remote}
            />
            <Label htmlFor="remote">Remote Jobs</Label>
          </div>
          <FormSubmitButton type="submit" className="w-full">
            Filter Jobs
          </FormSubmitButton>
        </div>
      </form>
    </aside>
  );
}

export default JobFilterSidebar;
