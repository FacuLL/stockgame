import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// For the time being, the withAuth middleware only supports "jwt" as session strategy.
export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuthenticated = !!token;
    if (isAuthenticated) return NextResponse.redirect(new URL("/home", req.url));
    }
);

// specify on which routes you want to run the middleware
export const config = {
  matcher: ["/", "/login"],
};