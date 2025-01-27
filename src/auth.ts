import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized: async ({ auth, request }) => {
      const isLoggedIn = !!auth?.user;
      const isTryinToAccess = request.url !== "/";
      const isTryinToAccessLadningPage = request.url === "/";
      // User is logged in and trying to access a protected route
      if (isLoggedIn && isTryinToAccess) {
        return true;
      }
      // User is not logged in and trying to access a protected route
      if (!isLoggedIn && isTryinToAccess) {
        return false;
      }
      if (isLoggedIn && isTryinToAccessLadningPage) {
        return false;
      }

      return false;
    },
    async redirect({ url, baseUrl }) {
      const parsedUrl = new URL(url);
      if (parsedUrl.pathname === "/") {
        return `${baseUrl}/home`;
      }
      /// If user has callback url in url it's redirecting to /home page
      return `${baseUrl}/home`;
    },
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
      }
      return session;
    },
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
});
