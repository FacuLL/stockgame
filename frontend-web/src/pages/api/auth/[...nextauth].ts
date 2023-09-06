import { fetch } from "@/shared/utils/fetch";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signOut } from "next-auth/react";
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        type: { type: 'text' }
      },
      async authorize(credentials, req) {
        const res = await fetch(`auth/login/${credentials?.type}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password
          }),
        });
        const data = await res.json();
        if (res.ok && data) return data;
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      const res = await fetch(`user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token.access_token}`
        }
      });
      session.user = await res.json();
      session.user.token = token;
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  debug: true,
  pages: {
    signIn: "/login"
  }
});