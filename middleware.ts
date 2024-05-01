import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";



// function hasUserToken() {
//   console.log(typeof window);
//   if (typeof window !== "undefined") {
//     return localStorage.getItem("token");
//   }
//   return false;
// }

export function middleware(request: NextRequest) {
  console.log("working");

  // const userToken = hasUserToken();
  const user = true;
  if (!user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home"],
};
