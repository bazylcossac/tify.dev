export { auth } from "@/auth";

export const config = {
  matcher: [
    "/home",
    "/profile",
    "/notifications",
    "/explore",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
