"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import { createJobSchema } from "@/lib/validations/validation";
import { nanoid } from "nanoid";

export async function createJobPost(formData) {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      company: true,
    },
  });
  if (!user.company) {
    throw new Error(
      "Recruiter must be associated with a company before creating a job.",
    );
  }

  const values = Object.fromEntries(formData.entries());

  const { title, type, location, locationType, description, salary } =
    createJobSchema.parse(values);

  const slug = `${generateSlug(title)}-${nanoid(10)}`;

  try {
    const result = await prisma.job.create({
      data: {
        slug,
        title: title?.trim(),
        type,
        locationType,
        description: description?.trim(),
        salary: parseInt(salary),
        location,
        company: {
          connect: { id: session.user.companyId },
        },
        employer: {
          connect: { id: parseInt(session.user.userId) },
        },
      },
    });

    return result;
  } catch (error) {
    let message = "Unexpected Error";
    if (error instanceof Error) {
      message = error.message;
    }

    return { error: message };
  }
}
