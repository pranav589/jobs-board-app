"use server";

import { signIn, signOut } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validations/authValidation";
import { EMPLOYER } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { saltAndHashPassword } from "@/lib/utils";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

const getUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    let message = "Unexpected error";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
};

export const login = async (formData) => {
  const values = Object.fromEntries(formData.entries());

  const { email, password } = loginSchema.parse(values);
  try {
    await signIn("credentials", { email, password });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};

export const registerUser = async (formData) => {
  const values = Object.fromEntries(formData.entries());

  const { email, password, userName, role } = registerSchema.parse(values);
  let result = null;
  try {
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      const hash = saltAndHashPassword(password);
      result = await prisma.user.create({
        data: {
          email,
          password: hash,
          role,
          userName,
        },
      });
      role === EMPLOYER &&
        (await prisma.company.create({
          data: {
            email: email,
            name: "",
            address: "",
            users: {
              connect: {
                id: result.id,
              },
            },
          },
        }));
    } else {
      throw new Error("User already exists");
    }
    revalidatePath("/admin");
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
};

export const logoutUser = async () => {
  await signOut();
  revalidatePath("/admin");
};
