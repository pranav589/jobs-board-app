"use server";

import { auth } from "@/lib/auth";
import { createCompanySchema } from "@/lib/validations/companyValidation";
import prisma from "@/lib/prisma";
import { isEmployer } from "@/lib/utils";
import { put } from "@vercel/blob";
import path from "path";
import { cache } from "react";
import { revalidatePath } from "next/cache";

export const getCompanyDetails = cache(async () => {
  const session = await auth();
  const result = await prisma.company.findUnique({
    where: {
      email: session.user.email,
    },
  });
  return result;
});

export async function updateCompanyDetails(formData) {
  const session = await auth();

  const values = Object.fromEntries(formData.entries());

  const { name, address, email, logo, url } = createCompanySchema.parse(values);
  try {
    let companyLogoUrl = undefined;
    if (!isEmployer(session?.user)) {
      throw Error("Access Denied");
    }

    if (logo && typeof logo !== "string") {
      const blob = await put(
        `company_logos/${name}${path.extname(logo.name)}`,
        logo,
        {
          access: "public",
          addRandomSuffix: false,
        },
      );
      companyLogoUrl = blob.url;
    }
    const result = await prisma.company.update({
      where: {
        email: session.user.email,
      },
      data: {
        name,
        address,
        logo: companyLogoUrl,
        url,
      },
    });
    revalidatePath("/user/profile");
    return result;
  } catch (error) {
    let message = "Unexpected Error";
    if (error instanceof Error) {
      message = error.message;
    }

    return { error: message };
  }
}
