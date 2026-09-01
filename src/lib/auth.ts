import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

function getAuthUrl(req?: any): string {
  if (typeof window !== "undefined") return window.location.origin;
  const proto = req?.headers?.["x-forwarded-proto"] || "https";
  const host = req?.headers?.["x-forwarded-host"] || req?.headers?.host || process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${proto}://${host}`;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { patient: true, doctor: true },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!valid) return null;

        // Log successful login
        try {
          await prisma.activityLog.create({
            data: {
              type: "LOGIN",
              userId: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            },
          });
        } catch (e) {
          console.error("Failed to log login activity:", e);
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          patientId: user.patient?.id,
          doctorId: user.doctor?.id,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async signIn({ user }) {
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.patientId = (user as any).patientId;
        token.doctorId = (user as any).doctorId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).patientId = token.patientId;
        (session.user as any).doctorId = token.doctorId;
      }
      return session;
    },
  },
};
