import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt';
// import type { JWT } from 'next-auth/jwt';
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
//   return NextResponse.redirect(new URL('/', request.url))
    const token = await getToken({req:request})
    const url=request.nextUrl;
    if(token &&
        url.pathname.startsWith('/sign-in')||
        url.pathname.startsWith('/sign-up')||
        url.pathname.startsWith('/verify')
    ){console.log(token,"in if");
    return NextResponse.redirect(new URL('/dashboard', request.url))}
    console.log(token,"not in if");
    // return NextResponse.redirect(new URL('/', request.url))
    
    
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-in',
    '/sign-upp',
    '/dashboard/:path*',
    '/verifyy/:path*'
  ]
}