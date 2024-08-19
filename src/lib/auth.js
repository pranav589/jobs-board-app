import NextAuth from "next-auth";

import Credentials from "next-auth/providers/credentials";
import { saltAndHashPassword } from "./utils";
import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@email.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }
        const email = credentials.email;

        try {
          let user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) {
            return null;
          }

          const isMatch = bcrypt.compareSync(
            credentials.password,
            user.password,
          );
          if (isMatch) {
            return user;
          }
        } catch (error) {
          let message = "Unexpected Error";
          if (error instanceof Error) {
            message = error.message;
          }
          return { error: message };
        }
      },
    }),
  ],
});
