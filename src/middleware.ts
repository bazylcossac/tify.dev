export { auth } from "@/auth";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/home",
    "/profile",
    "/notifications",
    "/explore",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

const middleware = () => {
  return NextResponse.next();
};

export default middleware;
