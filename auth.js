import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import connectMongo from "./lib/mongoose.js";
import User from "./models/User.js";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      authorization: {
        params: {
          scope: "user:email repo" // Access to user email and repositories
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add user ID and GitHub data to session from token
      if (token?.sub) {
        session.user.id = token.sub;
        session.githubAccessToken = token.githubAccessToken;
        session.githubUsername = token.githubUsername;
      }
      return session;
    },
    async jwt({ token, account, profile, user }) {
      // Store the OAuth account ID and profile data in the token
      if (account && profile) {
        token.githubId = account.providerAccountId;
        token.githubUsername = profile.login;
        token.githubAccessToken = account.access_token;
        
        // Get user ID from database (set in signIn callback)
        if (user?.id) {
          token.sub = user.id;
        }
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      if (account.provider === "github") {
        try {
          // Connect to MongoDB to save/update user data
          await connectMongo();
          
          // Find or create user with GitHub data - STORING ACCESS TOKEN IN DATABASE
          const userData = await User.findOneAndUpdate(
            { 
              $or: [
                { email: profile.email || user.email },
                { githubUserId: account.providerAccountId }
              ]
            },
            {
              githubUsername: profile.login,
              githubUserId: account.providerAccountId,
              githubAccessToken: account.access_token, // ✅ STORED IN DATABASE
              githubProfilePicture: profile.avatar_url,
              email: profile.email || user.email,
              updatedAt: new Date()
            },
            { 
              upsert: true, 
              new: true,
              setDefaultsOnInsert: true 
            }
          );

          // Add the user's database ID to the user object
          user.id = userData._id.toString();
          
          console.log("✅ User synced to custom User model:", profile.login);
          console.log("📍 User ID set to:", userData._id.toString());
        } catch (error) {
          console.error("❌ Error saving user data:", error);
          // Continue with sign in even if database save fails
        }
      }
      return true;
    }
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET, // Ensure JWT encryption works properly
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/auth",
    error: "/auth"
  }
});
