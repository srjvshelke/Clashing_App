// // import { withAuth } from "next-auth/middleware";
// // import { NextRequest,NextResponse } from "next/server";
// export {default} from "next-auth/middleware";
// // // export default withAuth({
// // //   pages: {
// // //     signIn: "/auth/signin", // Redirect if not authenticated
// // //   },
// // //   callbacks: {
// // //     authorized: ({ token, req }: { token: any; req: NextRequest }) => {
// // //       const protectedRoutes = ["/dashboard", "/settings"];
// // //       const isProtected = protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path));

// // //       // Allow access if the route is not protected or if the user has a valid session token
// // //       return !isProtected || !!token;
// // //     },
// // //   },
// // // });
// // export async function middleware(request:NextRequest) {
// //    return NextResponse.redirect(new URL('/',request.url));
// //   };
// // // Apply middleware to specific routes
// // export const config = {
// //   matcher: ["/login", "/","/Dashboard/:path*"], // Protect specific routes
// // };





import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";

export default withAuth({
  pages: {
    signIn: "/auth/signin", // Redirect if not authenticated
  },
  callbacks: {
    authorized: ({ token, req }: { token: any; req: NextRequest }) => {
      const protectedRoutes = ["/dashboard", "/settings"];
      const isProtected = protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path));

      // Allow access if the route is not protected or if the user has a valid session token
      return !isProtected || !!token;
    },
  },
});

// Apply middleware to specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*"], // Protect specific routes
};
