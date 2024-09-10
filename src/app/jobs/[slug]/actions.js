"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cache } from "react";

const { auth } = require("@/lib/auth");
const { isCandidate } = require("@/lib/utils");

export const getJob = cache(async (slug) => {
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

export const existingApplication = cache(async (jobId) => {
  const session = await auth();
  const res = await prisma.application.findFirst({
    where: {
      userId: parseInt(session?.user?.userId),
      jobId: jobId,
    },
  });
  return res;
});

export async function applyForJob(jobId) {
  try {
    const session = await auth();

    if (!isCandidate(session?.user)) {
      throw new Error("Only candidates can apply for jobs.");
    }

    // Check if the job exists and is available
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new Error("The job does not exist.");
    }

    // Check if the candidate has already applied for this job
    const isAlreadyApplied = await existingApplication(jobId);
    if (isAlreadyApplied) {
      throw new Error("You have already applied for this job.");
    }

    const application = await prisma.application.create({
      data: {
        user: {
          connect: { id: parseInt(session.user.userId) },
        },
        job: {
          connect: { id: parseInt(jobId) },
        },
        status: "APPLIED",
      },
    });
    revalidatePath(`/jobs/${job?.slug}`);
    return application;
  } catch (error) {
    let message = "Unexpected Error";
    if (error instanceof Error) {
      message = error.message;
    }

    return { error: message };
  }
}
