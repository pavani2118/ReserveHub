
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators/auth";

export const { handlers, auth, signIn, signOut } =
  NextAuth({
    // Custom Login Page
    pages: {
      signIn: "/login",
    },

    // Session Configuration
    session: {
      strategy: "jwt",
    },

    // Authentication Providers
    providers: [
      Credentials({
        credentials: {
          email: {
            label: "Email",
            type: "email",
          },
          password: {
            label: "Password",
            type: "password",
          },
        },

        async authorize(credentials) {
          const result = loginSchema.safeParse(credentials);

          if (!result.success) {
            return null;
          }

          const { email, password } = result.data;

          // Find user in PostgreSQL
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            return null;
          }

          // Verify hashed password
          const validPassword = await compare(
            password,
            user.passwordHash
          );

          if (!validPassword) {
            return null;
          }

          // Return authenticated user
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        },
      }),
    ],

    // JWT and Session Callbacks
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.userId = user.id;
          token.role = user.role;
        }

        return token;
      },

      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.userId as string;

          session.user.role = token.role as
            "ADMIN" | "MEMBER";
        }

        return session;
      },
    },
  });
