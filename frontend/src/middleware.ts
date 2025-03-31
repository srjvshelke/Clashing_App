// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
 

// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname

//   const isPublicPath = path === '/login' || path === '/register' || path === '/verifyemail'

//   const token = request.cookies.get('token')?.value || ''

//   if(isPublicPath && token) {
//     return NextResponse.redirect(new URL('/Dashboard', request.nextUrl))
//   }

//   if (!isPublicPath && !token) {
//     return NextResponse.redirect(new URL('/login', request.nextUrl))
//   }
    
// }

 
// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: [
//     '/',
//     '/profile',
//     '/login',
//     '/register',
//     // '/verifyemail'
//   ]
// }


import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Redirect to login page if not authenticated
  },
});

export const config = { matcher: ["/dashboard", "/", "/clash/items/:path*"] };
