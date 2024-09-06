"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { isEmployer } from "@/lib/utils";
import { revalidatePath } from "next/cache";

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
    orderBy: {
      createdAt: "desc", // Order by createdAt in descending order
    },
  });
  return result;
};

export const changeApplicationStatus = async (selectedApplication) => {
  try {
    const session = await auth();
    if (!isEmployer(session.user)) {
      throw new Error("Not Authorized");
    }

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

export const changeJobActivationStatus = async (job, activeStatus) => {
  try {
    const session = await auth();
    if (!isEmployer(session.user)) {
      throw new Error("Not Authorized");
    }

    if (job.employerId !== parseInt(session?.user?.userId)) {
      throw new Error("You don't have access to update.");
    }

    const result = await prisma.job.update({
      where: {
        id: job.id,
        employerId: parseInt(session?.user?.userId),
      },
      data: {
        activeStatus: activeStatus,
      },
    });
    revalidatePath("/employer/dashboard");
    return result;
  } catch (error) {
    let message = "Unexpected Error";
    if (error instanceof Error) {
      message = error.message;
    }
    console.log({ error });
    return { error: message };
  }
};
