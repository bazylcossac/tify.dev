export { auth as middleware } from "@/auth";
export const config = {
  // matcher: ["/home", "/profile", "/notifications", "/explore"],
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
