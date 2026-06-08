import { getServerSession } from "next-auth";
import Discord from "next-auth/providers/discord";
import type { NextAuthOptions } from "next-auth";
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";

export const authConfig: NextAuthOptions = {
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id;
      }
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id || "";
        if (token.accessToken) {
          session.accessToken = token.accessToken;
        }
      }
      return session;
    },
  },
};

export async function auth() {
  return getServerSession(authConfig);
}

export { nextAuthSignIn as signIn, nextAuthSignOut as signOut };
