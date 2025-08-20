import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./libs/mongo.js";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email repo", // Access to repositories and user info
        },
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session, user, token }) {
      // Add user ID to session for easy access
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      // Store GitHub access token in JWT for API calls
      if (account?.provider === "github") {
        token.githubAccessToken = account.access_token;
        token.githubUsername = profile?.login;
        token.githubUserId = profile?.id;
        token.githubProfilePicture = profile?.avatar_url;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth", // Custom sign-in page
  },
});
