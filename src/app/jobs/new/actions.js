"use server";

import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import { createJobSchema } from "@/lib/validation";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import path from "path";

export async function createJobPost(formData) {
  console.log(formData);
  const values = Object.fromEntries(formData.entries());

  const {
    title,
    type,
    companyLogo,
    companyName,
    location,
    locationType,
    applicationEmail,
    applicationUrl,
    description,
    salary,
  } = createJobSchema.parse(values);

  const slug = `${generateSlug(title)}-${nanoid(10)}`;

  let companyLogoUrl = undefined;
  if (companyLogo) {
    const blob = await put(
      `company_logos/${slug}${path.extname(companyLogo.name)}`,
      companyLogo,
      {
        access: "public",
        addRandomSuffix: false,
      },
    );
    companyLogoUrl = blob.url;
  }
  await prisma.job.create({
    data: {
      slug,
      title: title?.trim(),
      type,
      companyName: companyName?.trim(),
      companyLogoUrl,
      locationType,
      location,
      applicationEmail: applicationEmail?.trim(),
      applicationUrl: applicationUrl?.trim(),
      description: description?.trim(),
      salary: parseInt(salary),
    },
  });
  redirect(`/job-submitted`);
}
