import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { prisma } from "./lib/db";
import { userSchema } from "./lib/zod-schemas";

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
        return Response.redirect(new URL("/", request.nextUrl));
      }
      if (isLoggedIn && isTryinToAccessLadningPage) {
        return false;
      }

      return false;
    },

    async jwt({ token }) {
      //
      return token;
    },
    async session({ session }) {
      const currentUser = session?.user;

      if (currentUser) {
        const userValidate = userSchema.safeParse(currentUser);

        if (!userValidate.success) {
          throw new Error("Failed to validate user");
        }

        const { name, email, image } = userValidate.data;

        const user = await prisma.user.upsert({
          where: {
            email,
          },
          create: {
            name: name,
            email: email,
            image: image,
            username: "",
            backgroundImage: "",
          },
          update: {
            name: name,
            image: image,
          },
        });
        session.userId = user.id;
        session.userBackground = user.backgroundImage;
        session.premiumStatus = user.premium;

        return session;
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
