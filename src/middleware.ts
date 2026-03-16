import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
    // Allow all API routes to pass through without redirect
    if (request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next();
    }
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico
         * - public files
         * - api routes (handled by the route themselves)
         */
        '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
    ],
};
