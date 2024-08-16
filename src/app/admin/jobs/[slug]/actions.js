"use server";

import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function approvedSubmission(prevState, formData) {
  try {
    const jobId = parseInt(formData.get("jobId"));

    const user = await currentUser();
    if (!user || !isAdmin(user)) {
      throw new Error("Not Authorized");
    }

    await prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        approved: true,
      },
    });

    revalidatePath("/");
  } catch (error) {
    let message = "Unexpected error";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
}

export async function deleteJob(prevState, formData) {
  try {
    const jobId = parseInt(formData.get("jobId"));

    const user = await currentUser();
    if (!user || !isAdmin(user)) {
      throw new Error("Not Authorized");
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (job.companyLogoUrl) {
      await del(job.companyLogoUrl);
    }

    await prisma.job.delete({
      where: {
        id: jobId,
      },
    });
    revalidatePath("/");
  } catch (error) {
    let message = "Unexpected error";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
  redirect("/admin");
}
