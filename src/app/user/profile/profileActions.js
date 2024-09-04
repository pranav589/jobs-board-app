"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { excludePassword, isCandidate } from "@/lib/utils";
import { candidateProfileSchema } from "@/lib/validations/profileValidation";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import path from "path";

export async function getProfileDetails() {
  const session = await auth();

  if (!session) {
    throw Error("Access Denied");
  }
  const result = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  return excludePassword(result);
}

export async function updateProfileAction(formData) {
  const session = await auth();

  const values = Object.fromEntries(formData.entries());

  const { userName, image, address, email, experience, resume } =
    candidateProfileSchema.parse(values);

  try {
    let resumeUrl = undefined;
    let userImageUrl = undefined;
    if (!isCandidate(session?.user)) {
      throw Error("Access Denied");
    }

    if (resume && typeof resume !== "string") {
      const blob = await put(
        `candidates_resumes/${userName}${path.extname(resume.name)}`,
        resume,
        {
          access: "public",
          addRandomSuffix: false,
        },
      );
      resumeUrl = blob.url;
    }
    if (image && typeof image !== "string") {
      const blob = await put(
        `candidates_profile/${userName}${path.extname(image.name)}`,
        image,
        {
          access: "public",
          addRandomSuffix: false,
        },
      );
      userImageUrl = blob.url;
    }
    const result = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        userName,
        address,
        image: userImageUrl,
        experience,
        address,
        resume: resumeUrl,
      },
    });
    revalidatePath("/user/profile");
    return {
      id: result.id,
    };
  } catch (error) {
    let message = "Unexpected Error";
    if (error instanceof Error) {
      message = error.message;
    }

    return { error: message };
  }
}
