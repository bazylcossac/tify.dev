export { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// export const config = {
//   matcher: [
//     "/home",
//     "/profile",
//     "/notifications",
//     "/explore",
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };

// middleware.ts

// the following code is taken from : https://nextjs.org/docs/advanced-features/middleware#setting-headers
export function middleware(request: NextRequest) {
  return NextResponse.next({
    request: {
      "x-pathname": request.nextUrl.pathname,
    },
  });
}
