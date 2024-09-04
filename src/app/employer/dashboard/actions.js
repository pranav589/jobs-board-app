"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { isEmployer } from "@/lib/utils";

export const getJobsPosted = async () => {
  const session = await auth();

  const result = await prisma.job.findMany({
    where: {
      employerId: parseInt(session?.user?.userId),
    },
    include: {
      applications: {
        include: {
          user: true,
        },
      },
    },
  });
  return result;
};

export const changeApplicationStatus = async (selectedApplication) => {
  const session = await auth();

  if (!isEmployer(session.user)) {
    throw new Error("Not Authorized");
  }

  try {
    const isExist = await prisma.job.findFirst({
      where: {
        id: selectedApplication.jobId,
        employerId: parseInt(session?.user?.userId),
      },
    });

    if (!isExist) {
      throw new Error(
        "You don't have access to update the status of this application.",
      );
    }

    const status = await prisma.application.updateMany({
      where: {
        AND: {
          userId: parseInt(selectedApplication?.applicationUserId),
          jobId: selectedApplication?.jobId,
        },
      },
      data: {
        status: selectedApplication?.status,
      },
    });
    return status;
  } catch (error) {
    let message = "Unexpected Error";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
};
