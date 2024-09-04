"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function appliedJobs() {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Not Authorized");
    }
    const result = await prisma.user.findFirst({
      where: {
        id: parseInt(session?.user?.userId),
      },
      include: {
        applications: {
          include: {
            job: true,
          },
        },
      },
    });

    return result?.applications;
  } catch (error) {
    let message = "Unexpected error";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
}
